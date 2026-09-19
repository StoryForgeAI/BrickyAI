import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { brickyServerRequest } from "@/lib/bricky-server";
import { friendlyMessage } from "@/lib/auth-errors";

/**
 * Email verification (BFF).
 *
 * Proxies `GET /wp-json/bricky/v1/auth/verify-email?token=…`. The token is a
 * one-time, SHA-256-hashed, 24h-expiring code sent by the backend in the
 * verification email — never stored client-side.
 */

export async function GET(request: Request) {
  if (!isBrickyApiConfigured) {
    return NextResponse.json(
      { ok: false, error: "Verification isn't configured for this deployment yet." },
      { status: 501 }
    );
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  if (!token) {
    return NextResponse.json(
      { ok: false, code: "missing_token", error: "This verification link is incomplete." },
      { status: 400 }
    );
  }

  const res = await brickyServerRequest(`/auth/verify-email?token=${encodeURIComponent(token)}`);

  if (res.status === 200 && res.body?.success) {
    return NextResponse.json({
      ok: true,
      email_verified: Boolean(res.body.email_verified),
      message: typeof res.body.message === "string" ? res.body.message : "Email verified.",
    });
  }

  return NextResponse.json(
    {
      ok: false,
      code: typeof res.body?.code === "string" ? res.body.code : undefined,
      error: friendlyMessage(res.status, res.body),
    },
    { status: 400 }
  );
}