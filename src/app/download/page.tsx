import type { Metadata } from "next";
import Link from "next/link";
import DownloadCard from "@/components/DownloadCard";
import ScrollReveal from "@/components/ScrollReveal";
import Marquee from "@/components/Marquee";
import PluginInstall from "@/components/PluginInstall";
import Faq from "@/components/Faq";
import { Windows } from "@/components/icons";

export const metadata: Metadata = {
  title: "Download Bricky AI — AI-Powered Roblox Studio Plugin Development",
  description:
    "Download Bricky AI for Windows and start building Roblox Studio plugins with AI.",
};

const STEPS = [
  "Download Bricky AI",
  "Install the desktop application",
  "Open Bricky AI",
  "Install the Roblox Studio plugin",
  "Open Roblox Studio",
  "Enable the plugin",
  "Connect",
  "Start creating plugins",
];

export default function DownloadPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-border)] to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,120,71,0.12),transparent_55%)]" />
        </div>

        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-sm text-[var(--text-secondary)]">
              <Windows className="h-4 w-4 text-[var(--accent)]" />
              Windows
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-6xl">
              Download <span className="text-[var(--accent)]">Bricky AI</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)]">
              Start building Roblox Studio plugins with AI. Download the desktop
              app and connect it to Studio in minutes.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="mx-auto mt-12 max-w-md">
            <DownloadCard
              platform="windows"
              title="Bricky AI for Windows"
              subtitle="The AI-powered Roblox Studio plugin developer."
              meta="Windows 10 / 11 · Installer"
            />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="mt-8 text-sm text-[var(--text-secondary)]">
              Already have Bricky AI?{" "}
              <Link
                href="/#product"
                className="font-medium text-[var(--accent)] hover:underline"
              >
                See how it works
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </section>

      <Marquee />

      {/* Installation flow */}
      <section className="relative py-24 sm:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
              Get started
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              From download to first plugin.
            </h2>
          </ScrollReveal>

          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <ScrollReveal key={step} delay={i * 0.05}>
                <div className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 transition-colors hover:border-[var(--accent-border)]">
                  <span className="font-mono text-xs font-bold text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-3 text-sm font-medium text-[var(--text-primary)]">
                    {step}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <PluginInstall />
      <Faq />
    </>
  );
}
