"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useCookieConsent } from "@/context/CookieConsentContext";
import { Close, Check, Shield } from "@/components/icons";

function Toggle({
  checked,
  disabled,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onCheckedChange?: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
        checked ? "bg-[var(--accent)]" : "bg-[var(--border-strong)]"
      } ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-[var(--text-primary)] shadow transition-transform duration-200 ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function CookieSettingsModal() {
  const reduce = useReducedMotion();
  const {
    settingsVisible,
    closeSettings,
    preferences,
    acceptAll,
    rejectNonEssential,
    savePreferences,
  } = useCookieConsent();
  const [prefs, setPrefs] = useState(preferences);
  const [wasOpen, setWasOpen] = useState(settingsVisible);

  // Reset the unsaved toggle to the committed value each time the modal opens
  // (render-phase state adjustment — avoids a sync-in-effect and keeps the
  // toggle's pending value from leaking between sessions).
  if (settingsVisible && !wasOpen) {
    setWasOpen(true);
    setPrefs(preferences);
  } else if (!settingsVisible && wasOpen) {
    setWasOpen(false);
  }

  useEffect(() => {
    if (!settingsVisible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSettings();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [settingsVisible, closeSettings]);

  return (
    <AnimatePresence>
      {settingsVisible && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Cookie settings"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSettings}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-6">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Cookie Settings
                </h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Choose which categories of storage we may use. You can change
                  this at any time from the footer.
                </p>
              </div>
              <button
                type="button"
                onClick={closeSettings}
                aria-label="Close cookie settings"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                <Close className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-6">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-[var(--text-secondary)]" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        Necessary
                      </p>
                      <p className="text-xs text-[var(--accent)]">Always active</p>
                    </div>
                  </div>
                  <Toggle checked disabled label="Necessary cookies" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Required for the site to work: keeping you signed in, remembering
                  your consent choice, and protecting the service. These cannot be
                  turned off.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      Preferences
                    </p>
                  </div>
                  <Toggle
                    checked={prefs}
                    label="Preference cookies"
                    onCheckedChange={setPrefs}
                  />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Lets us remember choices you make so you don&apos;t have to set
                  them again. Off by default.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-dim)] p-4">
                <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-black">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  We do not use analytics, tracking, or advertising cookies on
                  this site.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-[var(--border)] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={rejectNonEssential}
                  className="inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  Reject all
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  Accept all
                </button>
              </div>
              <button
                type="button"
                onClick={() => savePreferences(prefs)}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_24px_var(--accent-glow)]"
              >
                Save preferences
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}