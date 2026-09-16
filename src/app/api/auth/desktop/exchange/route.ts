import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSecretConfigured, getServiceSupabaseClient } from "@/lib/supabase/server";
import {
  DESKTOP_AUTH_ERRORS,
  DESKTOP_AUTH_TTL_SECONDS,
  extractDesktopCredential,
  isWellFormedDesktopCode,
  type DesktopAuthExchangeUser,
} from "@/lib/desktopAuth";
import { hashDesktopSecret, secretDigestsEqual } from "@/lib/desktopAuthServer";

/**
 * Redeems the one-time desktop authorization.
 *
 * Two callers use this endpoint:
 *
 *  - The current desktop app sends the code it generated for
 *    `/auth/desktop?code=…` as a single credential field (`{ "code": … }`,
 *    or `auth_code` / `authorization_code` / `token`). The server looks the
 *    request up by the code's SHA-256 hash.
 *  - The legacy `start` flow sends `{ request_id, device_secret }`; the
 *    request is located by `request_id` and the secret must hash-match.
 *
 * The request must be `bound` to a user by `/api/auth/desktop/complete`
 * before it can be redeemed. Redemption is ATOMIC: a single guarded UPDATE
 * flips `bound → redeemed`, so exactly one caller can ever win.
 *
 * Responses:
 *   - 202 `{ status: "pending" }`            → the browser hasn't finished yet; poll again.
 *   - 200 `{ status: "authenticated", user }` → succeeded; `user` is a verified,
 *                                                 server-computed account snapshot.
 *   - 400 invalid / 410 expired|already_used  → terminal; stop polling.
 *
 * No token or secret is ever returned beyond the one-time exchange; the
 * desktop app receives only the account snapshot it needs to authenticate
 * locally against the authoritative backend.
 */

interface DesktopAuthRow {
  id: string;
  request_id: string;
  code_hash: string;
  user_id: string | null;
  status: string;
  created_at: string | null;
  expires_at: string;
  bound_at: string | null;
  used_at: string | null;
}

type DesktopAuthLookupColumn = "request_id" | "code_hash" | "id";

function parseBody(request: Request): Promise<Record<string, unknown> | null> {
  return request.json().catch(() => null);
}

async function readRowBy(
  admin: SupabaseClient,
  column: DesktopAuthLookupColumn,
  value: string
): Promise<DesktopAuthRow | null> {
  const { data } = await admin
    .from("desktop_auth_sessions")
    .select("*")
    .eq(column, value)
    .order("created_at", { ascending: true })
    .limit(1);
  const rows = data as DesktopAuthRow[] | null;
  return rows?.[0] ?? null;
}

/**
 * Registers a desktop session as `pending` when no row exists yet. Used by the
 * code-based flow so an early exchange poll queued before the browser page has
 * been visited gets `pending` (poll again) instead of a terminal error.
 * Idempotent: a concurrent insert colliding on `request_id`/`code_hash`
 * (unique) is not a failure.
 */
async function ensurePendingRow(
  admin: SupabaseClient,
  requestId: string,
  codeHash: string
): Promise<DesktopAuthRow | null> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + DESKTOP_AUTH_TTL_SECONDS * 1000);
  const { error: insertError } = await admin.from("desktop_auth_sessions").insert({
    request_id: requestId,
    code_hash: codeHash,
    status: "pending",
    created_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
  });
  if (insertError && insertError.code !== "23505") return null;
  return readRowBy(admin, "code_hash", codeHash);
}

function pendingResponse() {
  return NextResponse.json({ status: DESKTOP_AUTH_ERRORS.PENDING }, { status: 202 });
}

function invalidResponse() {
  return NextResponse.json(
    { error: "This sign-in request is invalid.", code: DESKTOP_AUTH_ERRORS.INVALID },
    { status: 400 }
  );
}

function expiredResponse() {
  return NextResponse.json(
    {
      error: "This sign-in request has expired. Please start again from the Bricky AI desktop app.",
      code: DESKTOP_AUTH_ERRORS.EXPIRED,
    },
    { status: 410 }
  );
}

function alreadyUsedResponse() {
  return NextResponse.json(
    {
      error: "This sign-in request has already been used once.",
      code: DESKTOP_AUTH_ERRORS.ALREADY_USED,
    },
    { status: 410 }
  );
}

