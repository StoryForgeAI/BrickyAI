"use client";

import ScrollReveal from "@/components/ScrollReveal";
import ProductMockup from "@/components/ProductMockup";
import { useAuth } from "@/context/AuthContext";
import { Check, Sparkles } from "@/components/icons";

const CHECKS = [
  "Plugin structure, metadata, and toolbar actions",
  "Luau utility modules for your plugin",
  "Iterate in conversation until it works",
  "Load it straight into Studio via the Bricky AI plugin",
];

export default function PluginCreator() {
  const { requireAuth } = useAuth();

  return (
    <section id="plugin-creator" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[var(--accent-dim)] blur-[130px]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal direction="right" className="order-2 lg:order-1">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-x-6 -top-8 -bottom-10 -z-10 rounded-[36px] bg-[radial-gradient(ellipse_at_center,rgba(255,120,71,0.10),transparent_70%)] blur-2xl" />
              <ProductMockup />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.1} className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)] px-4 py-1.5 text-sm font-medium text-[var(--accent)]">
              <Sparkles className="h-4 w-4" />
              Plugin Creator
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Build your own Roblox tools with AI.
            </h2>
            <p className="mt-5 leading-relaxed text-[var(--text-secondary)]">
              From a sentence to a Studio plugin. Describe a toolbar, a helper
              tool, or an internal workflow — and Bricky AI generates the
              structure and Luau to make it real.
            </p>
            <ul className="mt-6 space-y-3">
              {CHECKS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[var(--text-secondary)]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-dim)] text-[var(--accent)]">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => requireAuth({ type: "navigate-download" })}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--accent)] px-7 text-[15px] font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_36px_var(--accent-glow)]"
              >
                <Sparkles className="h-4 w-4" />
                Create a Plugin
              </button>
            </div>
            <p className="mt-4 text-xs text-[var(--text-muted)]">Windows 10 / 11</p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}