import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isSecretConfigured, getServiceSupabaseClient } from "@/lib/supabase/server";

/**
 * Server-side starter-credit claim.
 *
 * Credits are a promotional entitlement granted exactly once per account AND
 * once per browser/device environment. The decision lives on the server:
 *
 * - The caller is validated with the Bearer access token.
 * - A persistent `bricky_device_id` cookie (HttpOnly, opaque random UUID)
 *   identifies the browser/device environment. It is never readable by
 *   JavaScript, contains no personal data, and survives logout.
 * - The server-only Postgres function `claim_starter_credits(browser_id,
 *   user_id)` atomically records the claim (unique on browser and user) and
 *   grants 80 credits only when the account has never received a balance.
 *
 * The browser only ever reads `profiles.credits`; it can never set it.
 * See `docs/CREDITS_SETUP.md` for the database setup.
 */

const DEVICE_COOKIE = "bricky_device_id";
const DEVICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 400; // ~400 days
const STARTER_CREDITS = 80;

function getBrowserId(request: Request): { value: string; shouldSet: boolean } {
  const header = request.headers.get("cookie");
  if (header) {
    for (const part of header.split(";")) {
      const [rawName, ...rawValue] = part.trim().split("=");
      const name = decodeURIComponent(rawName ?? "");
      if (name === DEVICE_COOKIE) {
        const value = rawValue.join("=");
        if (value) return { value: decodeURIComponent(value), shouldSet: false };
      }
    }
  }
  return { value: randomUUID(), shouldSet: true };
}

export async function POST(request: Request) {
  if (!isSecretConfigured) {
    return NextResponse.json(
      { error: "Starter credits aren't configured for this deployment yet." },
      { status: 501 }
    );
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
  if (!token) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const admin = getServiceSupabaseClient();

  const { data: authData, error: userError } = await admin.auth.getUser(token);
  if (userError || !authData.user) {
    return NextResponse.json(
      { error: "Session is invalid or has expired. Please sign in again." },
      { status: 401 }
    );
  }

  const userId = authData.user.id;

  // Ensure a `profiles` row exists. Idempotent: only id/email/updated_at are
  // written, so an existing balance is never touched here.
  const { error: upsertError } = await admin
    .from("profiles")
    .upsert(
      { id: userId, email: authData.user.email, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );
  if (upsertError) {
    return NextResponse.json(
      { error: "We couldn't process your request right now. Please try again later." },
      { status: 500 }
    );
  }

  const { value: browserId, shouldSet } = getBrowserId(request);

  let granted = false;
  const { data, error } = await admin.rpc("claim_starter_credits", {
    p_browser_id: browserId,
    p_user_id: userId,
  });

  if (error && error.code === "23505") {
    // Unique-violation: this browser or account has already claimed. Not an
    // error — the entitlement was already consumed.
    granted = false;
  } else if (error) {
    return NextResponse.json(
      { error: "We couldn't process your request right now. Please try again later." },
      { status: 500 }
    );
  } else {
    granted = (data?.[0]?.granted ?? false) as boolean;
  }

  // Read the current balance back so the client never computes it.
  const { data: profile } = await admin
    .from("profiles")
    .select<"credits", { credits: number | null }>("credits")
    .eq("id", userId)
    .maybeSingle();

  const response = NextResponse.json({
    granted,
    credits: profile?.credits ?? null,
    starter_credits: STARTER_CREDITS,
  });

  if (shouldSet) {
    response.cookies.set({
      name: DEVICE_COOKIE,
      value: browserId,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: DEVICE_COOKIE_MAX_AGE,
    });
  }

  return response;
}