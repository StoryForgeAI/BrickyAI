import { NextResponse } from "next/server";
import { isSecretConfigured, getServiceSupabaseClient } from "@/lib/supabase/server";
import { authRedirectTo } from "@/lib/oauth";
import { DESKTOP_AUTH_TTL_SECONDS } from "@/lib/desktopAuth";
import {
  generateDesktopRequestId,
  generateDesktopSecret,
  hashDesktopSecret,
} from "@/lib/desktopAuthServer";

/**
 * Starts an authentication handshake between the Bricky AI desktop
 * application and the website.
 *
 * Called by the desktop app (Tauri) BEFORE the user has signed in. The
 * response contains:
 *   - `request_id`   — a public identifier passed to the browser.
 *   - `device_secret`— a high-entropy, single-use secret that the app holds.
 *                      It is returned here exactly once and is never sent to
 *                      the browser or placed in a URL.
 *   - `redirect_url` — the browser URL the app should open.
 *
 * The secret is stored only as a SHA-256 hash (`desktop_auth_sessions`), it
 * expires after a short window, and it can only be redeemed after the browser
 * binds the request to an authenticated user (`/api/auth/desktop/complete`),
 * then atomically at `/api/auth/desktop/exchange`.
 *
 * No bearer token is required here: the app is not yet authenticated. The
 * short expiry, random 256-bit secret and server-side binding limit abuse.
 */

export async function POST() {
  if (!isSecretConfigured) {
    return NextResponse.json(
      { error: "Desktop sign-in isn't configured for this deployment yet." },
      { status: 501 }
    );
  }

  const admin = getServiceSupabaseClient();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + DESKTOP_AUTH_TTL_SECONDS * 1000);

  // Opportunistic cleanup of recycled requests so the table stays small.
  await admin
    .from("desktop_auth_sessions")
    .delete()
    .lt("expires_at", now.toISOString());

  for (let attempt = 0; attempt < 2; attempt++) {
    const requestId = generateDesktopRequestId();
    const deviceSecret = generateDesktopSecret();

    const { error: insertError } = await admin.from("desktop_auth_sessions").insert({
      request_id: requestId,
      code_hash: hashDesktopSecret(deviceSecret),
      status: "pending",
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    });

    if (!insertError) {
      return NextResponse.json({
        request_id: requestId,
        device_secret: deviceSecret,
        expires_in: DESKTOP_AUTH_TTL_SECONDS,
        redirect_url: authRedirectTo(`/auth/desktop?request_id=${requestId}`),
      });
    }

    // Astronomically unlikely request_id collision — retry once.
    if (insertError.code === "23505") continue;

    return NextResponse.json(
      { error: "We couldn't start the sign-in right now. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "We couldn't start the sign-in right now. Please try again." },
    { status: 500 }
  );
}