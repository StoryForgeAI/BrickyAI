import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { brickyServerRequest } from "@/lib/bricky-server";

/**
 * Desktop sign-in exchange (BFF proxy).
 *
 * Called by the desktop app with the one-time code. Redemption must happen on
 * the backend (`wp_bricky_desktop_auth`); the WordPress plugin does not expose
 * `POST /wp-json/bricky/v1/auth/desktop/exchange` yet (verified against the
 * live route registry), so this returns the same pollable contract the app
 * expects when it IS enabled:
 *
 *   - 501 `{ code: "desktop_not_enabled" }` → the app's polling loop sees a
 *     terminal backend-contract state and stops with a clean error.
 */

export async function POST(request: Request) {
  if (!isBrickyApiConfigured) {
    return NextResponse.json(
      { code: "desktop_not_enabled", error: "Desktop app sign-in isn't configured for this deployment yet." },
      { status: 501 }
    );
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  const res = await brickyServerRequest("/auth/desktop/exchange", {
    method: "POST",
    body: body ?? {},
  });

  if (res.status === 200 || res.status === 202) {
    return NextResponse.json(res.body ?? {}, { status: res.status });
  }

  if (res.status === 404) {
    return NextResponse.json(
      { code: "desktop_not_enabled", error: "Desktop app sign-in isn't enabled on the Bricky AI backend yet." },
      { status: 501 }
    );
  }

  return NextResponse.json(
    { code: "desktop_not_enabled", error: "Bricky AI couldn't complete the sign-in right now. Please try again." },
    { status: 500 }
  );
}