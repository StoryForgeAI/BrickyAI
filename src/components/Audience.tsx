import ScrollReveal from "@/components/ScrollReveal";
import { Cpu, Layers, Plug, Sparkles } from "@/components/icons";

const AUDIENCES = [
  {
    icon: <Plug className="h-5 w-5" />,
    title: "Roblox Developers",
    desc: "Build core game systems, scripts, and modules faster — with an AI that understands Luau and Roblox APIs.",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Plugin Developers",
    desc: "Create and iterate on Studio plugins that automate your workflow, all inside a local workspace.",
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    title: "Indie Developers",
    desc: "Ship more with a small team by pairing your own judgment with AI-generated code you actually read.",
  },
  {
    icon: <Layers className="h-5 w-5" />,
    title: "Teams",
    desc: "Keep organized projects and a consistent, reviewable development approach across the whole team.",
  },
];

export default function Audience() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            Built for builders
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Who is Bricky AI for?
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            Whether you ship games or tools, if you work in Roblox, Bricky AI is
            the AI workspace that meets you there.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((a, i) => (
            <ScrollReveal key={a.title} delay={i * 0.06} className="h-full">
              <div className="group h-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 transition-colors duration-300 hover:border-[var(--accent-border)]">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--accent)] transition-colors duration-300 group-hover:border-[var(--accent-border)] group-hover:bg-[var(--accent-dim)]">
                  {a.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {a.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}