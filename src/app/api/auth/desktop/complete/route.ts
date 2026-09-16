import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  isSecretConfigured,
  getServiceSupabaseClient,
} from "@/lib/supabase/server";
import {
  DESKTOP_AUTH_ERRORS,
  DESKTOP_AUTH_TTL_SECONDS,
  isWellFormedDesktopCode,
} from "@/lib/desktopAuth";
import { hashDesktopSecret } from "@/lib/desktopAuthServer";

/**
 * Binds an in-flight desktop sign-in request to the browser-authenticated
 * user.
 *
 * Called from `/auth/desktop` with a validated Supabase access token. Two
 * payloads are accepted:
 *
 *  - Code-based flow (primary): `{ requestId, code }` where `requestId` IS the
 *    code carried in the `/auth/desktop?code=…` URL. The row is located by the
 *    code's SHA-256 hash, created as `pending` if it does not exist yet (an
 *    early exchange poll from the app may have raced the page load).
 *  - Legacy flow: `{ requestId }` for a row created by
 *    `/api/auth/desktop/start`.
 *
 * This marks the row `bound` to the user id; only then can the desktop app
 * redeem the one-time code at `/api/auth/desktop/exchange`.
 *
 * The binding is atomic (guarded UPDATE), so two browser tabs cannot bind the
 * same request to different accounts. Rebinding the SAME account is idempotent
 * (a page reload after a successful handshake returns `ok` again), so the
 * browser is never left stuck on the sign-in page.
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
 * code-based flow: the browser may be the first actor to touch a fresh code.
 * Idempotent — a concurrent insert (e.g. an exchange poll) that already created
 * the row is not a failure.
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

function invalidRequestResponse() {
  return NextResponse.json(
    {
      error: "This sign-in request is missing or invalid.",
      code: DESKTOP_AUTH_ERRORS.INVALID_REQUEST,
    },
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

function evaluateBind(row: DesktopAuthRow, userId: string): NextResponse {
  if (new Date(row.expires_at).getTime() <= Date.now() || row.status === "expired") {
    return expiredResponse();
  }
  if (row.status === "bound" || row.status === "redeemed") {
    if (row.user_id === userId) {
      // Same user reloading the page after the handshake — treat as success so
      // the browser never gets stuck on the sign-in page.
      return NextResponse.json({ ok: true });
    }
    if (row.status === "bound") {
      return NextResponse.json(
        {
          error: "This sign-in request is already connected to another Google account.",
          code: DESKTOP_AUTH_ERRORS.ALREADY_BOUND,
        },
        { status: 409 }
      );
    }
    return alreadyUsedResponse();
  }
  return invalidRequestResponse();
}

async function attemptBind(
  admin: SupabaseClient,
  row: DesktopAuthRow,
  userId: string
): Promise<NextResponse> {
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    await admin
      .from("desktop_auth_sessions")
      .update({ status: "expired" })
      .eq("id", row.id)
      .eq("status", "pending");
    return expiredResponse();
  }

  if (row.status === "pending") {
    const { data: bound, error: bindError } = await admin
      .from("desktop_auth_sessions")
      .update({ user_id: userId, status: "bound", bound_at: new Date().toISOString() })
      .eq("id", row.id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();
    if (!bindError && bound) {
      return NextResponse.json({ ok: true });
    }
    // Lost a race with another tab — re-evaluate the current state below.
    const fresh = await readRowBy(admin, "id", row.id);
    if (fresh) return evaluateBind(fresh, userId);
    return invalidRequestResponse();
  }

  return evaluateBind(row, userId);
}

export async function POST(request: Request) {
  if (!isSecretConfigured) {
    return NextResponse.json(
      { error: "Desktop sign-in isn't configured for this deployment yet." },
      { status: 501 }
    );
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
  if (!token) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const admin = getServiceSupabaseClient();
  const { data: authData, error: userError } = await admin.auth.getUser(token);
  if (userError || !authData.user) {
    return NextResponse.json(
      { error: "Your session is invalid or has expired. Please sign in again." },
      { status: 401 }
    );
  }
  const userId = authData.user.id;

  const body = await parseBody(request);
  const requestIdValue =
    typeof body?.requestId === "string" ? body.requestId.trim() : "";
  const presentedCode = typeof body?.code === "string" ? body.code.trim() : "";

  // Code-based flow: the browser carries the app's code.
  if (presentedCode) {
    if (!requestIdValue || requestIdValue !== presentedCode || !isWellFormedDesktopCode(presentedCode)) {
      return invalidRequestResponse();
    }
    const codeHash = hashDesktopSecret(presentedCode);
    let row = await readRowBy(admin, "code_hash", codeHash);
    if (!row) {
      row = await ensurePendingRow(admin, presentedCode, codeHash);
      if (!row) {
        return NextResponse.json(
          { error: "We couldn't start the sign-in right now. Please try again." },
          { status: 500 }
        );
      }
    }
    return attemptBind(admin, row, userId);
  }

  // Legacy request_id flow: the row was pre-created by `/api/auth/desktop/start`.
  if (!requestIdValue) {
    return invalidRequestResponse();
  }
  const row = await readRowBy(admin, "request_id", requestIdValue);
  if (!row) {
    return invalidRequestResponse();
  }
  return attemptBind(admin, row, userId);
}