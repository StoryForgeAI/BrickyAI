"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { AuthError } from "@supabase/supabase-js";
import { getBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Close, GoogleG, Logo, Spinner } from "@/components/icons";

type View = "login" | "signup" | "forgot";

interface AuthModalProps {
  open: boolean;
  mode: View;
  onClose: () => void;
  onChangeView: (view: View) => void;
  onAuthenticated: () => void;
  error: string | null;
  onClearError: () => void;
}

/** Returns a safe, human-readable message for any Supabase auth error. */
function friendlyAuthError(err: AuthError | null): string {
  if (!err) return "Something went wrong. Please try again.";
  const code = err.code ?? err.message;

  if (/invalid_credentials/i.test(code)) return "Incorrect email or password.";
  if (/email_not_confirmed|unverified/i.test(code))
    return "Your email hasn't been confirmed yet. Check your inbox for a confirmation link.";
  if (/user_already_exists|already registered/i.test(code))
    return "An account with this email already exists. Try logging in instead.";
  if (/rate_limit|over_email_send_rate_limit/i.test(code))
    return "Too many requests. Please wait a moment and try again.";
  if (/weak_password/i.test(code)) return "That password is too weak. Use at least 8 characters.";
  if (/provider_is_not_enabled|provider_disabled|disabled/i.test(code))
    return "Google sign-in isn't enabled for this project yet. It can be enabled by the operator in Supabase.";
  if (/network|fetch|failed to fetch|timeout|unable to connect/i.test(code))
    return "Network error. Check your connection and try again.";
  if (/unsupported_provider/i.test(code))
    return "This sign-in provider isn't supported yet.";
  if (/session_expired/i.test(code))
    return "Your session has expired. Please sign in again.";
  return "Something went wrong. Please try again.";
}

export default function AuthModal({ open, mode, onClose, onChangeView, onAuthenticated, error, onClearError }: AuthModalProps) {
  const reduce = useReducedMotion();
  const configured = isSupabaseConfigured;

  const [view, setView] = useState<View>(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const [prevMode, setPrevMode] = useState<View>(mode);
  const [prevOpen, setPrevOpen] = useState(open);

  // Keep internal view + transient messages in sync with the parent-provided
  // mode/open (rendered-state adjustment, not an effect — see React docs).
  if (prevMode !== mode && (mode === "login" || mode === "signup" || mode === "forgot")) {
    setPrevMode(mode);
    setView(mode);
  }
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setLocalError(null);
      setSuccess(null);
    }
  }

  const err = localError ?? error;

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => emailInputRef.current?.focus(), 250);
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

  const switchView = (v: View) => {
    setView(v);
    setLocalError(null);
    setSuccess(null);
    onChangeView(v);
    onClearError();
  };

  const handleGoogle = async () => {
    if (!configured) return;
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    setSubmitting(true);
    setLocalError(null);
    setSuccess(null);
    try {
      const redirectTo = `${window.location.origin}${window.location.pathname}`;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!configured) return;
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    setSubmitting(true);
    setLocalError(null);
    setSuccess(null);
    try {
      if (view === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) {
          setLocalError(friendlyAuthError(error));
        } else {
          onAuthenticated();
        }
      } else if (view === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) {
          setLocalError(friendlyAuthError(error));
        } else if (data.session) {
          // Email confirmation is disabled for this project — signed in directly.
          onAuthenticated();
        } else {
          setSuccess(
            "Check your inbox to confirm your email. We'll continue as soon as your account is verified."
          );
        }
      } else if (view === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/update-password`,
        });
        if (error) {
          // Do not reveal whether an account exists; show a generic confirmation.
          setLocalError(friendlyAuthError(error));
        } else {
          setSuccess(
            "If an account exists for that email, we've sent a password reset link."
          );
        }
      }
    } catch {
      setLocalError("Network error. Please check your connection and try again.");
    } finally {
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
          aria-label={view === "login" ? "Log in" : view === "signup" ? "Create account" : "Reset password"}
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
                  <p className="text-sm text-[var(--text-secondary)]">
                    {view === "login"
                      ? "Welcome back"
                      : view === "signup"
                        ? "Create your account"
                        : "Reset your password"}
                  </p>
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

            <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
              {!configured ? (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Authentication isn&apos;t configured for this deployment yet.
                  The operator needs to set up Supabase and add the public
                  environment variables before accounts can be created.
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="grid grid-cols-2 gap-1 rounded-xl bg-[var(--surface)] p-1">
                    {(
                      [
                        ["login", "Log in"],
                        ["signup", "Sign up"],
                      ] as const
                    ).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => switchView(key)}
                        aria-pressed={view === key}
                        className={`rounded-lg py-2 text-sm font-medium transition-colors ${
                          view === key
                            ? "bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-sm"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {view !== "forgot" && (
                    <>
                      {/* Google */}
                      <button
                        type="button"
                        onClick={handleGoogle}
                        disabled={submitting}
                        className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-[var(--text-primary)] px-5 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
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
                        or continue with email
                        <span className="h-px flex-1 bg-[var(--border)]" />
                      </div>
                    </>
                  )}

                  {/* Email form */}
                  <form onSubmit={handleSubmit} className={view === "forgot" ? "mt-2" : ""}>
                    <label className="block text-sm font-medium text-[var(--text-primary)]">
                      Email
                      <input
                        ref={emailInputRef}
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-border)]"
                      />
                    </label>

                    {view !== "forgot" && (
                      <label className="mt-4 block text-sm font-medium text-[var(--text-primary)]">
                        Password
                        <input
                          type="password"
                          required
                          minLength={8}
                          autoComplete={view === "signup" ? "new-password" : "current-password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-border)]"
                        />
                      </label>
                    )}

                    {view === "login" && (
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => switchView("forgot")}
                          className="text-xs font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {(err || success) && (
                      <div
                        role="alert"
                        className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-relaxed ${
                          err
                            ? "border-red-500/30 bg-red-500/10 text-red-300"
                            : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        }`}
                      >
                        {err ?? success}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_28px_var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting && <Spinner className="h-4 w-4 animate-spin" />}
                      {submitting
                        ? "Please wait…"
                        : view === "login"
                          ? "Log in"
                          : view === "signup"
                            ? "Create account"
                            : "Send reset link"}
                    </button>
                  </form>

                  {/* Legal consent */}
                  <p className="mt-5 text-center text-xs leading-relaxed text-[var(--text-muted)]">
                    By continuing with Google or email, you agree to Bricky AI&apos;s{" "}
                    <Link href="/terms" className="font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]">
                      Privacy Policy
                    </Link>
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