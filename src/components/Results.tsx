import ScrollReveal from "@/components/ScrollReveal";
import { Cpu, Folder, GitBranch, Plug } from "@/components/icons";

const OUTCOMES = [
  {
    icon: Cpu,
    title: "Build faster",
    body: "Generate working Luau, game systems, and tools in minutes instead of evenings.",
  },
  {
    icon: GitBranch,
    title: "Fix problems faster",
    body: "Describe the error in plain language and get a fix you can actually understand, with full context.",
  },
  {
    icon: Plug,
    title: "Create real plugins",
    body: "Turn ideas into Roblox Studio plugins that really run — structure, toolbar actions, and all.",
  },
  {
    icon: Folder,
    title: "Less time fighting Studio",
    body: "The setup and plugin plumbing is handled for you, so you stay in the flow.",
  },
];

export default function Results() {
  return (
    <section id="product" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            Why Bricky
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            A fast path from idea to working plugin.
          </h2>
        </ScrollReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OUTCOMES.map((outcome, i) => (
            <ScrollReveal key={outcome.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--accent-border)] bg-[var(--accent-dim)]">
                  <outcome.icon className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
                  {outcome.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {outcome.body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}