"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { ChevronDown } from "@/components/icons";

const FAQS = [
  {
    q: "Does my Bricky AI subscription include OpenAI or Anthropic API usage?",
    a: "No. Bricky AI subscriptions cover access to Bricky AI's software and features. If your selected configuration uses a third-party AI provider, that provider's usage fees and account requirements are separate.",
  },
  {
    q: "Do I need my own AI provider?",
    a: "Depending on the Bricky AI features and configuration you use, you may need to connect a supported provider account or API configuration. The available providers are shown in the application.",
  },
  {
    q: "Is AI usage unlimited?",
    a: "Not necessarily. Provider rate limits, Bricky AI technical limits, fair-use restrictions, and plan-specific limits may apply. See the Terms of Service for details.",
  },
  {
    q: "Is there a free way to start?",
    a: "Yes. New accounts start with 80 credits — a one-time starter grant. You can try Bricky AI before deciding whether to subscribe.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. You can manage or cancel your subscription through the available billing management interface. Cancellation and refund rights are subject to the applicable terms and mandatory consumer protection laws.",
  },
  {
    q: "Are OpenAI and Anthropic part of Bricky AI?",
    a: "No. They are independent third-party providers. Bricky AI does not represent that it is affiliated with or endorsed by those providers.",
  },
];

export default function PricingFaq() {
  const reduce = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            FAQ
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Billing questions, answered.
          </h2>
        </ScrollReveal>

        <div className="mt-12 space-y-3">
          {FAQS.map((faq, i) => {
            const open = openIndex === i;
            return (
              <ScrollReveal key={faq.q} delay={i * 0.03}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                    open ? "border-[var(--accent-border)] bg-[var(--surface-raised)]" : "border-[var(--border)] bg-[var(--surface-raised)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={`pricing-faq-panel-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[15px] font-medium text-[var(--text-primary)]">{faq.q}</span>
                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={`shrink-0 ${open ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`pricing-faq-panel-${i}`}
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}