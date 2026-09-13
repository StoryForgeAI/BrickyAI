import { NextResponse } from "next/server";
import { isSecretConfigured, getServiceSupabaseClient } from "@/lib/supabase/server";
import { DESKTOP_AUTH_ERRORS } from "@/lib/desktopAuth";

/**
 * Binds an in-flight desktop sign-in request to the browser-authenticated
 * user.
 *
 * Called from `/auth/desktop` with a validated Supabase access token. The
 * request row was created as `pending` by `/api/auth/desktop/start`; this
 * route marks it `bound` to the user's id. Only after this can the desktop
 * app redeem the one-time code at `/api/auth/desktop/exchange`.
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

function parseBody(request: Request): Promise<{ requestId?: string } | null> {
  return request.json().catch(() => null);
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
  const requestId = body?.requestId?.trim();
  if (!requestId) {
    return NextResponse.json(
      { error: "This sign-in request is missing or invalid.", code: DESKTOP_AUTH_ERRORS.INVALID_REQUEST },
      { status: 400 }
    );
  }

  const { data: rowData } = await admin
    .from("desktop_auth_sessions")
    .select("*")
    .eq("request_id", requestId)
    .maybeSingle();
  const row = (rowData ?? null) as DesktopAuthRow | null;
  if (!row) {
    return NextResponse.json(
      { error: "This sign-in request is invalid or no longer available.", code: DESKTOP_AUTH_ERRORS.INVALID_REQUEST },
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
    const { data: freshData } = await admin
      .from("desktop_auth_sessions")
      .select("*")
      .eq("id", row.id)
      .maybeSingle();
    const fresh = (freshData ?? null) as DesktopAuthRow | null;
    if (fresh) return evaluateBind(fresh, userId);
    return NextResponse.json(
      { error: "This sign-in request is invalid or no longer available.", code: DESKTOP_AUTH_ERRORS.INVALID_REQUEST },
      { status: 400 }
    );
  }

  return evaluateBind(row, userId);
}

function evaluateBind(row: DesktopAuthRow, userId: string): NextResponse {
  if (new Date(row.expires_at).getTime() <= Date.now() || row.status === "expired") {
    return NextResponse.json(
      { error: "This sign-in request has expired. Please start again from the Bricky AI desktop app.", code: DESKTOP_AUTH_ERRORS.EXPIRED },
      { status: 410 }
    );
  }
  if (row.status === "bound" || row.status === "redeemed") {
    if (row.user_id === userId) {
      // Same user reloading the page after the handshake — treat as success so
      // the browser never gets stuck on the sign-in page.
      return NextResponse.json({ ok: true });
    }
    if (row.status === "bound") {
      return NextResponse.json(
        { error: "This sign-in request is already connected to another Google account.", code: DESKTOP_AUTH_ERRORS.ALREADY_BOUND },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "This sign-in request has already been used.", code: DESKTOP_AUTH_ERRORS.ALREADY_USED },
      { status: 410 }
    );
  }
  return NextResponse.json(
    { error: "This sign-in request is invalid or no longer available.", code: DESKTOP_AUTH_ERRORS.INVALID_REQUEST },
    { status: 400 }
  );
}