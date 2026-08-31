"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import TutorialModal from "@/components/TutorialModal";
import { Plug } from "@/components/icons";

export default function PluginInstall() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,var(--accent-dim),transparent_65%)] blur-2xl" />
      </div>

      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)] px-4 py-1.5 font-mono text-sm font-medium text-[var(--accent)]">
            <Plug className="h-4 w-4" />
            Bricky AI ↔ Roblox Studio
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Connect Bricky AI to Roblox Studio.
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-[var(--text-secondary)]">
            Bricky AI uses a Roblox Studio plugin to bridge your AI assistant
            with Studio. Install it once, and you&apos;re ready to build.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 text-[15px] font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_36px_var(--accent-glow)]"
            >
              How to install the plugin
            </button>
          </div>

          <p className="mt-6 text-xs text-[var(--text-muted)]">
            The plugin runs locally between the Bricky AI desktop app and Roblox Studio.
          </p>
        </ScrollReveal>
      </div>

      <TutorialModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
