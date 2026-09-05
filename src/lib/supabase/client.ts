import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  // Legacy alias kept so existing local .env files keep working.
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

/**
 * Whether Supabase has been configured for this deployment.
 *
 * The website must keep working (and downloads must remain reachable) even when
 * the Supabase environment variables are absent, so all auth UI reads this flag
 * and degrades gracefully.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && publishableKey);

let client: SupabaseClient | null = null;

/**
 * Shared Supabase browser client. Returns `null` when Supabase is not
 * configured so callers can degrade gracefully instead of crashing.
 *
 * Only the publishable/anon (public, safe to ship) key is ever exposed to the
 * browser. The server-only secret key (`SUPABASE_SECRET_KEY`) must NEVER appear
 * in NEXT_PUBLIC_* or in client bundles — server-side code reads it directly
 * from a private environment variable (see `src/lib/supabase/server.ts`).
 */
export function getBrowserSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(supabaseUrl, publishableKey, {
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