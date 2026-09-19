import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { brickyServerRequest } from "@/lib/bricky-server";

/**
 * Request a password reset (BFF).
 *
 * The backend always answers with a generic success message to avoid account
 * enumeration; if the account exists it emails a one-time reset link.
 */

export async function POST(request: Request) {
  if (!isBrickyApiConfigured) {
    return NextResponse.json(
      { ok: false, error: "Password reset isn't configured for this deployment yet." },
      { status: 501 }
    );
  }

  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  const res = await brickyServerRequest("/auth/request-password-reset", {
    method: "POST",
    body: { email },
  });

  const message =
    typeof res.body?.message === "string"
      ? res.body.message
      : "If an account exists for this email address, a password reset email has been sent.";

  return NextResponse.json({ ok: true, message });
}