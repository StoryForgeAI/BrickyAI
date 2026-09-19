import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { brickyServerRequest } from "@/lib/bricky-server";

/**
 * Resend verification email (BFF).
 *
 * The backend always answers with a generic success message to avoid account
 * enumeration — the same generic response is returned here.
 */

export async function POST(request: Request) {
  if (!isBrickyApiConfigured) {
    return NextResponse.json(
      { ok: false, error: "Verification isn't configured for this deployment yet." },
      { status: 501 }
    );
  }

  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  const res = await brickyServerRequest("/auth/resend-verification", {
    method: "POST",
    body: { email },
  });

  const message =
    typeof res.body?.message === "string"
      ? res.body.message
      : "If an unverified account exists for this email, a verification email will be sent.";

  return NextResponse.json({ ok: true, message });
}