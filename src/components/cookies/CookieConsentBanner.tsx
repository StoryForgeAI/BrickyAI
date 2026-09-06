"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useCookieConsent } from "@/context/CookieConsentContext";
import { Logo } from "@/components/icons";

export default function CookieConsentBanner() {
  const reduce = useReducedMotion();
  const { bannerVisible, acceptAll, rejectNonEssential, openSettings } = useCookieConsent();

  return (
    <AnimatePresence>
      {bannerVisible && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 sm:pb-6"
          role="region"
          aria-label="Cookie preferences"
        >
          <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col gap-5 p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-dim)] text-[var(--accent)]">
                  <Logo className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-[var(--text-primary)]">
                    Your privacy matters
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                    Bricky AI uses essential session storage to keep you signed in
                    and a small preference to remember your choices. We do not use
                    analytics or advertising cookies. Learn more in our{" "}
                    <Link
                      href="/privacy"
                      className="font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)]"
                    >
                      Privacy Policy
                    </Link>{" "}
                    or open{" "}
                    <button
                      type="button"
                      onClick={openSettings}
                      className="font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)]"
                    >
                      Cookie Settings
                    </button>
                    .
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_24px_var(--accent-glow)] sm:flex-none"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={rejectNonEssential}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-6 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-border)] hover:text-[var(--accent)] sm:flex-none"
                >
                  Reject Non-Essential
                </button>
                <button
                  type="button"
                  onClick={openSettings}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] px-6 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] sm:flex-none"
                >
                  Cookie Settings
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}