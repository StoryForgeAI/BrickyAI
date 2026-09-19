import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { brickyServerRequest } from "@/lib/bricky-server";
import { getSessionToken, clearSessionCookie } from "@/lib/session";

/**
 * Session restore (BFF).
 *
 * The client calls this on boot. If a `bricky_session` cookie exists, the JWT
 * is exchanged against WordPress `/account`; a valid response means the user
 * stays signed in, an expired/invalid token clears the cookie.
 */

export async function GET() {
  if (!isBrickyApiConfigured) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const res = await brickyServerRequest("/account", { token });

  if (res.status === 200 && res.body?.account) {
    return NextResponse.json({ authenticated: true, account: res.body.account });
  }

  if (res.status === 401 || res.status === 403 || res.status === 0) {
    await clearSessionCookie();
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  return NextResponse.json({ authenticated: false, error: res.body?.message ?? null }, { status: 200 });
}