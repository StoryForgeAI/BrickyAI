/**
 * Advertised plan definitions — the single source of truth for pricing-page
 * prices, billing interval, and feature lists. The actual checkout flow
 * (whenever it lands) must always render from these values so a plan is never
 * shown at one price here and a different price at checkout.
 *
 * Plans cover access to Bricky AI's software features. Third-party AI provider
 * usage (e.g. OpenAI, Anthropic) is separate from these prices.
 */

export type PlanId = "starter" | "pro" | "max";

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
    id: "starter",
    name: "Starter",
    price: 4.99,
    priceLabel: "$4.99",
    interval: "month",
    cta: "Get Starter",
    popular: false,
    tagline: "For getting started with AI-assisted Roblox development.",
    features: [
      "Use your own supported AI provider",
      "Roblox scripting with Bricky AI",
      "Roblox plugin creation",
      "Basic planning",
      "Medium planning",
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
    tagline: "For active developers who want more power.",
    features: [
      "Everything in Starter, plus:",
      "High planning",
      "Advanced AI model access through your connected provider",
      "Advanced plugin development tools",
      "Better project context",
      "Priority processing where available",
      "Priority help",
      "Early access to selected new features",
    ],
  },
  {
    id: "max",
    name: "Max",
    price: 19.99,
    priceLabel: "$19.99",
    interval: "month",
    cta: "Get Max",
    popular: false,
    tagline: "For ambitious projects and power users.",
    features: [
      "Everything in Pro, plus:",
      "Extreme planning",
      "Maximum supported Bricky AI planning capabilities",
      "Advanced plugin development",
      "Large-project support where available",
      "Experimental features where available",
      "Priority support",
      "Early access to selected features",
    ],
  },
];

export type CellValue = "yes" | "no" | string;

export interface ComparisonRow {
  label: string;
  free: CellValue;
  starter: CellValue;
  pro: CellValue;
  max: CellValue;
}

/** Header + one row per capability, in plan order (Free → Max). */
export const COMPARISON_COLUMNS: Array<{ key: PlanId | "free"; label: string; priceLabel: string }> = [
  { key: "free", label: "Free", priceLabel: FREE_TIER.priceLabel },
  ...PLANS.map((p) => ({ key: p.id, label: p.name, priceLabel: p.priceLabel })),
];

export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Monthly price", free: "$0", starter: "$4.99", pro: "$9.99", max: "$19.99" },
  { label: "Use your own supported AI provider", free: "yes", starter: "yes", pro: "yes", max: "yes" },
  { label: "Roblox scripting with Bricky AI", free: "yes", starter: "yes", pro: "yes", max: "yes" },
  { label: "Roblox plugin creation", free: "yes", starter: "yes", pro: "yes", max: "yes" },
  { label: "Roblox Studio integration", free: "no", starter: "yes", pro: "yes", max: "yes" },
  { label: "Planning tiers", free: "Basic", starter: "Basic + Medium", pro: "+ High", max: "+ Extreme" },
  { label: "Advanced model access through your connected provider", free: "no", starter: "no", pro: "yes", max: "yes" },
  { label: "Advanced plugin development tools", free: "no", starter: "no", pro: "yes", max: "yes" },
  { label: "Priority processing / help / support", free: "no", starter: "no", pro: "Processing + help", max: "Processing, help, support" },
  { label: "Early access to selected features", free: "no", starter: "no", pro: "yes", max: "yes" },
  { label: "Large-project and experimental features", free: "no", starter: "no", pro: "no", max: "Where available" },
];