/** Idempotent profile ensure + authoritative account snapshot for the app. */
async function buildExchangeUser(userId: string): Promise<DesktopAuthExchangeUser> {
  const admin = getServiceSupabaseClient();
  const { data: authUser } = await admin.auth.admin.getUserById(userId);

  // Idempotent profile ensure (id/email + updated_at only — never credits or
  // subscription). Mirrors the claim-starter route so the app always gets a
  // complete account snapshot.
  await admin.from("profiles").upsert(
    { id: userId, email: authUser?.user?.email ?? null, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );

  const { data: profile } = await admin
    .from("profiles")
    .select("email, email_verified, credits, subscription, subscription_expires_at")
    .eq("id", userId)
    .maybeSingle();

  const rawEmail = (profile as { email?: string | null } | null)?.email;
  const rawVerified = (profile as { email_verified?: boolean | null } | null)?.email_verified;
  const rawCredits = (profile as { credits?: number | null } | null)?.credits;
  const rawSubscription = (profile as { subscription?: string | null } | null)?.subscription;
  const rawExpiry = (profile as { subscription_expires_at?: string | null } | null)?.subscription_expires_at;

  return {
    id: userId,
    email: rawEmail ?? authUser?.user?.email ?? null,
    email_verified: rawVerified ?? Boolean(authUser?.user?.email_confirmed_at),
    credits: rawCredits ?? null,
    subscription: rawSubscription ?? null,
    subscription_expires_at: rawExpiry ?? null,
  };
}

/**
 * Redeems a `bound` session atomically. `secretHash` is the SHA-256 hash of
 * the presented code/secret and acts as a second guard in the UPDATE, so even
 * a stale read can never redeem a row whose hash changed.
 */
async function redeemBound(
  admin: SupabaseClient,
  row: DesktopAuthRow,
  secretHash: string
): Promise<NextResponse> {
  const { data: redeemed, error: redeemError } = await admin
    .from("desktop_auth_sessions")
    .update({ status: "redeemed", used_at: new Date().toISOString() })
    .eq("id", row.id)
    .eq("status", "bound")
    .eq("code_hash", secretHash)
    .select("user_id")
    .maybeSingle();

  if (!redeemError && redeemed && typeof redeemed.user_id === "string") {
    const user = await buildExchangeUser(redeemed.user_id);
    return NextResponse.json({ status: "authenticated", user });
  }

  // Lost a race with another call, or the row moved to a terminal state.
  const fresh = await readRowBy(admin, "id", row.id);
  if (!fresh) return invalidResponse();
  if (new Date(fresh.expires_at).getTime() <= Date.now() || fresh.status === "expired") {
    return expiredResponse();
  }
  if (fresh.status === "redeemed") return alreadyUsedResponse();
  return invalidResponse();
}

async function evaluateRow(
  admin: SupabaseClient,
  row: DesktopAuthRow,
  secretHash: string
): Promise<NextResponse> {
  const expired = new Date(row.expires_at).getTime() <= Date.now() || row.status === "expired";
  if (expired) {
    await admin
      .from("desktop_auth_sessions")
      .update({ status: "expired" })
      .eq("id", row.id)
      .eq("status", "pending");
    return expiredResponse();
  }
  if (row.status === "pending") return pendingResponse();
  if (row.status === "bound") return redeemBound(admin, row, secretHash);
  if (row.status === "redeemed") return alreadyUsedResponse();
  return invalidResponse();
}

export async function POST(request: Request) {
  if (!isSecretConfigured) {
    return NextResponse.json(
      { error: "Desktop sign-in isn't configured for this deployment yet." },
      { status: 501 }
    );
  }

  const body = await parseBody(request);
  const admin = getServiceSupabaseClient();

  // Primary flow: { requestId, deviceSecret } from `/api/auth/desktop/start`.
  // (snake_case field names accepted too for desktop-app integration leniency)
  const rawRequestId = body?.requestId ?? body?.["request_id"];
  const rawLegacySecret = body?.deviceSecret ?? body?.device_secret;
  const legacyRequestId = typeof rawRequestId === "string" ? rawRequestId.trim() : "";
  const legacySecret = typeof rawLegacySecret === "string" ? rawLegacySecret.trim() : "";
  if (legacyRequestId && legacySecret) {
    const row = await readRowBy(admin, "request_id", legacyRequestId);
    if (!row) return invalidResponse();
    const secretHash = hashDesktopSecret(legacySecret);
    if (!secretDigestsEqual(secretHash, row.code_hash)) return invalidResponse();
    return evaluateRow(admin, row, secretHash);
  }

  // Code-based flow: the code is the shared credential, looked up by its hash.
  const code = extractDesktopCredential(body);
  if (!code || !isWellFormedDesktopCode(code)) return invalidResponse();

  const codeHash = hashDesktopSecret(code);
  let row = await readRowBy(admin, "code_hash", codeHash);
  if (!row) {
    row = await ensurePendingRow(admin, code, codeHash);
    if (!row) {
      return NextResponse.json(
        { error: "Bricky AI couldn't complete the sign-in right now. Please try again." },
        { status: 500 }
      );
    }
  }

  return evaluateRow(admin, row, codeHash);
}