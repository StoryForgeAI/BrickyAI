"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import { useRef } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowDown } from "@/components/icons";

const STEPS = [
  {
    node: "YOU",
    title: "Describe your idea",
    desc: "Tell Bricky AI what plugin you want to build, in plain language.",
  },
  {
    node: "BRICKY AI",
    title: "The assistant plans",
    desc: "It turns your request into a structured, step-by-step development plan.",
  },
  {
    node: "AI MODEL",
    title: "Model does the work",
    desc: "Your chosen AI model helps generate and shape the plugin code.",
  },
  {
    node: "LOCAL DEVELOPMENT",
    title: "Builds locally",
    desc: "All development communication stays inside your secure local Bricky AI environment.",
  },
  {
    node: "ROBLOX STUDIO",
    title: "Arrives in Studio",
    desc: "The work flows into Roblox Studio through the Bricky AI plugin.",
  },
  {
    node: "PLUGIN",
    title: "Your plugin",
    desc: "Test it, refine it, and keep iterating naturally in conversation.",
  },
];

export default function HowItWorks() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            How it works
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            From idea to plugin.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            A clear pipeline that turns a simple description into a working
            Roblox Studio plugin — without leaving your desk.
          </p>
        </ScrollReveal>

        <div ref={ref} className="relative mt-20">
          {/* Animated vertical line */}
          {!reduce && (
            <div className="absolute bottom-6 left-[27px] top-2 w-px -translate-x-1/2 overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-[var(--border)]" />
              <motion.div
                className="absolute left-0 top-0 w-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]"
                style={{ height: "100%", scaleY, transformOrigin: "top" }}
              />
            </div>
          )}

          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.node} delay={i * 0.05}>
                <div className="flex gap-5 sm:gap-8">
                  <div className="relative z-10 flex w-14 shrink-0 flex-col items-center">
                    <span className="z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-border)] bg-[var(--surface-raised)] font-mono text-sm font-bold text-[var(--accent)] shadow-[0_0_24px_var(--accent-glow)]">
                      {step.node === "YOU" ? "01" : String(i + 1).padStart(2, "0")}
                    </span>
                    {i < STEPS.length - 1 && (
                      <span className="mt-3 text-[var(--accent)]">
                        <ArrowDown className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="mb-1 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                      {step.node}
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">{step.title}</h3>
                    <p className="mt-1.5 max-w-md text-[var(--text-secondary)]">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
