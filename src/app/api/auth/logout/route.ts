import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { brickyServerRequest } from "@/lib/bricky-server";
import { clearSessionCookie } from "@/lib/session";

/**
 * Sign-out (BFF).
 *
 * Expires the HttpOnly session cookie and notifies WordPress (which expires
 * its own `bricky_access_token` cookie). WordPress failures are ignored —
 * clearing the local session is what matters.
 */

export async function POST() {
  if (isBrickyApiConfigured) {
    await brickyServerRequest("/auth/logout", { method: "POST" });
  }
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}