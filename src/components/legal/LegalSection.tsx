import type { ReactNode } from "react";

interface LegalSectionProps {
  id: string;
  num: string;
  title: string;
  children: ReactNode;
}

/** A numbered section of a legal document. */
export default function LegalSection({ id, num, title, children }: LegalSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-28 border-b border-[var(--border-subtle)] py-8 first:pt-0 last:border-b-0"
    >
      <div className="flex items-start gap-4">
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-dim)] font-mono text-xs font-bold text-[var(--accent)]">
          {num}
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id={`${id}-title`}
            className="text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl"
          >
            {title}
          </h2>
          <div className="prose-legal mt-4">{children}</div>
        </div>
      </div>
    </section>
  );
}