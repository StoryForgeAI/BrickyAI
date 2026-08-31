"use client";

import { motion, useReducedMotion } from "motion/react";
import ScrollReveal from "@/components/ScrollReveal";
import { Check, ChevronDown, Cpu } from "@/components/icons";

const COMMANDS = [
  { name: "create_plugin", detail: "initialize plugin workspace" },
  { name: "create_toolbar", detail: "add a PluginToolbar" },
  { name: "create_button", detail: "add a toolbar button" },
  { name: "configure_plugin", detail: "set metadata & actions" },
];

export default function CommandSystem() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-[var(--accent-dim)] blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal direction="right">
            <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
              Command System
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Structured commands. Not arbitrary execution.
            </h2>
            <p className="mt-5 leading-relaxed text-[var(--text-secondary)]">
              Instead of letting AI run arbitrary Lua directly, Bricky AI works
              through a structured command system. Each command represents a
              controlled, well-defined action — so development stays predictable
              and intentional.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Controlled, composable development actions",
                "Readable, reviewable command sequences",
                "A safe boundary between the AI and Studio",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[var(--text-secondary)]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-dim)] text-[var(--accent)]">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-[var(--text-muted)]">
              Visual concept only — the command names shown here illustrate the
              structured approach and may not exist in the current product.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="left">
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[#0b0b0d] font-mono text-sm shadow-2xl">
              <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#3a3a42]" />
                <span className="h-3 w-3 rounded-full bg-[#3a3a42]" />
                <span className="h-3 w-3 rounded-full bg-[#3a3a42]" />
                <span className="ml-2 inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <Cpu className="h-3.5 w-3.5" /> bricky · creating plugin
                </span>
              </div>
              <div className="space-y-1 p-5">
                <div className="flex items-center gap-2 pb-2 text-[var(--text-secondary)]">
                  <span className="text-[var(--text-muted)]">~</span>
                  Creating plugin…
                </div>
                {COMMANDS.map((cmd, i) => (
                  <motion.div
                    key={cmd.name}
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.5, duration: 0.4 }}
                    className="flex items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2 text-[var(--text-primary)] transition-colors hover:border-[var(--border)] hover:bg-[var(--surface-raised)]"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[var(--accent)]">→</span>
                      <span className="text-[var(--accent)]">{cmd.name}</span>
                    </span>
                    <span className="hidden text-xs text-[var(--text-muted)] sm:inline">
                      {cmd.detail}
                    </span>
                    <span className="flex items-center justify-center rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] uppercase text-[var(--text-muted)]">
                      run
                    </span>
                  </motion.div>
                ))}
                <motion.div
                  initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + COMMANDS.length * 0.5, duration: 0.4 }}
                  className="mt-2 flex items-center gap-2 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-dim)] px-3 py-2.5 text-[var(--text-primary)]"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--success)] text-black">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  Plugin ready
                  <ChevronDown className="ml-auto h-4 w-4 text-[var(--text-muted)]" />
                </motion.div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
