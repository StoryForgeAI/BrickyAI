import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import Marquee from "@/components/Marquee";
import DownloadCards from "@/components/DownloadCards";
import CopyButton from "@/components/CopyButton";
import Faq from "@/components/Faq";
import {
  ArrowDown,
  Check,
  Folder,
  Windows,
  Cpu,
  Download,
  Plug,
  Lock,
} from "@/components/icons";
import { PLUGINS_FOLDER, PLUGINS_FOLDER_EXAMPLE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Download Bricky AI — AI-Powered Roblox Studio Plugin Development",
  description:
    "Download the Bricky AI desktop application and Roblox Studio plugin for Windows and start building plugins with AI.",
};

const INSTALL_STEPS = [
  {
    title: "Download the plugin",
    desc: "Get the Bricky AI .rbxmx plugin from the card above.",
    icon: <Download className="h-5 w-5" />,
  },
  {
    title: "Open your Roblox Plugins folder",
    desc: `Navigate to your local Roblox Studio Plugins directory.`,
    icon: <Folder className="h-5 w-5" />,
  },
  {
    title: "Place BrickyAI.rbxmx inside",
    desc: "Copy the plugin file into the Plugins folder.",
    icon: <Plug className="h-5 w-5" />,
  },
  {
    title: "Restart Roblox Studio",
    desc: "Close and reopen Roblox Studio so it picks up the new plugin.",
    icon: <Cpu className="h-5 w-5" />,
  },
  {
    title: "Enable Bricky AI",
    desc: "Open the Plugins toolbar and enable Bricky AI.",
    icon: <Check className="h-5 w-5" />,
  },
];

const REQUIREMENTS = [
  "Windows 10 or newer",
  "Roblox Studio",
  "Internet connection for AI services",
  "Bricky AI Roblox Studio Plugin",
];

const PLATFORMS = [
  { name: "Windows", status: "Available", state: "available" },
  { name: "macOS", status: "Coming later", state: "soon" },
  { name: "Linux", status: "Coming later", state: "soon" },
] as const;

export default function DownloadPage() {
  return (
    <>
      {/* ------------------------------------------------ HERO */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-border)] to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,120,71,0.12),transparent_55%)]" />
          <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
        </div>

        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)] px-4 py-1.5 text-sm font-medium text-[var(--accent)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] pulse-dot" />
              Currently available for Windows
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-6xl">
              Download <span className="text-[var(--accent)]">Bricky AI</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)]">
              Everything you need to build and create with Bricky AI.
            </p>

            <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-2 text-xs text-[var(--text-muted)] sm:flex-row sm:justify-center sm:gap-3">
              <span className="inline-flex items-center gap-1.5">
                <Windows className="h-3.5 w-3.5 text-[var(--accent)]" />
                Windows
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-[var(--border-strong)] sm:inline-block" />
              <span>Windows is currently the only supported platform.</span>
              <span className="hidden h-1 w-1 rounded-full bg-[var(--border-strong)] sm:inline-block" />
              <span>macOS and Linux support may come later.</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* --------------------------------------- DOWNLOAD CARDS */}
      <section className="relative pb-8 sm:pb-12">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <ScrollReveal delay={0.1}>
            <DownloadCards />
          </ScrollReveal>
        </div>
      </section>

      <Marquee />

      {/* ------------------------------ PLUGIN INSTALLATION INFO */}
      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
              Installation
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Install the Roblox Studio Plugin
            </h2>
            <p className="mt-4 text-[var(--text-secondary)]">
              The plugin is a local Roblox Studio plugin. Place the downloaded{" "}
              <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[var(--accent)]">
                .rbxmx
              </code>{" "}
              file into your local Roblox Studio Plugins folder — not a game or
              project folder.
            </p>
          </ScrollReveal>

          <div className="mx-auto mt-12 max-w-2xl space-y-3">
            {[
              "Download the Bricky AI plugin.",
              "Close Roblox Studio if it is currently open.",
              "Place the downloaded .rbxmx plugin file into your local Roblox Studio Plugins folder.",
              "Open Roblox Studio again.",
              "Enable Bricky AI from the Plugins toolbar.",
            ].map((step, i) => (
              <ScrollReveal key={step} delay={i * 0.05}>
                <div className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 transition-colors hover:border-[var(--accent-border)]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-dim)] font-mono text-xs font-bold text-[var(--accent)]">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{step}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Copyable folder path */}
          <ScrollReveal delay={0.1} className="mx-auto mt-10 max-w-2xl">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <Folder className="h-4 w-4 text-[var(--accent)]" />
                Your local Roblox Plugins folder
              </div>

              <div className="mt-4 flex items-center gap-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-[var(--text-secondary)]">
                  {PLUGINS_FOLDER}
                </code>
                <CopyButton text={PLUGINS_FOLDER} label="Copy" />
              </div>

              <p className="mt-3 text-xs text-[var(--text-muted)]">
                On Windows this expands to (using your Windows username):
              </p>

              <div className="mt-2 flex items-center gap-3 overflow-hidden rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3">
                <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-[var(--text-secondary)]">
                  {PLUGINS_FOLDER_EXAMPLE}
                </code>
                <CopyButton text={PLUGINS_FOLDER_EXAMPLE} label="Copy" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* --------------------------------- VISUAL INSTALLATION STEPS */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,var(--accent-dim),transparent_65%)] blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
              Get connected
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Five steps to a connected Studio.
            </h2>
          </ScrollReveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {INSTALL_STEPS.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.07}>
                <div className="group relative flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-border)]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[var(--accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-dim)] text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-black">
                      {step.icon}
                    </span>
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.2} className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)] px-5 py-2.5 text-sm font-medium text-[var(--accent)]">
              <Plug className="h-4 w-4" />
              Connect
              <ArrowDown className="h-4 w-4" />
              Start creating plugins
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ----------------------------------------- SYSTEM REQUIREMENTS */}
      <section className="relative py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <ScrollReveal>
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] p-7 sm:p-10">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)]">
                    <Cpu className="h-6 w-6" />
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    System Requirements
                  </h2>
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                  <Windows className="h-3.5 w-3.5 text-[var(--accent)]" /> Windows
                </span>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {REQUIREMENTS.map((req) => (
                  <div
                    key={req}
                    className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)]"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-dim)] text-[var(--accent)]">
                      <Check className="h-3 w-3" />
                    </span>
                    {req}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ------------------------------------------------- COMING SOON */}
      <section className="relative py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <ScrollReveal>
            <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
              Platform support
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              More platforms are coming.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[var(--text-secondary)]">
              Bricky AI is currently available for Windows. Additional platforms
              may be supported in the future.
            </p>

            <div className="mx-auto mt-10 grid max-w-md gap-3">
              {PLATFORMS.map((p, i) => (
                <ScrollReveal key={p.name} delay={i * 0.06}>
                  <div
                    className={`flex items-center justify-between rounded-2xl border px-5 py-4 ${
                      p.state === "available"
                        ? "border-[var(--accent-border)] bg-[var(--accent-dim)]"
                        : "border-[var(--border)] bg-[var(--surface-raised)] opacity-80"
                    }`}
                  >
                    <span className="flex items-center gap-3 font-medium text-[var(--text-primary)]">
                      {p.name === "Windows" ? (
                        <Windows className="h-4 w-4 text-[var(--accent)]" />
                      ) : (
                        <Lock className="h-4 w-4 text-[var(--text-muted)]" />
                      )}
                      {p.name}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                        p.state === "available" ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                      }`}
                    >
                      {p.state === "available" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] pulse-dot" />
                      )}
                      {p.status}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Faq />
    </>
  );
}
