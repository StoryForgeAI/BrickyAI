import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Whether Supabase has been configured for this deployment.
 *
 * The website must keep working (and downloads must remain reachable) even when
 * the Supabase environment variables are absent, so all auth UI reads this flag
 * and degrades gracefully.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let client: SupabaseClient | null = null;

/**
 * Shared Supabase browser client. Returns `null` when Supabase is not
 * configured so callers can degrade gracefully instead of crashing.
 *
 * Only the anon (public, safe to ship) key is ever exposed to the browser.
 * Never place a service_role key in NEXT_PUBLIC_* — server-side code reads it
 * directly from a private environment variable instead (see the account
 * deletion route).
 */
export function getBrowserSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });
  }
  return client;
}