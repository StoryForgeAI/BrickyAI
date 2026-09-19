import Link from "next/link";
import { Logo } from "@/components/icons";

/**
 * Shared shell for the authentication pages (`/login`, `/register`, etc.):
 * the ambient gradient backdrop plus a centered card with the brand header.
 * Pure presentational — the actual form and state live in the child.
 */
export default function AuthCardLayout({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex min-h-[calc(100vh-18rem)] items-center justify-center overflow-hidden px-5 pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,120,71,0.12),transparent_55%)]" />
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      </div>

      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-6 py-5">
          <Link href="/" aria-label="Bricky AI home" className="flex items-center gap-3">
            <Logo className="h-9 w-9" />
          </Link>
          <div>
            <p className="text-lg font-semibold leading-tight text-[var(--text-primary)]">
              Bricky AI
            </p>
            <p className="text-xs font-medium text-[var(--accent)]">{eyebrow}</p>
          </div>
        </div>
        <div className="px-6 py-8 sm:px-8">{children}</div>
      </div>
    </section>
  );
}