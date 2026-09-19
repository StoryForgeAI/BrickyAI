import type { BrickyAccount } from "@/lib/bricky-api";

/** Capitalize the first letter of a plan name for display. */
function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Human-readable subscription label for the account UI:
 * the free tier, the active plan (with status), or a lapsed plan.
 * Returns "—" when no account has been loaded yet.
 */
export function subscriptionLabel(account: BrickyAccount | null): string {
  if (!account) return "—";
  const subscription = account.subscription;
  if (!subscription) return "Free";
  const plan = subscription.plan?.trim();
  if (!plan || plan.toLowerCase() === "free") return "Free";
  const status = subscription.status?.toLowerCase();
  if (status === "canceled" || status === "cancelled") return `${titleCase(plan)} (cancelled)`;
  if (status === "expired") return `${titleCase(plan)} (expired)`;
  return titleCase(plan);
}

/** Human-readable credit balance for the account UI. */
export function creditsLabel(account: BrickyAccount | null): string {
  if (!account) return "—";
  if (account.credits === null || account.credits === undefined) return "—";
  return Intl.NumberFormat().format(Math.floor(account.credits));
}