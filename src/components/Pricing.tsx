import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight } from "@/components/icons";
import { FREE_TIER, PLANS } from "@/lib/plans";

export default function Pricing() {
const cards = [
  { name: FREE_TIER.name, price: "Free", note: "80 credits to start" },
  ...PLANS.map((p) => ({ name: p.name, price: p.priceLabel, note: `${p.priceLabel}/month` })),
];

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            Pricing
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Start building for free.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            New accounts start with 80 free credits, and paid plans begin at
            $4.99/month. Your AI provider usage is separate.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <ScrollReveal key={card.name} delay={i * 0.06} className={i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-6 py-6 text-center">
                <p className="text-sm font-medium text-[var(--text-secondary)]">{card.name}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  {card.price}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{card.note}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-8 text-center" delay={0.1}>
          <Link
            href="/pricing"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 text-[15px] font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_40px_var(--accent-glow)]"
          >
            See full pricing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}