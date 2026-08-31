import ScrollReveal from "@/components/ScrollReveal";
import { Check, Plug, Sparkles } from "@/components/icons";

const TRADITIONAL = [
  "Idea",
  "Documentation",
  "Studio",
  "Coding",
  "Testing",
  "Debugging",
  "Repeat",
];

const BRICKY = [
  "Idea",
  "AI",
  "Plugin",
  "Roblox Studio",
  "Test",
  "Improve",
];

export default function Positioning() {
  return (
    <section id="product" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-sm text-[var(--text-secondary)]">
            <Plug className="h-4 w-4 text-[var(--accent)]" />
            Plugin creator, not Roblox builder
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Not another <span className="text-[var(--text-secondary)] line-through decoration-[var(--accent)] decoration-2">Roblox builder</span>.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[var(--text-secondary)]">
            Bricky AI is built for developers who want to create{" "}
            <span className="text-[var(--text-primary)]">Roblox Studio plugins</span> with AI.
            It&apos;s an AI-powered plugin development assistant — not a game builder.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 lg:grid-cols-2">
          {/* Traditional */}
          <ScrollReveal direction="right">
            <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-7">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)]">
                <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
                Traditional workflow
              </div>
              <div className="mt-6 space-y-2.5">
                {TRADITIONAL.map((step, i) => (
                  <div key={step} className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <span className="w-6 font-mono text-xs text-[var(--text-muted)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Bricky */}
          <ScrollReveal direction="left" delay={0.1}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-dim)] p-7">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                <Sparkles className="h-4 w-4" />
                With Bricky AI
              </div>
              <div className="mt-6 space-y-2.5">
                {BRICKY.map((step) => (
                  <div key={step} className="flex items-center gap-3 text-[var(--text-primary)]">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${
                        step === "AI" ? "bg-[var(--accent)] text-black" : "bg-[var(--surface-raised)]"
                      }`}
                    >
                      {step === "AI" ? (
                        <Sparkles className="h-3.5 w-3.5" />
                      ) : (
                        <Check className="h-3.5 w-3.5 text-[var(--accent)]" />
                      )}
                    </span>
                    <span className="text-sm font-medium">{step}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs leading-relaxed text-[var(--text-muted)]">
                Fewer hops. More focus on the plugin you&apos;re actually building.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
