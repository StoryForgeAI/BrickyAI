import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service — Bricky AI",
  description: "Terms of Service for Bricky AI.",
};

export default function TermsPage() {
  return (
    <section className="relative pt-32 pb-24 sm:pt-40">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Last updated: 2026</p>

        <div className="mt-10 space-y-8 text-[var(--text-secondary)] leading-relaxed">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
              Using {siteConfig.name}
            </h2>
            <p>
              {siteConfig.name} is an AI-powered desktop assistant for
              developing Roblox Studio plugins. By using it, you agree to use
              the software lawfully and in accordance with these terms.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
              No Affiliation
            </h2>
            <p>
              {siteConfig.name} is an independent project and is not affiliated
              with, endorsed by, or sponsored by Roblox Corporation.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
              Software Availability
            </h2>
            <p>
              Current availability, features, and AI model access may change at
              any time. The software is provided on an &ldquo;as is&rdquo; and
              &ldquo;as available&rdquo; basis.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
              Disclaimer
            </h2>
            <p>
              This is a summary of key terms and does not constitute the full
              terms of service. Please contact us for the complete terms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
