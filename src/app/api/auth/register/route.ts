import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { brickyServerRequest } from "@/lib/bricky-server";
import { friendlyMessage } from "@/lib/auth-errors";

/**
 * Email registration (BFF).
 *
 * Forwards `{ email, password, name }` to WordPress. The backend never signs
 * the user in automatically — it creates the account, marks it unverified,
 * and emails a one-time verification link (see /verify-email). Starter credits
 * are claimed by the backend, never from the client.
 */

export async function POST(request: Request) {
  if (!isBrickyApiConfigured) {
    return NextResponse.json(
      { ok: false, error: "Registration isn't configured for this deployment yet." },
      { status: 501 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    email?: unknown;
    password?: unknown;
    name?: unknown;
  } | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your email and password." },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, error: "Password must be at least 8 characters long." },
      { status: 400 }
    );
  }

  const res = await brickyServerRequest("/auth/register", {
    method: "POST",
    body: { email, password, name },
  });

  if (res.status === 201 && res.body) {
    return NextResponse.json({
      ok: true,
      message: typeof res.body.message === "string" ? res.body.message : "Check your email to verify your account.",
      user: res.body.user ?? null,
    });
  }

  return NextResponse.json(
    { ok: false, error: friendlyMessage(res.status, res.body) },
    { status: res.status === 0 ? 502 : 400 }
  );
}