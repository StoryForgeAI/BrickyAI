import ScrollReveal from "@/components/ScrollReveal";
import { Check, Cpu, Plug } from "@/components/icons";

const CASES = [
  {
    icon: Cpu,
    eyebrow: "Code with AI",
    title: "Develop Luau and game scripts with an assistant that knows Roblox.",
    body: "Bricky AI works on your machine, connected to Roblox Studio, so it can read the code you're stuck on and help you move.",
    bullets: [
      "Refactor and explain unfamiliar Luau",
      "Debug errors with the full context",
      "Generate event scripts, systems, and utilities",
    ],
  },
  {
    icon: Plug,
    eyebrow: "Create Roblox plugins",
    title: "Go from an idea to a working Studio plugin.",
    body: "Describe what the plugin should do, let Bricky structure it, and install it straight into Studio — then keep iterating.",
    bullets: [
      "Generate plugin structure and toolbar actions",
      "Iterate until it behaves the way you want",
      "Install into Studio through the local plugin",
    ],
  },
];

export default function UseCases() {
  return (
    <section id="plugins" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            What you can do
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Code with AI, or create plugins with AI.
          </h2>
        </ScrollReveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          {CASES.map((useCase, i) => (
            <ScrollReveal key={useCase.eyebrow} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] p-8 sm:p-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--accent-border)] bg-[var(--accent-dim)]">
                  <useCase.icon className="h-6 w-6 text-[var(--accent)]" />
                </div>
                <div className="mt-5 text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
                  {useCase.eyebrow}
                </div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                  {useCase.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  {useCase.body}
                </p>
                <ul className="mt-6 space-y-3">
                  {useCase.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm text-[var(--text-primary)]">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-dim)]">
                        <Check className="h-3 w-3 text-[var(--accent)]" />
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}