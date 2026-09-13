import { NextResponse } from "next/server";
import { isSecretConfigured, getServiceSupabaseClient } from "@/lib/supabase/server";
import { DESKTOP_AUTH_ERRORS, type DesktopAuthExchangeUser } from "@/lib/desktopAuth";
import { hashDesktopSecret, secretDigestsEqual } from "@/lib/desktopAuthServer";

/**
 * Redeems the one-time desktop authorization code.
 *
 * Called by the desktop app with `{ request_id, device_secret }` — the secret
 * it received from `/api/auth/desktop/start`. The request must have been bound
 * to a user by `/api/auth/desktop/complete`.
 *
 * Redemption is ATOMIC: a single guarded UPDATE flips `bound → redeemed`. Only
 * one caller can win that UPDATE, so the same code can never be used twice.
 *
 * Responses:
 *   - 202 `{ status: "pending" }`           → the browser hasn't finished yet; poll again.
 *   - 200 `{ status: "authenticated", user }` → succeeded; `user` is a verified,
 *                                                server-computed account snapshot.
 *   - 400 invalid / 410 expired|already_used → terminal; stop polling.
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

function parseBody(request: Request): Promise<{ requestId?: string; deviceSecret?: string } | null> {
  return request.json().catch(() => null);
}

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

export async function POST(request: Request) {
  if (!isSecretConfigured) {
    return NextResponse.json(
      { error: "Desktop sign-in isn't configured for this deployment yet." },
      { status: 501 }
    );
  }

  const body = await parseBody(request);
  const requestId = body?.requestId?.trim();
  const deviceSecret = body?.deviceSecret?.trim();
  if (!requestId || !deviceSecret) {
    return NextResponse.json(
      { error: "This sign-in request is invalid.", code: DESKTOP_AUTH_ERRORS.INVALID },
      { status: 400 }
    );
  }

  const admin = getServiceSupabaseClient();

  const { data: rowData } = await admin
    .from("desktop_auth_sessions")
    .select("*")
    .eq("request_id", requestId)
    .maybeSingle();
  const row = (rowData ?? null) as DesktopAuthRow | null;
  if (!row) {
    return NextResponse.json(
      { error: "This sign-in request is invalid.", code: DESKTOP_AUTH_ERRORS.INVALID },
      { status: 400 }
    );
  }

  const expired = new Date(row.expires_at).getTime() <= Date.now();
  if (expired) {
    await admin.from("desktop_auth_sessions").update({ status: "expired" }).eq("id", row.id).eq("status", "pending");
    return NextResponse.json(
      { error: "This sign-in request has expired. Please start again from the Bricky AI desktop app.", code: DESKTOP_AUTH_ERRORS.EXPIRED },
      { status: 410 }
    );
  }

  if (row.status === "pending") {
    // Not bound to a user yet — the browser hasn't completed sign-in.
    return NextResponse.json({ status: DESKTOP_AUTH_ERRORS.PENDING }, { status: 202 });
  }

  if (row.status === "bound") {
    const secretHash = hashDesktopSecret(deviceSecret);
    if (!secretDigestsEqual(secretHash, row.code_hash)) {
      return NextResponse.json(
        { error: "This sign-in request is invalid.", code: DESKTOP_AUTH_ERRORS.INVALID },
        { status: 400 }
      );
    }

    // The single atomic gate: exactly one caller can win this guarded UPDATE.
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

    // Race lost: another call redeemed it, or it expired mid-flight.
    const { data: freshData } = await admin
      .from("desktop_auth_sessions")
      .select("*")
      .eq("id", row.id)
      .maybeSingle();
    const fresh = (freshData ?? null) as DesktopAuthRow | null;
    if (!fresh) {
      return NextResponse.json(
        { error: "This sign-in request is invalid.", code: DESKTOP_AUTH_ERRORS.INVALID },
        { status: 400 }
      );
    }
    if (new Date(fresh.expires_at).getTime() <= Date.now() || fresh.status === "expired") {
      return NextResponse.json(
        { error: "This sign-in request has expired.", code: DESKTOP_AUTH_ERRORS.EXPIRED },
        { status: 410 }
      );
    }
    if (fresh.status === "redeemed") {
      return NextResponse.json(
        { error: "This sign-in request has already been used once.", code: DESKTOP_AUTH_ERRORS.ALREADY_USED },
        { status: 410 }
      );
    }
    return NextResponse.json(
      { error: "This sign-in request is invalid.", code: DESKTOP_AUTH_ERRORS.INVALID },
      { status: 400 }
    );
  }

  if (row.status === "redeemed") {
    return NextResponse.json(
      { error: "This sign-in request has already been used once.", code: DESKTOP_AUTH_ERRORS.ALREADY_USED },
      { status: 410 }
    );
  }

  if (row.status === "expired") {
    return NextResponse.json(
      { error: "This sign-in request has expired.", code: DESKTOP_AUTH_ERRORS.EXPIRED },
      { status: 410 }
    );
  }

  return NextResponse.json(
    { error: "This sign-in request is invalid.", code: DESKTOP_AUTH_ERRORS.INVALID },
    { status: 400 }
  );
}