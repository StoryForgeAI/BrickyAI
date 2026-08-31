"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { Cpu, Lock } from "@/components/icons";

const PROVIDERS = [
  { id: "openai", name: "OpenAI", models: ["ChatGPT", "GPT"], tag: "Primary" },
  { id: "anthropic", name: "Anthropic", models: ["Claude"], tag: "Primary" },
  { id: "local", name: "Local / other", models: ["Custom endpoint"], tag: "When available" },
];

export default function AIProviders() {
  const reduce = useReducedMotion();
  const [provider, setProvider] = useState(PROVIDERS[0].id);
  const [model, setModel] = useState(PROVIDERS[0].models[0]);

  const active = PROVIDERS.find((p) => p.id === provider)!;

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            AI Providers
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Choose your AI.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            Pick the AI provider and model that powers your plugin development
            chat. Your key stays yours — Bricky AI keeps it local.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-2">
          {/* Provider picker */}
          <ScrollReveal direction="right">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                <Cpu className="h-4 w-4" />
                AI Provider
              </div>
              <div className="space-y-2">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setProvider(p.id);
                      setModel(p.models[0]);
                    }}
                    aria-pressed={provider === p.id}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 ${
                      provider === p.id
                        ? "border-[var(--accent-border)] bg-[var(--accent-dim)] text-[var(--text-primary)]"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          provider === p.id ? "bg-[var(--accent)]" : "bg-[var(--border-strong)]"
                        }`}
                      />
                      {p.name}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">{p.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Model picker */}
          <ScrollReveal direction="left">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                <Lock className="h-4 w-4" />
                Model
              </div>
              <div className="space-y-2">
                {active.models.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModel(m)}
                    aria-pressed={model === m}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 ${
                      model === m
                        ? "border-[var(--accent-border)] bg-[var(--accent-dim)] text-[var(--text-primary)]"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          model === m ? "bg-[var(--accent)]" : "bg-[var(--border-strong)]"
                        }`}
                      />
                      {m}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">select</span>
                  </button>
                ))}
                <motion.div
                  key={provider}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs text-[var(--text-muted)]"
                >
                  Selected: <span className="text-[var(--accent)]">{provider}</span> /{" "}
                  <span className="text-[var(--text-primary)]">{model}</span>
                </motion.div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal className="mt-6 text-center text-xs text-[var(--text-muted)]">
          Available providers and model access may vary over time.
        </ScrollReveal>
      </div>
    </section>
  );
}
