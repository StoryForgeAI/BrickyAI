/**
 * Reflection of the `profiles` table linked to `auth.users`.
 *
 * Profile rows are created/maintained on the server (e.g. by a database
 * trigger on `auth.users`). The browser never writes to `credits`,
 * `subscription`, or `subscription_expires_at` — those values are managed only
 * by trusted server-side code.
 */
export interface Profile {
  id: string;
  email: string | null;
  email_verified: boolean | null;
  credits: number | null;
  subscription: string | null;
  subscription_expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Capitalize the first letter of a plan name for display. */
function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Human-readable subscription label for the account UI:
 * the free tier, the active plan (with expiry), or an expired plan.
 * Returns "—" when no profile has been loaded yet.
 */
export function subscriptionLabel(profile: Profile | null): string {
  if (!profile) return "—";
  const plan = profile.subscription?.trim();
  if (!plan || plan.toLowerCase() === "free") return "Free";
  if (profile.subscription_expires_at) {
    const expires = new Date(profile.subscription_expires_at);
    if (Number.isNaN(expires.getTime())) return titleCase(plan);
    if (expires.getTime() <= Date.now()) return `${titleCase(plan)} (expired)`;
  }
  return titleCase(plan);
}

/** Human-readable credit balance for the account UI. */
export function creditsLabel(profile: Profile | null): string {
  if (!profile) return "—";
  if (profile.credits === null || profile.credits === undefined)
    return "—";
  return Intl.NumberFormat().format(Math.floor(profile.credits));
}