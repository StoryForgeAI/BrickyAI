import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight, Check, Cpu, Sparkles } from "@/components/icons";

const PILLARS = [
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "Code with AI",
    desc: "Write, refactor, and debug Luau the way you'd pair with a senior developer — game systems, scripts, and Roblox APIs.",
    points: [
      "Luau scripts and modules, generated & explained",
      "System design: rounds, inventory, combat, economy",
      "Context-aware debugging and refactoring",
    ],
    cta: "Explore AI Coding",
    href: "#ai-coding",
    accent: false,
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Create Roblox Plugins",
    desc: "Turn an idea into a Roblox Studio plugin — toolbar actions, custom tools, and helpers — generated and refined through conversation.",
    points: [
      "Plugin structure, metadata, and toolbar actions",
      "Luau utility modules for your plugin",
      "Iterate until it works, then load it into Studio",
    ],
    cta: "Create a Plugin",
    href: "#plugin-creator",
    accent: true,
  },
];

export default function Pillars() {
  return (
    <section id="product" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            What you can do
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Everything you need to develop with AI.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            Bricky AI is an AI development workspace for Roblox — two ways to
            build, one secure local workflow.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 lg:grid-cols-2">
          {PILLARS.map((pillar, i) => (
            <ScrollReveal
              key={pillar.title}
              direction={i === 0 ? "right" : "left"}
              delay={i * 0.1}
              className="h-full"
            >
              <div
                className={`flex h-full flex-col rounded-2xl border p-7 transition-colors duration-300 ${
                  pillar.accent
                    ? "border-[var(--accent-border)] bg-[var(--accent-dim)]"
                    : "border-[var(--border)] bg-[var(--surface-raised)] hover:border-[var(--accent-border)]"
                }`}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--accent)]">
                  {pillar.icon}
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-[var(--text-primary)]">
                  {pillar.title}
                </h3>
                <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">
                  {pillar.desc}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {pillar.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-dim)] text-[var(--accent)]">
                        <Check className="h-3 w-3" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-7">
                  <a
                    href={pillar.href}
                    className={`group inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-200 ${
                      pillar.accent
                        ? "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)] hover:shadow-[0_0_28px_var(--accent-glow)]"
                        : "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
                    }`}
                  >
                    {pillar.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}