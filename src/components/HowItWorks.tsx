"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import { useRef } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowDown } from "@/components/icons";

const STEPS = [
  {
    node: "YOU",
    title: "Describe",
    desc: "Tell Bricky AI what to build — a Luau system or a new Studio plugin — in plain language.",
  },
  {
    node: "BRICKY AI",
    title: "Generate",
    desc: "The assistant plans the architecture and writes Luau with your chosen AI model.",
  },
  {
    node: "ROBLOX STUDIO",
    title: "Connect",
    desc: "Plugins and scripts flow into Roblox Studio through the Bricky AI plugin.",
  },
  {
    node: "LOOP",
    title: "Iterate",
    desc: "Test it, refine it, and keep going in conversation until it's exactly what you need.",
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
            A clear pipeline that turns a simple description into working code —
            whether it&apos;s a game system or a Studio plugin.
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
                      {String(i + 1).padStart(2, "0")}
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
