"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { ChevronDown } from "@/components/icons";

const FAQS = [
  {
    q: "Is this system actually charging money?",
    a: "No. Subscriptions on this site are currently a temporary test system — nothing is charged and there is no online checkout yet. Activating a plan only records a test subscription so the weekly credits flow can be validated.",
  },
  {
    q: "How do weekly credits work?",
    a: "Basic adds 250 credits every week. Pro adds 500 credits each week and 750 on the final week of each billing period. Grants are added to your balance and never reset.",
  },
  {
    q: "Do I need an AI provider?",
    a: "Yes. Bricky AI's AI-powered features require a supported AI provider configuration. The provider and its usage costs are separate from your Bricky AI subscription.",
  },
  {
    q: "Does my Bricky AI subscription include OpenAI or Anthropic usage?",
    a: "No. Your Bricky AI subscription provides access to Bricky AI's software features. Third-party AI provider usage is separate.",
  },
  {
    q: "Do I need ChatGPT Plus?",
    a: "Not necessarily. Bricky AI uses supported provider configurations rather than treating a ChatGPT Plus subscription as a Bricky AI entitlement. Provider requirements depend on the integration currently supported by Bricky AI.",
  },
  {
    q: "Can I use Bricky AI without a provider?",
    a: "AI-powered features require a supported provider. Some non-AI functionality may remain available depending on the application version.",
  },
  {
    q: "Is there a free way to start?",
    a: "Yes. New accounts start with 80 credits — a one-time starter grant. You can try Bricky AI before deciding whether to subscribe.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. You can cancel from the account dashboard at any time; access continues until the end of the current billing period, then the subscription ends. Cancellation and refund rights are subject to the applicable terms and mandatory consumer protection laws.",
  },
];

export default function PricingFaq() {
  const reduce = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
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