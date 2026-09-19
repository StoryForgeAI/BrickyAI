import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { brickyServerRequest } from "@/lib/bricky-server";
import { getSessionToken } from "@/lib/session";

/**
 * Desktop sign-in completion (BFF proxy).
 *
 * Called from `/auth/desktop` after the browser completes the WordPress
 * sign-in. The binding decision lives on the backend
 * (`wp_bricky_desktop_auth`); the WordPress plugin does not expose a
 * `complete` endpoint yet (verified against the live route registry), so this
 * forwards to the expected contract and returns a clean, machine-readable
 * "not enabled" error. The browser's flow is safe to REPEAT: it does not
 * consume anything.
 */

const DESKTOP_NOT_ENABLED = "desktop_not_enabled";

export async function POST(request: Request) {
  if (!isBrickyApiConfigured) {
    return NextResponse.json(
      { code: DESKTOP_NOT_ENABLED, error: "Desktop app sign-in isn't configured for this deployment yet." },
      { status: 501 }
    );
  }

  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  const res = await brickyServerRequest("/auth/desktop/complete", {
    method: "POST",
    token,
    body: body ?? {},
  });

  if (res.status === 200 && res.body) {
    return NextResponse.json(res.body, { status: 200 });
  }

  if (res.status === 404) {
    return NextResponse.json(
      {
        code: DESKTOP_NOT_ENABLED,
        error:
          "The desktop app connection isn't enabled on the Bricky AI backend yet. Your sign-in worked — the desktop app link will be available soon.",
      },
      { status: 501 }
    );
  }

  return NextResponse.json(
    { code: DESKTOP_NOT_ENABLED, error: "Bricky AI couldn't complete the sign-in right now. Please try again." },
    { status: 500 }
  );
}