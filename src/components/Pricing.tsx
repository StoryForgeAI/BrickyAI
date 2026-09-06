"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight, Check } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";

const INCLUDED = [
  "80 credits included with your first sign-in",
  "Free to install and get started",
  "Bring your own AI provider",
  "No subscription required to start",
];

export default function Pricing() {
  const { requireAuth } = useAuth();
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            Pricing
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Start building for free.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            Every new account starts with 80 free credits — a one-time starter
            grant, validated on our servers.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mx-auto mt-12 max-w-md" delay={0.1}>
          <div className="overflow-hidden rounded-3xl border border-[var(--accent-border)] bg-[var(--surface-raised)]">
            <div className="border-b border-[var(--border-subtle)] px-8 py-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Starter</h3>
                <div className="text-right">
                  <span className="text-3xl font-bold text-[var(--text-primary)]">Free</span>
                  <span className="ml-1 text-sm text-[var(--text-muted)]">to start</span>
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Everything you need to try Bricky AI with Roblox Studio.
              </p>
            </div>
            <div className="px-8 py-6">
              <ul className="space-y-3">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-primary)]">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-dim)]">
                      <Check className="h-3 w-3 text-[var(--accent)]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => requireAuth({ type: "navigate-download" })}
                className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 text-[15px] font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_40px_var(--accent-glow)]"
              >
                Start Building
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="mt-4 text-center text-xs text-[var(--text-muted)]">
                Windows 10 / 11
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}