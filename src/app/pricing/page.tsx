import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import PricingCards from "@/components/pricing/PricingCards";
import PricingFaq from "@/components/pricing/PricingFaq";
import { Check } from "@/components/icons";
import { COMPARISON_COLUMNS, COMPARISON_ROWS, type CellValue } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Pricing — Bricky AI",
  description:
    "Simple, transparent pricing for Bricky AI — the AI-powered workspace for Roblox scripting and Studio plugin development. AI provider usage is separate.",
};

function Cell({ value }: { value: CellValue }) {
  if (value === "yes") {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-dim)]">
        <Check className="h-3.5 w-3.5 text-[var(--accent)]" />
      </span>
    );
  }
  if (value === "no") {
    return <span className="text-[var(--text-muted)]">—</span>;
  }
  return <span className="text-[13px] leading-snug text-[var(--text-secondary)]">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,120,71,0.10),transparent_55%)]" />
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        </div>
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
              Pricing
            </div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-6xl">
              Simple, transparent pricing.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
              You pay Bricky AI for its software and features. AI provider usage
              is separate — depending on your selected provider and
              configuration, provider usage may be billed separately by the
              provider.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Plan cards + free tier */}
      <section className="relative pb-4">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <PricingCards />
        </div>
      </section>

      {/* Provider disclosure */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <ScrollReveal>
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] p-8 sm:p-10">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                Your AI provider, your usage
              </h2>
              <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                <p>
                  Bricky AI plans provide access to Bricky AI&apos;s software
                  and features.
                </p>
                <p>
                  Supported AI provider usage may require you to connect or
                  configure your own provider account or API access.
                </p>
                <p>
                  OpenAI and Anthropic are separate third-party services and are
                  not included in the Bricky AI subscription price unless
                  explicitly stated otherwise.
                </p>
                <p>
                  Provider fees, usage charges, rate limits, availability, and
                  account requirements are determined by the applicable provider
                  and may change independently of Bricky AI.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Comparison */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
              Compare plans
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Everything at a glance.
            </h2>
          </ScrollReveal>

          <ScrollReveal className="mt-10" delay={0.08}>
            <div className="overflow-x-auto rounded-3xl border border-[var(--border)]">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="px-6 py-5 text-sm font-semibold text-[var(--text-secondary)]">
                      Included with
                    </th>
                    {COMPARISON_COLUMNS.map((col) => (
                      <th
                        key={col.key}
                        className={`px-6 py-5 text-center ${
                          col.key === "pro" ? "bg-[var(--accent-dim)]" : ""
                        }`}
                      >
                        <span className="block text-sm font-semibold text-[var(--text-primary)]">
                          {col.label}
                        </span>
                        <span
                          className={`mt-1 block text-xs ${
                            col.key === "pro" ? "text-[var(--accent)] font-semibold" : "text-[var(--text-muted)]"
                          }`}
                        >
                          {col.key === "free" ? "Free" : `${col.priceLabel}/month`}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr
                      key={row.label}
                      className={i % 2 === 1 ? "bg-[var(--surface)]" : "bg-[var(--surface-raised)]"}
                    >
                      <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{row.label}</td>
                      <td className="px-6 py-4 text-center">{<Cell value={row.free} />}</td>
                      <td className="px-6 py-4 text-center">{<Cell value={row.starter} />}</td>
                      <td className="px-6 py-4 text-center bg-[var(--accent-dim)]">
                        <Cell value={row.pro} />
                      </td>
                      <td className="px-6 py-4 text-center"><Cell value={row.max} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-[var(--text-muted)]">
              Availability of some features may vary by application version. Plan
              features can change from time to time — see the Terms of Service.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <PricingFaq />

      {/* Compact legal disclosures */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="space-y-4">
            <ScrollReveal className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
                  Billing &amp; cancellation
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Subscriptions may be cancelled according to the applicable
                  subscription terms. Cancellation prevents future renewals;
                  access to paid features may continue until the end of the
                  applicable paid billing period unless otherwise required by
                  applicable law or stated in the Terms of Service.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
                  Refunds &amp; taxes
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Refunds and cancellation rights are subject to the{" "}
                  <a href="/terms#sec-29" className="text-[var(--accent)] underline-offset-2 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and applicable consumer protection laws. Where mandatory
                  consumer rights apply, those rights are not excluded by these
                  terms.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Applicable taxes may be calculated at checkout based on your
                  location and applicable law.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
                  AI output
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  AI-generated code and plugin output may contain errors or
                  require modification. You are responsible for reviewing,
                  testing, and validating generated code before using it in a
                  production Roblox experience.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Bricky AI does not guarantee that generated code, plugins, or
                  other AI output will be error-free, secure, compatible with
                  every Roblox Studio version, or suitable for every use case.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
                  Third-party providers
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  OpenAI and Anthropic are independent, third-party providers.
                  Bricky AI does not represent that it is affiliated with or
                  endorsed by those providers. Their availability, pricing,
                  terms, policies, and usage limits are controlled by those
                  providers.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  The existing{" "}
                  <a href="/terms" className="text-[var(--accent)] underline-offset-2 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-[var(--accent)] underline-offset-2 hover:underline">
                    Privacy Policy
                  </a>{" "}
                  remain the authoritative legal documents.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
                <div className="mx-auto max-w-3xl text-center">
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    Prices and available features may change. AI provider
                    availability, pricing, limits, and policies are controlled by
                    the applicable third-party provider. Bricky AI subscriptions
                    provide access to Bricky AI software features and do not
                    include third-party provider fees unless expressly stated.
                    Additional terms, limitations, cancellation rights, refunds,
                    and applicable consumer rights are described in our{" "}
                    <a href="/terms" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline">
                      Terms of Service
                    </a>
                    .
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-[var(--text-muted)]">
                    <a href="/terms" className="transition-colors hover:text-[var(--accent)]">
                      Terms of Service
                    </a>
                    <span className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
                    <a href="/privacy" className="transition-colors hover:text-[var(--accent)]">
                      Privacy Policy
                    </a>
                    <span className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
                    <a href="/terms#sec-29" className="transition-colors hover:text-[var(--accent)]">
                      Refund policy
                    </a>
                    <span className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
                    <span>
                      Bricky AI is an independent third-party tool and is not
                      affiliated with, endorsed by, or sponsored by Roblox
                      Corporation.
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}