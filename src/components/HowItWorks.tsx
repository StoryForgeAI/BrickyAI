import ScrollReveal from "@/components/ScrollReveal";
import { Cpu, GitBranch, Layers, Message } from "@/components/icons";

const STEPS = [
  {
    icon: Message,
    step: "01",
    title: "Describe",
    body: "Tell Bricky what you want — a script, a game system, or a Studio plugin — in plain language.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Build",
    body: "Bricky generates Luau or plugin structure for you, written for your project.",
  },
  {
    icon: GitBranch,
    step: "03",
    title: "Test",
    body: "Run it in Roblox Studio. When something breaks, describe the problem and get a fix.",
  },
  {
    icon: Layers,
    step: "04",
    title: "Improve",
    body: "Keep refining with follow-up prompts until it does exactly what you want.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            How it works
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Four steps. No getting stuck.
          </h2>
        </ScrollReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 0.07}>
              <div className="relative h-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent-border)] bg-[var(--accent-dim)]">
                    <step.icon className="h-5 w-5 text-[var(--accent)]" />
                  </div>
                  <span className="font-mono text-xs text-[var(--text-muted)]">{step.step}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {step.body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}