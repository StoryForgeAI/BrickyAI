import Link from "next/link";
import { Logo } from "@/components/icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-black">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-[17px] font-semibold tracking-tight">
              <Logo className="h-7 w-7" />
              <span className="text-[var(--text-primary)]">
                Bricky <span className="text-[var(--accent)]">AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--text-secondary)]">
              AI-powered Roblox Studio plugin development.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Product</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/#product" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]">
                  Product
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Download</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/download" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]">
                  Download Bricky AI
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6 text-xs text-[var(--text-muted)] sm:flex-row">
          <p>© {currentYear} Bricky AI. All rights reserved.</p>
          <p>Bricky AI is an independent project and is not affiliated with Roblox Corporation.</p>
        </div>
      </div>
    </footer>
  );
}
