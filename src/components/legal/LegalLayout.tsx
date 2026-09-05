import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "@/components/icons";

export interface TocEntry {
  id: string;
  num: string;
  label: string;
}

interface LegalLayoutProps {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: ReactNode;
  toc: TocEntry[];
  children: ReactNode;
  /** Linked companion document shown at the bottom (Terms ⇄ Privacy). */
  companion: { href: string; label: string; description: string };
}

/**
 * Shared layout for legal documents. Readable single-column prose with a
 * sticky table of contents on desktop and a horizontal chip nav on mobile.
 * Deliberately calm — no scroll-reveal animation on legal text.
 */
export default function LegalLayout({
  eyebrow,
  title,
  lastUpdated,
  intro,
  toc,
  children,
  companion,
}: LegalLayoutProps) {
  return (
    <section className="relative pt-28 pb-24 sm:pt-32 sm:pb-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-border)] to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,120,71,0.07),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <header className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Bricky AI
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)] px-3.5 py-1.5 text-xs font-medium text-[var(--accent)]">
              {eyebrow}
            </span>
            <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs text-[var(--text-muted)]">
              Last updated: {lastUpdated}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            {title}
          </h1>

          <div className="prose-legal mt-6 border-l-2 border-[var(--accent)] pl-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {intro}
          </div>
        </header>

        {/* Content + TOC */}
        <div className="mt-14 gap-14 lg:grid lg:grid-cols-[230px_minmax(0,1fr)]">
          {/* Desktop TOC */}
          <nav aria-label="Table of contents" className="hidden lg:block">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  On this page
                </div>
                <ol className="mt-4 space-y-2.5 text-[13px] leading-snug">
                  {toc.map((entry) => (
                    <li key={entry.id} className="flex gap-2">
                      <span className="font-mono text-[11px] text-[var(--accent)]">{entry.num}</span>
                      <a
                        href={`#${entry.id}`}
                        className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
                      >
                        {entry.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </nav>

          {/* Document */}
          <div className="min-w-0">
            {/* Mobile TOC */}
            <details className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] lg:hidden">
              <summary className="cursor-pointer select-none px-5 py-4 text-sm font-medium text-[var(--text-primary)]">
                On this page
              </summary>
              <ol className="grid grid-cols-1 gap-2 border-t border-[var(--border-subtle)] px-5 py-4 sm:grid-cols-2">
                {toc.map((entry) => (
                  <li key={entry.id} className="flex gap-2 text-[13px]">
                    <span className="font-mono text-[11px] text-[var(--accent)]">{entry.num}</span>
                    <a
                      href={`#${entry.id}`}
                      className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
                    >
                      {entry.label}
                    </a>
                  </li>
                ))}
              </ol>
            </details>

            <article className="max-w-3xl space-y-2">{children}</article>

            {/* Companion link */}
            <div className="mt-12 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {companion.description}{" "}
                <Link
                  href={companion.href}
                  className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
                >
                  {companion.label}
                </Link>
                .
              </p>
            </div>

            <p className="mt-8 max-w-3xl text-xs leading-relaxed text-[var(--text-muted)]">
              This document is provided in English. If it is translated into
              other languages, the English version prevails to the extent
              permitted by applicable law. Nothing in this document limits
              rights you may have under mandatory local law.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}