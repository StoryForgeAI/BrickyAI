import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { brickyServerRequest } from "@/lib/bricky-server";
import { friendlyMessage } from "@/lib/auth-errors";
import { getSessionToken, clearSessionCookie } from "@/lib/session";

/** Credit balance (BFF proxy for `GET /wp-json/bricky/v1/credits`). */
export async function GET() {
  if (!isBrickyApiConfigured) {
    return NextResponse.json({ ok: false, error: "Credits aren't configured yet." }, { status: 501 });
  }

  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ ok: false, error: "Please sign in." }, { status: 401 });
  }

  const res = await brickyServerRequest("/credits", { token });

  if (res.status === 200 && res.body?.success) {
    const credits = typeof res.body.credits === "number" ? res.body.credits : 0;
    return NextResponse.json({ ok: true, credits });
  }

  if (res.status === 401 || res.status === 403 || res.status === 0) {
    await clearSessionCookie();
  }

  return NextResponse.json(
    { ok: false, error: friendlyMessage(res.status, res.body) },
    { status: res.status === 0 ? 502 : res.status }
  );
}