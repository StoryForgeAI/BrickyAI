import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * Server-side account deletion.
 *
 * Client code holds only the anon key, which can never delete accounts. This
 * route validates the caller's access token and then deletes the account using
 * the server-only service role key (read from a private env variable, never
 * exposed to the browser).
 *
 * Related personal data stored in application tables is covered by the same
 * deletion where the schema uses foreign keys with cascade deletes, or by
 * application-level cleanup hooks where those exist. Certain records (for
 * example, transactional or accounting records) may need to be retained where
 * legally required.
 */

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Account deletion isn't configured for this deployment yet." },
      { status: 501 }
    );
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
  if (!token) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error: userError } = await admin.auth.getUser(token);
  if (userError || !data.user) {
    return NextResponse.json(
      { error: "Session is invalid or has expired. Please sign in again." },
      { status: 401 }
    );
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(data.user.id);
  if (deleteError) {
    return NextResponse.json(
      { error: "We couldn't delete your account right now. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}