"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { ChevronDown } from "@/components/icons";

const FAQS = [
  {
    q: "What is Bricky AI?",
    a: "Bricky AI is an AI-powered desktop assistant for creating and developing Roblox Studio plugins. It connects your AI assistant to Roblox Studio through a secure local setup.",
  },
  {
    q: "Is Bricky AI a Roblox game builder?",
    a: "No. Bricky AI is focused on helping developers create and develop Roblox Studio plugins — not on building games directly.",
  },
  {
    q: "Can Bricky AI create Roblox Studio plugins?",
    a: "Yes. Bricky AI helps you design, generate, and iterate on Roblox Studio plugins through conversation and a structured command system.",
  },
  {
    q: "Does Bricky AI work with Roblox Studio?",
    a: "Yes. Bricky AI connects to Roblox Studio through a Roblox Studio plugin, bridging the desktop app to your active Studio workspace.",
  },
  {
    q: "Which AI models can I use?",
    a: "Bricky AI lets you connect supported AI providers and choose which model powers your chat. Model availability may vary.",
  },
  {
    q: "Can I use ChatGPT?",
    a: "Bricky AI supports connecting supported AI providers, which can include OpenAI models such as ChatGPT. Availability may vary.",
  },
  {
    q: "Can I use Claude?",
    a: "Bricky AI supports connecting supported AI providers, which can include Anthropic models such as Claude. Availability may vary.",
  },
  {
    q: "Where is my project data stored?",
    a: "Development communication happens through your local Bricky AI environment. Keep project data organization in mind — refer to the privacy page for details.",
  },
  {
    q: "Does Bricky AI require an internet connection?",
    a: "Connecting to AI providers generally requires an internet connection, while the local Bricky AI environment and plugin communication happen on your machine.",
  },
  {
    q: "How do I install the Roblox Studio plugin?",
    a: "Download Bricky AI, open it, then follow the in-app steps to install and enable the Roblox Studio plugin. See the 'How to install the plugin' tutorial above.",
  },
  {
    q: "Where can I download Bricky AI?",
    a: "You can download Bricky AI for Windows from the Download page on this site.",
  },
  {
    q: "Is Bricky AI free?",
    a: "Current availability and model access may change. Check the app for the latest information.",
  },
];

export default function Faq() {
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
            Frequently asked questions.
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
                    aria-controls={`faq-panel-${i}`}
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
                        id={`faq-panel-${i}`}
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
