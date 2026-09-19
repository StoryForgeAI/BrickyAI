import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { brickyServerRequest, cookieFromSetCookies } from "@/lib/bricky-server";
import { friendlyMessage } from "@/lib/auth-errors";
import { setSessionCookie } from "@/lib/session";

/**
 * Google OAuth callback exchange (BFF).
 *
 * The browser is redirected back from WordPress to `/auth/google/callback?code=…`
 * with a short-lived one-time code. This route:
 *
 * 1. Exchanges the code with `POST /wp-json/bricky/v1/auth/google/exchange`.
 * 2. WordPress answers with the account and sets its OWN
 *    `bricky_access_token` HttpOnly cookie.
 * 3. The token is captured from that upstream `Set-Cookie` (the browser can't
 *    reach WordPress directly in production) and re-issued here as the
 *    `bricky_session` cookie.
 *
 * If WordPress adds a JWT field to the JSON response instead, that is honored
 * too — nothing is invented or hardcoded.
 */

export async function POST(request: Request) {
  if (!isBrickyApiConfigured) {
    return NextResponse.json(
      { ok: false, error: "Google sign-in isn't configured for this deployment yet." },
      { status: 501 }
    );
  }

  const body = (await request.json().catch(() => null)) as { code?: unknown } | null;
  const code = typeof body?.code === "string" && body.code !== "" ? body.code : "";

  if (!code) {
    return NextResponse.json(
      { ok: false, error: "This sign-in link is incomplete. Please try again." },
      { status: 400 }
    );
  }

  const res = await brickyServerRequest("/auth/google/exchange", {
    method: "POST",
    body: { code },
  });

  if (res.status === 200 && res.body?.success && res.body.account) {
    const account = res.body.account;
    const tokenFromCookie = cookieFromSetCookies(res.setCookies, "bricky_access_token");
    const tokenFromBody = typeof res.body.token === "string" ? res.body.token : null;

    const token = tokenFromCookie ?? tokenFromBody;
    if (!token) {
      // Isolated backend-contract gap: the exchange must hand back a JWT one way
      // or another. Nothing is faked — surface a clean error instead.
      return NextResponse.json(
        {
          ok: false,
          error:
            "Sign-in completed on the backend, but your session token wasn't returned. Please try again in a moment.",
        },
        { status: 503 }
      );
    }

    await setSessionCookie(token);
    return NextResponse.json({ ok: true, account });
  }

  return NextResponse.json(
    { ok: false, error: friendlyMessage(res.status, res.body) },
    { status: res.status === 0 ? 502 : 400 }
  );
}