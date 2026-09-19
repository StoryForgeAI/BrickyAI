import { NextResponse } from "next/server";
import { isBrickyApiConfigured } from "@/lib/config";
import { brickyServerRequest } from "@/lib/bricky-server";
import { friendlyMessage } from "@/lib/auth-errors";
import { getSessionToken, clearSessionCookie } from "@/lib/session";

/**
 * Account deletion (BFF proxy).
 *
 * The current WordPress plugin has NO account-deletion route (verified against
 * the live registry: `GET /wp-json/bricky/v1`). This route forwards to the
 * planned `POST /wp-json/bricky/v1/account/delete`; while that endpoint is
 * missing the caller receives a clean, honest error instead of a silent no-op.
 * Required backend change: expose the delete endpoint (see final report).
 */

export async function POST() {
  if (!isBrickyApiConfigured) {
    return NextResponse.json({ ok: false, error: "Account deletion isn't available yet." }, { status: 501 });
  }

  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ ok: false, error: "Please sign in." }, { status: 401 });
  }

  const res = await brickyServerRequest("/account/delete", { method: "POST", token });

  if (res.status === 200) {
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
  }

  if (res.status === 404) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Account deletion isn't available through the Bricky AI backend yet. Please contact support if you'd like to delete your account.",
      },
      { status: 501 }
    );
  }

  return NextResponse.json(
    { ok: false, error: friendlyMessage(res.status, res.body) },
    { status: res.status === 0 ? 502 : res.status }
  );
}