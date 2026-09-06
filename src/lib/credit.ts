import { getBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Result of a starter-credit claim request.
 *
 * `ok` is `false` only for transport/server failures (network, 5xx). When the
 * claim itself is rejected — already claimed on this browser or account, or not
 * signed in — the call still resolves so callers can ignore it gracefully.
 */
export interface ClaimStarterResult {
  ok: boolean;
  /** Whether 80 credits were actually granted by this call. */
  granted: boolean;
  /** The server-computed credit balance (may be null when unconfigured). */
  credits: number | null;
}

async function getAccessToken(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await getBrowserSupabaseClient()!.auth.getSession();
  return data.session?.access_token ?? null;
}

/**
 * Request the one-time starter credit entitlement from the server.
 *
 * The server decides (validated session + `bricky_device_id` cookie + atomic
 * claim in Postgres — see `docs/CREDITS_SETUP.md`). This helper never computes
 * or writes a balance; it only surfaces the server's answer. Idempotent: extra
 * calls return `granted: false` once a claim exists.
 */
export async function claimStarterCredits(): Promise<ClaimStarterResult> {
  const token = await getAccessToken();
  if (!token) {
    return { ok: true, granted: false, credits: null };
  }
  try {
    const res = await fetch("/api/credit/claim-starter", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return { ok: false, granted: false, credits: null };
    }
    const body = (await res.json()) as { granted?: boolean; credits?: number | null };
    return { ok: true, granted: Boolean(body.granted), credits: body.credits ?? null };
  } catch {
    return { ok: false, granted: false, credits: null };
  }
}