import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy — Bricky AI",
  description: "Privacy Policy for Bricky AI.",
};

export default function PrivacyPage() {
  return (
    <section className="relative pt-32 pb-24 sm:pt-40">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Last updated: 2026</p>

        <div className="mt-10 space-y-8 text-[var(--text-secondary)] leading-relaxed">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
              Overview
            </h2>
            <p>
              {siteConfig.name} is designed to work locally. Development
              communication between the desktop app and Roblox Studio happens
              through your local environment and an authenticated local API.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
              AI Providers
            </h2>
            <p>
              When you connect an AI provider, the messages you send for plugin
              development are handled by that provider under their own terms and
              privacy policies. Keep your provider credentials secure.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
              Data You Provide
            </h2>
            <p>
              Project data is stored locally as part of the Bricky AI desktop
              experience. This summary is informational and does not constitute
              a complete privacy policy.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
              Contact
            </h2>
            <p>
              For privacy-related questions about {siteConfig.name}, reach out
              through the channels listed in the application.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
