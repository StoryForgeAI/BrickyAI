import ScrollReveal from "@/components/ScrollReveal";
import { Download } from "@/components/icons";

export default function CTA() {
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
              Start building plugins with AI.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--text-secondary)]">
              Download Bricky AI for Windows and connect your AI assistant to
              Roblox Studio.
            </p>
            <div className="mt-8">
              <a
                href="/download"
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-black transition-all duration-200 hover:shadow-[0_0_44px_var(--accent-glow)]"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <Download className="h-5 w-5" />
                Download Bricky AI
              </a>
            </div>
            <div className="mt-5 text-xs text-[var(--text-muted)]">Windows 10 / 11</div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
