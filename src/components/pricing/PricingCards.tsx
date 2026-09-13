"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight, Check, Close } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";
import { BILLING_INTERVAL_LABEL, FREE_TIER, PLANS, type Plan, type PlanId } from "@/lib/plans";

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
  const { user, requireAuth } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);
  // Remembers which plan the user picked before the Google login round-trip so
  // the confirmation modal reopens automatically after they sign in.
  const pendingPlanRef = useRef<PlanId | null>(null);

  const openPlanModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setCheckoutStatus(null);
  };

  const closePlanModal = () => {
    setSelectedPlan(null);
    setCheckoutStatus(null);
  };

  const scrollToProviders = () => {
    closePlanModal();
    document.getElementById("providers")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFree = () => {
    requireAuth({ type: "navigate-download" });
  };

  const handlePlan = (plan: Plan) => {
    if (user) {
      openPlanModal(plan);
      return;
    }
    pendingPlanRef.current = plan.id;
    requireAuth({ type: "navigate-pricing" });
  };

  // Continue the selected plan after the Google login round-trip completes.
  useEffect(() => {
    if (!user || !pendingPlanRef.current) return;
    const id = pendingPlanRef.current;
    pendingPlanRef.current = null;
    const plan = PLANS.find((p) => p.id === id);
    if (!plan) return;
    const timer = window.setTimeout(() => openPlanModal(plan), 0);
    return () => window.clearTimeout(timer);
  }, [user]);

  // Close the confirmation modal with Escape.
  useEffect(() => {
    if (!selectedPlan) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePlanModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedPlan]);

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
            <div
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
              <button
                type="button"
                onClick={() => handlePlan(plan)}
                className={`mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  plan.popular
                    ? "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)] hover:shadow-[0_0_36px_var(--accent-glow)]"
                    : "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-[var(--text-muted)]">
        All paid plans are {BILLING_INTERVAL_LABEL.toLowerCase()}s that renew each
        month until cancelled. Online checkout is being set up — nothing is
        charged until it&apos;s live.
      </p>

      {/* Pre-checkout confirmation */}
      <AnimatePresence>
        {selectedPlan && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closePlanModal}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-confirm-title"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 top-1/2 z-[61] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] p-7 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <h2
                  id="checkout-confirm-title"
                  className="text-xl font-bold tracking-tight text-[var(--text-primary)]"
                >
                  Before you continue
                </h2>
                <button
                  type="button"
                  onClick={closePlanModal}
                  aria-label="Close"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  <Close className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                Bricky AI is a software subscription.
              </p>

              <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Your selected plan
                </p>
                <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">
                  Bricky AI {selectedPlan.name} — {selectedPlan.priceLabel}/month
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-dim)] p-4">
                <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                  You will need a supported AI provider to use Bricky AI&apos;s
                  AI-powered features. Provider usage is billed separately by the
                  provider where applicable.
                </p>
              </div>

              {checkoutStatus && (
                <p role="status" className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {checkoutStatus}
                </p>
              )}

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    setCheckoutStatus(
                      `Checkout for Bricky AI ${selectedPlan.name} (${selectedPlan.priceLabel}/month) is being set up. Nothing has been charged.`
                    )
                  }
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-sm font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_36px_var(--accent-glow)]"
                >
                  Continue to checkout
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollToProviders}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] text-sm font-medium text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
                >
                  Learn about AI providers
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}