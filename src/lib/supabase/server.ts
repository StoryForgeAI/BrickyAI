import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client.
 *
 * SECURITY: This module may ONLY be imported from server-side code. The
 * `server-only` package makes the Next.js bundler throw if a client component
 * ever imports it, so `SUPABASE_SECRET_KEY` can never leak into the browser.
 *
 * The secret key is read from a private, server-only environment variable
 * (`SUPABASE_SECRET_KEY`). It must never be prefixed with `NEXT_PUBLIC_`,
 * never be hardcoded, never be logged, and never be returned in an API
 * response.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const secretKey =
  process.env.SUPABASE_SECRET_KEY ??
  // Legacy alias kept so existing server environments keep working.
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "";

/** True when the server-only secret key is available in this environment. */
export const isSecretConfigured = Boolean(supabaseUrl && secretKey);

let client: SupabaseClient | null = null;

/**
 * Returns the privileged server-side Supabase client (bypasses RLS — treat it
 * as an administrative client). Throws if the secret key is not configured;
 * prefer checking `isSecretConfigured` first and handling the failure
 * gracefully at the call site.
 */
export function getServiceSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !secretKey) {
    throw new Error(
      "Supabase secret key is not configured. Set SUPABASE_SECRET_KEY in the server environment."
    );
  }
  if (!client) {
    client = createClient(supabaseUrl, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return client;
}