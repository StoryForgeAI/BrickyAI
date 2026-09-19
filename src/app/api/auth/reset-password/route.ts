import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { brickyServerRequest } from "@/lib/bricky-server";
import { friendlyMessage } from "@/lib/auth-errors";

/**
 * Complete a password reset (BFF).
 *
 * Forwards the one-time `{ key, login, password }` (the key and login come
 * from the reset link emailed by WordPress). The password is never stored
 * client-side.
 */

export async function POST(request: Request) {
  if (!isBrickyApiConfigured) {
    return NextResponse.json(
      { ok: false, error: "Password reset isn't configured for this deployment yet." },
      { status: 501 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    key?: unknown;
    login?: unknown;
    password?: unknown;
  } | null;
  const key = typeof body?.key === "string" ? body.key : "";
  const login = typeof body?.login === "string" ? body.login : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!key || !login || !password) {
    return NextResponse.json(
      { ok: false, error: "This password reset link is incomplete. Please check the link in your email." },
      { status: 400 }
    );
  }

  const res = await brickyServerRequest("/auth/reset-password", {
    method: "POST",
    body: { key, login, password },
  });

  if (res.status === 200 && res.body?.success) {
    return NextResponse.json({
      ok: true,
      message: typeof res.body.message === "string" ? res.body.message : "Password has been reset.",
    });
  }

  return NextResponse.json(
    { ok: false, error: friendlyMessage(res.status, res.body) },
    { status: res.status === 0 ? 502 : 400 }
  );
}