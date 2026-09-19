import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { brickyServerRequest } from "@/lib/bricky-server";

/**
 * Desktop sign-in start (BFF proxy).
 *
 * The desktop-app handshake data now lives in WordPress
 * (`wp_bricky_desktop_auth`). The WordPress API plugin does NOT yet expose a
 * desktop `start` endpoint (verified against the live route registry), so this
 * forwards to the expected contract and returns a clean, machine-readable
 * "not enabled" error until `POST /wp-json/bricky/v1/auth/desktop/start`
 * exists. See the final migration report for the required backend change.
 */

export const DESKTOP_NOT_ENABLED = "desktop_not_enabled";

export async function POST() {
  if (!isBrickyApiConfigured) {
    return NextResponse.json(
      {
        code: DESKTOP_NOT_ENABLED,
        error: "Desktop app sign-in isn't configured for this deployment yet.",
      },
      { status: 501 }
    );
  }

  const res = await brickyServerRequest("/auth/desktop/start", { method: "POST" });

  if (res.status === 200 && res.body) {
    return NextResponse.json(res.body, { status: 200 });
  }

  if (res.status === 404) {
    return NextResponse.json(
      {
        code: DESKTOP_NOT_ENABLED,
        error: "Desktop app sign-in isn't enabled on the Bricky AI backend yet.",
      },
      { status: 501 }
    );
  }

  return NextResponse.json(
    {
      code: DESKTOP_NOT_ENABLED,
      error: "Bricky AI couldn't start the sign-in right now. Please try again.",
    },
    { status: 500 }
  );
}