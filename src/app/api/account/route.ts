import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { brickyServerRequest } from "@/lib/bricky-server";
import { friendlyMessage } from "@/lib/auth-errors";
import { getSessionToken, clearSessionCookie } from "@/lib/session";

/** Authenticated account (BFF proxy for `GET /wp-json/bricky/v1/account`). */
export async function GET() {
  if (!isBrickyApiConfigured) {
    return NextResponse.json({ ok: false, error: "Account data isn't configured yet." }, { status: 501 });
  }

  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ ok: false, error: "Please sign in." }, { status: 401 });
  }

  const res = await brickyServerRequest("/account", { token });

  if (res.status === 200 && res.body?.account) {
    return NextResponse.json({ ok: true, account: res.body.account });
  }

  if (res.status === 401 || res.status === 403 || res.status === 0) {
    await clearSessionCookie();
  }

  return NextResponse.json(
    { ok: false, error: friendlyMessage(res.status, res.body) },
    { status: res.status === 0 ? 502 : res.status }
  );
}