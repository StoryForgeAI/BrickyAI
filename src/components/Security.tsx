import ScrollReveal from "@/components/ScrollReveal";
import { Lock, Plug, Shield, GitBranch } from "@/components/icons";

const ITEMS = [
  {
    icon: <Lock className="h-5 w-5" />,
    title: "Local communication",
    desc: "The desktop app and Roblox Studio plugin communicate through your local environment.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Authenticated local API",
    desc: "Interactions use an authenticated local API rather than open endpoints.",
  },
  {
    icon: <GitBranch className="h-5 w-5" />,
    title: "Structured commands",
    desc: "Bricky AI works through a structured command system instead of arbitrary Lua execution.",
  },
  {
    icon: <Plug className="h-5 w-5" />,
    title: "Controlled Studio plugin",
    desc: "The Roblox Studio plugin exposes only the workflows Bricky AI is designed to use.",
  },
];

export default function Security() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal direction="right">
            <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
              Security & Privacy
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Built to stay local.
            </h2>
            <p className="mt-5 leading-relaxed text-[var(--text-secondary)]">
              Bricky AI is designed around your local environment. Development
              communication stays on your machine, protected behind an
              authenticated local API — and driven by structured commands rather
              than arbitrary code execution in Studio.
            </p>
            <p className="mt-4 text-sm text-[var(--text-muted)]">
              As with any local tool, keep your machine and your AI provider
              credentials secure.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              {ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 transition-colors hover:border-[var(--accent-border)]"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--accent)]">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-[var(--text-primary)]">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
