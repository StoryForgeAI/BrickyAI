/**
 * Advertised plan definitions — the single source of truth for pricing-page
 * prices, billing interval, feature lists, and the weekly credit schedule.
 *
 * Plans cover access to Bricky AI's software features. Third-party AI provider
 * usage (e.g. OpenAI, Anthropic) is separate from these prices.
 *
 * NOTE: This is a temporary INTERNAL TEST system for evaluating the
 * subscription + weekly-credits flow. Nothing is charged and no payment
 * processor is integrated. The checkout flow (whenever it lands) must always
 * render from these values so a plan is never shown at one price here and a
 * different price at checkout.
 */

export type PlanId = "basic" | "pro";

export interface Plan {
  id: PlanId;
  name: string;
  /** USD price per month for the price shown. 0 is not used here (see FREE_TIER). */
  price: number;
  priceLabel: string;
  interval: "month";
  cta: string;
  popular: boolean;
  tagline: string;
  features: string[];
}

export interface FreeTier {
  name: "Free";
  price: 0;
  priceLabel: string;
  interval: null;
  cta: string;
  tagline: string;
  features: string[];
}

export const GRANTS_PER_PERIOD = 4;

/**
 * Weekly credit schedule per plan, indexed by grant number within a billing
 * period (1-based). Basic receives a flat 250/week; Pro receives 500 for the
 * first three weeks of each month and 750 on the final week.
 */
export const WEEKLY_CREDITS: Record<PlanId, number[]> = {
  basic: [250, 250, 250, 250],
  pro: [500, 500, 500, 750],
};

/** Credits granted for `grantNumber` (1-based) within a billing period. */
export function weeklyCreditsFor(planId: PlanId, grantNumber: number): number {
  return WEEKLY_CREDITS[planId]?.[Math.max(0, grantNumber - 1)] ?? 0;
}

/** Human-friendly weekly schedule for the pricing UI. */
export const WEEKLY_SCHEDULE_LABEL: Record<PlanId, string> = {
  basic: "250 credits added every week",
  pro: "500 credits per week (final week each month: 750)",
};

export const TEST_MODE_NOTICE =
  "Temporary test system — subscriptions do not charge real money.";

export const BILLING_INTERVAL_LABEL = "Monthly subscription";

export const FREE_TIER: FreeTier = {
  name: "Free",
  price: 0,
  priceLabel: "$0",
  interval: null,
  cta: "Start Free",
  tagline: "Try Bricky AI before you commit — no payment details required.",
  features: [
    "New accounts start with 80 credits",
    "Use your own supported AI provider",
    "Roblox scripting with Bricky AI",
    "Basic planning",
    "Local plugin export",
  ],
};

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 4.99,
    priceLabel: "$4.99",
    interval: "month",
    cta: "Get Basic",
    popular: false,
    tagline: "A steady weekly allowance for AI-assisted Roblox development.",
    features: [
      "250 credits added every week",
      "Use your own supported AI provider",
      "Roblox scripting with Bricky AI",
      "Roblox plugin creation",
      "Basic + Medium planning",
      "Bricky AI development tools",
      "Roblox Studio integration",
      "Local plugin export",
      "Project management",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    priceLabel: "$9.99",
    interval: "month",
    cta: "Get Pro",
    popular: true,
    tagline: "More credits every week and priority help for active developers.",
    features: [
      "500 credits per week (final week each month: 750)",
      "Everything in Basic, plus:",
      "Advanced AI model access through your connected provider",
      "Advanced plugin development tools",
      "Better project context",
      "Priority processing where available",
      "Priority help",
      "Early access to selected new features",
    ],
  },
];

export type CellValue = "yes" | "no" | string;

export interface ComparisonRow {
  label: string;
  free: CellValue;
  basic: CellValue;
  pro: CellValue;
}

/** Header + one row per capability, in plan order (Free → Pro). */
export const COMPARISON_COLUMNS: Array<{ key: PlanId | "free"; label: string; priceLabel: string }> = [
  { key: "free", label: "Free", priceLabel: FREE_TIER.priceLabel },
  ...PLANS.map((p) => ({ key: p.id, label: p.name, priceLabel: p.priceLabel })),
];

export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Monthly price", free: "$0", basic: "$4.99", pro: "$9.99" },
  { label: "Requires a supported AI provider", free: "yes", basic: "yes", pro: "yes" },
  { label: "Weekly credits", free: "—", basic: "250/week", pro: "500/week (final 750)" },
  { label: "Roblox scripting with Bricky AI", free: "yes", basic: "yes", pro: "yes" },
  { label: "Roblox plugin creation", free: "yes", basic: "yes", pro: "yes" },
  { label: "Roblox Studio integration", free: "no", basic: "yes", pro: "yes" },
  { label: "Planning tiers", free: "Basic", basic: "Basic + Medium", pro: "+ High" },
  { label: "Advanced model access through your connected provider", free: "no", basic: "no", pro: "yes" },
  { label: "Advanced plugin development tools", free: "no", basic: "no", pro: "yes" },
  { label: "Priority processing / help / support", free: "no", basic: "no", pro: "Processing + help" },
  { label: "Early access to selected features", free: "no", basic: "no", pro: "yes" },
];