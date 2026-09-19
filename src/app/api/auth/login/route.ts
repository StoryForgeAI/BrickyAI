import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { JWT_AUTH_NAMESPACE } from "@/lib/bricky-api";
import { brickyServerRequest } from "@/lib/bricky-server";
import { friendlyMessage } from "@/lib/auth-errors";
import { setSessionCookie } from "@/lib/session";

/**
 * Email/password sign-in (BFF).
 *
 * 1. Forwards credentials to the WordPress JWT plugin
 *    (`POST /wp-json/jwt-auth/v1/token`), which returns a 7-day JWT.
 * 2. Stores the JWT in an HttpOnly `bricky_session` cookie (never exposed to
 *    browser JS / localStorage).
 * 3. Returns the account payload for immediate use.
 */

export async function POST(request: Request) {
  if (!isBrickyApiConfigured) {
    return NextResponse.json(
      { ok: false, error: "Sign-in isn't configured for this deployment yet." },
      { status: 501 }
    );
  }

  const body = (await request.json().catch(() => null)) as { email?: unknown; password?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Please enter your email and password." }, { status: 400 });
  }

  const res = await brickyServerRequest(`${JWT_AUTH_NAMESPACE}/token`, {
    method: "POST",
    body: { username: email, password },
  });

  const token = res.status === 200 && typeof res.body?.token === "string" ? res.body.token : null;
  if (!token) {
    const status = res.status === 0 ? 502 : 401;
    return NextResponse.json(
      { ok: false, error: friendlyMessage(res.status, res.body) },
      { status }
    );
  }

  await setSessionCookie(token);

  const accountRes = await brickyServerRequest("/account", { token });
  const account = accountRes.status === 200 && accountRes.body?.account ? accountRes.body.account : null;

  return NextResponse.json({ ok: true, account });
}