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

/**
 * Request the one-time starter credit entitlement from the server.
 *
 * The HttpOnly session cookie authenticates this request; no token is sent by
 * the client. The server decides (validated session + `bricky_device_id` cookie
 * + atomic claim in WordPress — see `docs/CREDITS_SETUP.md`). This helper never
 * computes or writes a balance; it only surfaces the server's answer.
 * Idempotent: extra calls return `granted: false` once a claim exists.
 */
export async function claimStarterCredits(): Promise<ClaimStarterResult> {
  try {
    const res = await fetch("/api/credit/claim-starter", { method: "POST" });
    if (!res.ok) {
      return { ok: false, granted: false, credits: null };
    }
    const body = (await res.json()) as { granted?: boolean; credits?: number | null };
    return { ok: true, granted: Boolean(body.granted), credits: body.credits ?? null };
  } catch {
    return { ok: false, granted: false, credits: null };
  }
}