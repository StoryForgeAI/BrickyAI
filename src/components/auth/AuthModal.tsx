"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { AuthError } from "@supabase/supabase-js";
import { getBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { authRedirectTo } from "@/lib/oauth";
import { useCookieConsent } from "@/context/CookieConsentContext";
import { Close, GoogleG, Logo, Spinner } from "@/components/icons";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  error: string | null;
  onClearError: () => void;
}

/** Returns a safe, human-readable message for any Supabase auth error. */
function friendlyAuthError(err: AuthError | null): string {
  if (!err) return "Something went wrong. Please try again.";
  const code = err.code ?? err.message;

  if (/rate_limit|over_email_send_rate_limit/i.test(code))
    return "Too many requests. Please wait a moment and try again.";
  if (/provider_is_not_enabled|provider_disabled|disabled/i.test(code))
    return "Google sign-in isn't enabled for this project yet. It can be enabled by the operator in Supabase.";
  if (/network|fetch|failed to fetch|timeout|unable to connect/i.test(code))
    return "Network error. Check your connection and try again.";
  if (/unsupported_provider/i.test(code))
    return "This sign-in provider isn't supported yet.";
  if (/access_denied|cancelled|canceled/i.test(code))
    return "Google sign-in was cancelled. You can retry whenever you're ready.";
  if (/session_expired/i.test(code))
    return "Your session has expired. Please sign in again.";
  return "Something went wrong. Please try again.";
}

export default function AuthModal({ open, onClose, error, onClearError }: AuthModalProps) {
  const reduce = useReducedMotion();
  const configured = isSupabaseConfigured;
  const { openSettings } = useCookieConsent();

  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const googleButtonRef = useRef<HTMLButtonElement>(null);

  const [prevOpen, setPrevOpen] = useState(open);

  // Reset transient messages whenever the modal is (re)opened.
  // Rendered-state adjustment, not an effect — see React docs.
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setLocalError(null);
      onClearError();
    }
  }

  const err = localError ?? error;

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => googleButtonRef.current?.focus(), 250);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleGoogle = async () => {
    if (!configured) return;
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    setSubmitting(true);
    setLocalError(null);
    try {
      // Dynamic redirect target: NEXT_PUBLIC_SITE_URL in production, the
      // current page origin otherwise (keeps localhost + previews working).
      // Never a hardcoded localhost URL.
      const redirectTo = authRedirectTo(window.location.pathname);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) {
        setLocalError(friendlyAuthError(error));
        setSubmitting(false);
        return;
      }
      if (data.url) {
        // Full-page OAuth redirect. The pending action survives in sessionStorage
        // and runs when the user returns (see AuthContext).
        window.location.href = data.url;
      } else {
        setLocalError("Google sign-in didn't return a valid redirect. Please try again.");
        setSubmitting(false);
      }
    } catch {
      setLocalError("Network error while connecting to Google. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Log in"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-dim)] text-[var(--accent)]">
                  <Logo className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">Bricky AI</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Welcome back</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-6">
              {!configured ? (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Authentication isn&apos;t configured for this deployment yet.
                  The operator needs to set up Supabase and add{" "}
                  <code className="font-mono text-xs text-[var(--accent)]">
                    NEXT_PUBLIC_SUPABASE_URL
                  </code>{" "}
                  and{" "}
                  <code className="font-mono text-xs text-[var(--accent)]">
                    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
                  </code>{" "}
                  before login can be enabled.
                </div>
              ) : (
                <>
                  {/* Google */}
                  <button
                    ref={googleButtonRef}
                    type="button"
                    onClick={handleGoogle}
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-[var(--text-primary)] px-5 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <Spinner className="h-4 w-4 animate-spin" />
                    ) : (
                      <GoogleG className="h-4.5 w-4.5" />
                    )}
                    {submitting ? "Redirecting to Google…" : "Continue with Google"}
                  </button>

                  <div className="my-5 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span className="h-px flex-1 bg-[var(--border)]" />
                    Sign in with your Google account
                    <span className="h-px flex-1 bg-[var(--border)]" />
                  </div>

                  <p className="text-center text-xs leading-relaxed text-[var(--text-muted)]">
                    If you already have a Bricky AI account linked to your Google,
                    you&apos;ll be signed back into it automatically.
                  </p>

                  {(err) && (
                    <div
                      role="alert"
                      className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-300"
                    >
                      {err}
                    </div>
                  )}

                  {/* Legal consent */}
                  <p className="mt-5 text-center text-xs leading-relaxed text-[var(--text-muted)]">
                    By continuing with Google, you agree to Bricky AI&apos;s{" "}
                    <Link href="/terms" className="font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]">
                      Privacy Policy
                    </Link>
                    , and acknowledge that we use essential session storage and a
                    consent preference. Manage your choice in{" "}
                    <button type="button" onClick={openSettings} className="font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]">
                      Cookie Settings
                    </button>
                    .
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}