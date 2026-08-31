"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import StatusIndicator from "@/components/StatusIndicator";
import { Check, Folder, Logo, Message } from "@/components/icons";

const PLAN_STEPS = [
  { text: "Planning plugin architecture…", type: "work" },
  { text: "Creating plugin structure…", type: "work" },
  { text: "Adding toolbar actions…", type: "work" },
  { text: "Writing utility module…", type: "work" },
  { text: "Plugin generated", type: "done" },
];

function useLoop(active: boolean, stepMs = 900, holdMs = 3200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setCount((c) => c + 1), stepMs);
    return () => window.clearInterval(id);
  }, [active, stepMs]);
  const cycleLength = PLAN_STEPS.length;
  const phase = count % (cycleLength * 2);
  if (phase < cycleLength) {
    return Math.min(phase + 1, cycleLength);
  }
  if (phase === cycleLength) return cycleLength;
  void holdMs;
  return cycleLength;
}

export default function ProductMockup() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const activeSteps = useLoop(active);

  useEffect(() => {
    const t = window.setTimeout(() => setActive(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  if (reduce) {
    return (
      <div className="relative">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-2xl">
          <MockStatic />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* Top bar */}
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#3a3a42]" />
          <span className="h-3 w-3 rounded-full bg-[#3a3a42]" />
          <span className="h-3 w-3 rounded-full bg-[#3a3a42]" />
          <span className="ml-3 inline-flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
            <Logo className="h-4 w-4" />
            Bricky AI
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-dim)] px-2.5 py-1 text-[11px] font-medium text-[var(--accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] pulse-dot" />
            Studio Connected
          </span>
        </div>

        {/* Chat body */}
        <div className="space-y-4 px-5 py-5">
          {/* User message */}
          <div className="flex justify-end">
            <div className="max-w-[82%] rounded-2xl rounded-tr-sm bg-[var(--accent-dim)] px-4 py-2.5 text-sm text-[var(--text-primary)] ring-1 ring-[var(--accent-border)]">
              Create a plugin that adds a toolbar button to insert a part with a
              custom smooth surface…
            </div>
          </div>

          {/* Assistant work log */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-hover)] text-[var(--accent)]">
              <Message className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 space-y-1.5 font-mono text-[13px]">
              {PLAN_STEPS.map((step, i) => {
                const shown = i < activeSteps;
                const done = step.type === "done" && shown;
                if (step.type === "done") {
                  return (
                    <motion.div
                      key={step.text}
                      initial={{ opacity: 0, y: 6 }}
                      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-2 text-[var(--text-primary)]"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--success)] text-black">
                        <Check className="h-3 w-3" />
                      </span>
                      {step.text}
                    </motion.div>
                  );
                }
                return (
                  <motion.div
                    key={step.text}
                    initial={{ opacity: 0, y: 6 }}
                    animate={shown ? { opacity: 1, y: 0 } : { opacity: 0.15 }}
                    transition={{ duration: 0.3 }}
                    className={done ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}
                  >
                    {done ? "✓ " : ""}
                    {step.text}
                  </motion.div>
                );
              })}
              {activeSteps < PLAN_STEPS.length && (
                <span className={active ? "caret" : "caret opacity-0"} />
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] px-4 py-3 text-[11px] text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
            AI Ready
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Folder className="h-3.5 w-3.5" />
            Plugin Workshop
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            gpt / claude
          </span>
        </div>
      </motion.div>

      {/* Floating status chips */}
      <FloatingChip
        className="-left-4 top-16 sm:-left-8"
        delay={0.9}
      >
        <StatusIndicator label="Studio Connected" pulse />
      </FloatingChip>
      <FloatingChip className="-right-3 bottom-20 sm:-right-8" delay={1.1}>
        <StatusIndicator label="Local Development" tone="success" />
      </FloatingChip>
      <FloatingChip className="-left-2 -bottom-4 hidden sm:-left-6 sm:inline-flex" delay={1.3}>
        <StatusIndicator label="Secure Connection" tone="muted" />
      </FloatingChip>
    </div>
  );
}

function MockStatic() {
  return (
    <>
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#3a3a42]" />
        <span className="ml-3 text-xs font-medium text-[var(--text-secondary)]">
          <Logo className="mr-1 inline h-4 w-4" /> Bricky AI
        </span>
        <span className="ml-auto rounded-full bg-[var(--accent-dim)] px-2.5 py-1 text-[11px] font-medium text-[var(--accent)]">
          Studio Connected
        </span>
      </div>
      <div className="space-y-4 px-5 py-5">
        <div className="flex justify-end">
          <div className="max-w-[82%] rounded-2xl rounded-tr-sm bg-[var(--accent-dim)] px-4 py-2.5 text-sm text-[var(--text-primary)]">
            Create a plugin that adds a toolbar button to insert a part…
          </div>
        </div>
        <div className="space-y-1.5 font-mono text-[13px] text-[var(--text-secondary)]">
          <div>Planning plugin architecture…</div>
          <div>Creating plugin structure…</div>
          <div className="text-[var(--text-primary)]">✓ Plugin generated</div>
        </div>
      </div>
    </>
  );
}

function FloatingChip({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`absolute z-10 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
