import Link from "next/link";
import { Logo } from "@/components/icons";
import { companyInfo, hasCompleteCompanyInfo } from "@/lib/company";
import CookieSettingsButton from "@/components/cookies/CookieSettingsButton";

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
            <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
              Operated by{" "}
              <span className="text-[var(--text-secondary)]">
                {companyInfo.operatorName}
              </span>
              {!hasCompleteCompanyInfo && (
                <span
                  className="ml-2 inline-block cursor-help rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--accent)]"
                  title="Company details are placeholders that the operator needs to complete."
                >
                  Pending
                </span>
              )}
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
                <Link href="/#plugins" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]">
                  Plugins
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]">
                  Pricing
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
              <li>
                <CookieSettingsButton className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]">
                  Cookie Settings
                </CookieSettingsButton>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 space-y-3 border-t border-[var(--border-subtle)] pt-6 text-xs leading-5 text-[var(--text-muted)]">
          <address className="not-italic">
            <span className="font-semibold text-[var(--text-secondary)]">
              {companyInfo.operatorName}
            </span>{" "}
            · Registered in {companyInfo.operatorCountry} · Official registered
            address:{" "}
            <span className="font-mono text-[11px]">{companyInfo.legalAddress}</span>{" "}
            · Company registration number:{" "}
            <span className="font-mono text-[11px]">{companyInfo.registrationNumber}</span>{" "}
            · Tax/VAT:{" "}
            <span className="font-mono text-[11px]">{companyInfo.taxNumber}</span>{" "}
            · Registry:{" "}
            <span className="font-mono text-[11px]">{companyInfo.registryDetails}</span>
          </address>
          <p>
            Legal / privacy contact:{" "}
            <span className="font-mono text-[11px]">{companyInfo.contactEmail}</span>
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6 text-xs text-[var(--text-muted)] sm:flex-row">
          <p>© {currentYear} Bricky AI. All rights reserved.</p>
          <p>Bricky AI is an independent project and is not affiliated with Roblox Corporation.</p>
        </div>
      </div>
    </footer>
  );
}
