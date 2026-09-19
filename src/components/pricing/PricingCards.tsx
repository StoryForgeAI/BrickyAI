"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight, Check } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import {
  BILLING_INTERVAL_LABEL,
  FREE_TIER,
  PLANS,
  WEEKLY_SCHEDULE_LABEL,
} from "@/lib/plans";

function Price({ plan }: { plan: { priceLabel: string; price: number } }) {
  if (plan.price === 0) {
    return (
      <>
        <span className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">Free</span>
      </>
    );
  }
  const [whole, cents] = plan.priceLabel.replace("$", "").split(".");
  return (
    <>
      <span className="align-top text-xl font-bold text-[var(--text-primary)]">$</span>
      <span className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">{whole}</span>
      {cents && <span className="align-top text-xl font-bold text-[var(--text-primary)]">.{cents}</span>}
      <span className="ml-1 text-sm font-medium text-[var(--text-muted)]">/ month</span>
    </>
  );
}

export default function PricingCards() {
  const router = useRouter();
  const { account, requireAuth } = useAuth();

  const handleFree = () => {
    requireAuth({ type: "navigate-download" });
  };

  const handlePlan = () => {
    if (account) {
      router.push("/dashboard");
      return;
    }
    requireAuth({ type: "navigate-pricing" });
  };

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {/* Free tier */}
        <ScrollReveal className="h-full">
          <div className="flex h-full flex-col rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{FREE_TIER.name}</h3>
            </div>
            <div className="mt-4">
              <Price plan={FREE_TIER} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {FREE_TIER.tagline}
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {FREE_TIER.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-[var(--text-primary)]">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-dim)]">
                    <Check className="h-3 w-3 text-[var(--accent)]" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleFree}
              className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] text-sm font-semibold text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
            >
              {FREE_TIER.cta}
            </button>
          </div>
        </ScrollReveal>

        {/* Paid plans */}
        {PLANS.map((plan, i) => (
          <ScrollReveal key={plan.id} delay={i * 0.06} className="h-full">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className={`relative flex h-full flex-col rounded-3xl border p-7 ${
                plan.popular
                  ? "border-[var(--accent-border)] bg-[var(--surface-raised)] shadow-[0_0_60px_-20px_var(--accent-glow)]"
                  : "border-[var(--border)] bg-[var(--surface-raised)]"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-black">
                  Most Popular
                </span>
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{plan.name}</h3>
              </div>
              <div className="mt-4">
                <Price plan={plan} />
                <p className="mt-1 text-xs text-[var(--text-muted)]">{BILLING_INTERVAL_LABEL}</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{plan.tagline}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-[var(--text-primary)]">
                    <span
                      className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        plan.popular ? "bg-[var(--accent-dim)]" : "bg-[var(--surface)]"
                      }`}
                    >
                      <Check className="h-3 w-3 text-[var(--accent)]" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-[var(--text-muted)]">{WEEKLY_SCHEDULE_LABEL[plan.id]}</p>
              <button
                type="button"
                onClick={handlePlan}
                className={`mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  plan.popular
                    ? "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)] hover:shadow-[0_0_36px_var(--accent-glow)]"
                    : "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
                }`}
              >
                {account ? "Manage in dashboard" : plan.cta}
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-[var(--text-muted)]">
        All paid plans are {BILLING_INTERVAL_LABEL.toLowerCase()}s that renew each
        month until cancelled. Upgrades are managed from your dashboard.
      </p>
    </div>
  );
}