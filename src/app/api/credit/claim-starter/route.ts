import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { brickyServerRequest, cookieFromSetCookies } from "@/lib/bricky-server";
import { friendlyMessage } from "@/lib/auth-errors";
import { getSessionToken, clearSessionCookie } from "@/lib/session";

/**
 * Starter credit claim (BFF proxy for `POST /wp-json/bricky/v1/credit/claim-starter`).
 *
 * The decision stays on the WordPress backend (one claim per account AND per
 * browser, via its own `bricky_device_id` cookie). This route:
 *
 * - authenticates with the HttpOnly session token,
 * - forwards the browser's cookies so WordPress sees the device cookie,
 * - passes WordPress's `bricky_device_id` `Set-Cookie` back to the browser so
 *   the per-browser entitlement keeps working in local development.
 *
 * The browser never decides or writes a balance.
 */

const DEVICE_COOKIE = "bricky_device_id";

export async function POST(request: Request) {
  if (!isBrickyApiConfigured) {
    return NextResponse.json({
      ok: true,
      granted: false,
      credits: null,
    });
  }

  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ ok: true, granted: false, credits: null });
  }

  const browserCookie = request.headers.get("cookie") ?? undefined;

  const res = await brickyServerRequest("/credit/claim-starter", {
    method: "POST",
    token,
    cookiesToForward: browserCookie,
  });

  const response = NextResponse.json({
    ok: true,
    granted: res.status === 200 && Boolean(res.body?.success),
    credits: typeof res.body?.credits === "number" ? res.body.credits : null,
  });

  // Persist the backend's device cookie so future claims on this browser are
  // recognized without a duplicate entitlement.
  if (res.status === 200) {
    const deviceId = cookieFromSetCookies(res.setCookies, DEVICE_COOKIE);
    if (deviceId) {
      response.cookies.set({
        name: DEVICE_COOKIE,
        value: deviceId,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 400,
      });
    }
  }

  if (res.status === 401 || res.status === 403) {
    await clearSessionCookie();
  }

  if (res.status !== 200 && res.status !== 409) {
    // Transport/server failure only — allow a retry, but never surface a hard
    // error for an entitlement that the browser can simply re-request later.
    return NextResponse.json({
      ok: false,
      granted: false,
      credits: null,
      error: friendlyMessage(res.status, res.body),
    });
  }

  return response;
}