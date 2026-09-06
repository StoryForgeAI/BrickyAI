"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight, Download } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";

export default function CTA() {
  const { requireAuth } = useAuth();
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl border border-[var(--accent-border)] bg-[var(--surface-raised)] px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent-dim),transparent_70%)]" />
              <div className="bg-grid absolute inset-0 opacity-40" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Ready to build?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--text-secondary)]">
              Get the app, sign in with Google, and start with 80 free credits.
              Your first plugin is closer than you think.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => requireAuth({ type: "navigate-download" })}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 text-[15px] font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_40px_var(--accent-glow)] sm:w-auto"
              >
                Start Building
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => requireAuth({ type: "download-windows" })}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-7 text-[15px] font-medium text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent-border)] hover:text-[var(--accent)] sm:w-auto"
              >
                <Download className="h-4 w-4" />
                Download Bricky AI
              </button>
            </div>
            <div className="mt-5 text-xs text-[var(--text-muted)]">Windows 10 / 11</div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}