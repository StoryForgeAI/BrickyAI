"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { AuthError } from "@supabase/supabase-js";
import { getBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { authRedirectTo } from "@/lib/oauth";
import { useAuth } from "@/context/AuthContext";
import {
  DESKTOP_AUTH_ERRORS,
  type DesktopAuthErrorCode,
} from "@/lib/desktopAuth";
import { Check, GoogleG, Logo, Spinner } from "@/components/icons";

interface DesktopAuthClientProps {
  requestId: string | null;
}

/** Safe, human-readable error for the Google OAuth step (never raw errors). */
function friendlyOAuthError(err: AuthError | null): string {
  if (!err) return "Something went wrong. Please try again.";
  const code = err.code ?? err.message;
  if (/rate_limit|over_email_send_rate_limit/i.test(code))
    return "Too many requests. Please wait a moment and try again.";
  if (/provider_is_not_enabled|provider_disabled|disabled/i.test(code))
    return "Google sign-in isn't enabled for this project yet. It can be enabled by the operator in Supabase.";
  if (/network|fetch|failed to fetch|timeout|unable to connect/i.test(code))
    return "Network error. Check your connection and try again.";
  if (/access_denied|cancelled|canceled/i.test(code))
    return "Google sign-in was cancelled. You can retry whenever you're ready.";
  return "Something went wrong. Please try again.";
}

function connectionErrorText(
  code: DesktopAuthErrorCode | undefined,
  fallback: string
): string {
  switch (code) {
    case DESKTOP_AUTH_ERRORS.EXPIRED:
      return "This sign-in request has expired. Please close this window and start again from the Bricky AI desktop app.";
    case DESKTOP_AUTH_ERRORS.ALREADY_USED:
      return "This sign-in request has already been used. Please close this window and start again from the Bricky AI desktop app.";
    case DESKTOP_AUTH_ERRORS.ALREADY_BOUND:
      return "This sign-in request is already connected to another Google account. Please close this window and start again from the Bricky AI desktop app.";
    case DESKTOP_AUTH_ERRORS.INVALID:
    case DESKTOP_AUTH_ERRORS.INVALID_REQUEST:
      return "This sign-in request is invalid or no longer available. Please close this window and start again from the Bricky AI desktop app.";
    default:
      return fallback;
  }
}

export default function DesktopAuthClient({ requestId }: DesktopAuthClientProps) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [urlError, setUrlError] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [connectDone, setConnectDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const completeAttemptedRef = useRef<Set<string>>(new Set());
  const redirectTimerRef = useRef<number | null>(null);

  const configured = isSupabaseConfigured;
  const supabase = isSupabaseConfigured ? getBrowserSupabaseClient() : null;
  const missingId = !requestId;

  // Detect a failed Google round-trip (`?error=...` set by Supabase) and show a
  // friendly inline message instead of a raw error. The global auth modal does
  // not open on this page (see AuthContext), so we surface it here. The error
  // message is deferred out of the render so the toggling happens off-render.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (!params.get("error")) return;
    const message =
      params.get("error") === "access_denied"
        ? "Google sign-in was cancelled. You can retry whenever you're ready."
        : "Google sign-in could not be completed. Please try again.";
    const t = window.setTimeout(() => setUrlError(message), 0);
    params.delete("error");
    const qs = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
    return () => window.clearTimeout(t);
  }, [requestId]);

  // Clear the redirect timer if the page unmounts before it fires.
  useEffect(() => {
    return () => {
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  // Once signed in, bind the desktop handshake to this user (server-side) and
  // then return to the normal Bricky AI home page.
  useEffect(() => {
    if (!supabase || missingId || !requestId || !user?.id) return;
    const key = `${requestId}:${user.id}`;
    if (completeAttemptedRef.current.has(key)) return;
    completeAttemptedRef.current.add(key);

    let active = true;
    void (async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!active) return;
      if (!token) {
        setConnectError("Your session could not be verified. Please refresh this page and try again.");
        return;
      }
      try {
        const res = await fetch("/api/auth/desktop/complete", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId }),
        });
        const body = (await res.json().catch(() => null)) as {
          ok?: boolean;
          error?: string;
          code?: DesktopAuthErrorCode;
        } | null;
        if (!active) return;
        if (res.ok) {
          setConnectDone(true);
          redirectTimerRef.current = window.setTimeout(() => router.replace("/"), 1600);
        } else {
          setConnectError(
            connectionErrorText(
              body?.code,
              body?.error ?? "We couldn't connect your account right now. Please try again."
            )
          );
        }
      } catch {
        if (active) {
          setConnectError("Network error. Check your connection and try again.");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [supabase, missingId, requestId, user?.id, router]);

  const handleGoogle = async () => {
    if (!supabase) return;
    setSubmitting(true);
    setUrlError(null);
    try {
      const target = `/auth/desktop${requestId ? `?request_id=${encodeURIComponent(requestId)}` : ""}`;
      const redirectTo = authRedirectTo(target);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        // `select_account` lets the user pick the Google account to link even
        // when the browser already has a signed-in Google session.
        options: { redirectTo, queryParams: { prompt: "select_account" } },
      });
      if (error) {
        setUrlError(friendlyOAuthError(error));
        setSubmitting(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setUrlError("Google sign-in didn't return a valid redirect. Please try again.");
        setSubmitting(false);
      }
    } catch {
      setUrlError("Network error while connecting to Google. Please try again.");
      setSubmitting(false);
    }
  };

  let view: "unconfigured" | "missing" | "preparing" | "signin" | "connecting" | "done" | "error";
  if (!configured) view = "unconfigured";
  else if (missingId) view = "missing";
  else if (loading) view = "preparing";
  else if (connectDone) view = "done";
  else if (connectError) view = "error";
  else if (user) view = "connecting";
  else view = "signin";

  const motionProps = reduce
    ? ({ initial: false } as const)
    : ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } } as const);

  return (
    <section className="relative flex min-h-[calc(100vh-18rem)] items-center justify-center overflow-hidden px-5 pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,120,71,0.12),transparent_55%)]" />
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      </div>

      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-2xl">
        <div className="flex items-center justify-center gap-3 border-b border-[var(--border-subtle)] px-6 py-5">
          <Logo className="h-9 w-9" />
          <div>
            <p className="text-lg font-semibold leading-tight text-[var(--text-primary)]">
              Bricky AI
            </p>
            <p className="text-xs font-medium text-[var(--accent)]">
              Desktop app sign-in
            </p>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-8">
          <AnimatePresence mode="wait">
            <motion.div key={view} {...motionProps} transition={{ duration: 0.2 }}>
              {view === "unconfigured" && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Authentication isn&apos;t configured for this deployment yet. The
                  operator needs to set up Supabase ({" "}
                  <code className="font-mono text-xs text-[var(--accent)]">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
                  and{" "}
                  <code className="font-mono text-xs text-[var(--accent)]">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>)
                  before desktop sign-in can be enabled.
                </div>
              )}

              {view === "missing" && (
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    Sign-in link incomplete
                  </h1>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    This sign-in link is missing its request. Launch the Bricky
                    AI desktop app and choose &quot;Continue with Google&quot; there.
                  </p>
                  <Link
                    href="/"
                    className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-strong)]"
                  >
                    Return to Bricky AI
                  </Link>
                </div>
              )}

              {view === "preparing" && (
                <div className="flex flex-col items-center text-center">
                  <Spinner className="h-7 w-7 animate-spin text-[var(--accent)]" />
                  <p className="mt-4 text-sm text-[var(--text-secondary)]">
                    Preparing secure sign-in…
                  </p>
                </div>
              )}

              {view === "signin" && (
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    Sign in to Bricky AI
                  </h1>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                    Sign in securely to continue to the{" "}
                    <span className="font-medium text-[var(--text-primary)]">Bricky AI desktop app</span>.
                  </p>

                  {urlError && (
                    <div
                      role="alert"
                      className="mt-5 w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-300"
                    >
                      {urlError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={submitting}
                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[var(--text-primary)] px-5 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <Spinner className="h-4.5 w-4.5 animate-spin" />
                    ) : (
                      <GoogleG className="h-4.5 w-4.5" />
                    )}
                    {submitting ? "Redirecting to Google…" : "Continue with Google"}
                  </button>

                  <p className="mt-6 text-xs leading-relaxed text-[var(--text-muted)]">
                    Authentication is handled securely by Bricky AI and
                    Supabase. This window stays open while the app connects your
                    account — no need to enter a code.
                  </p>

                  <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs">
                    <Link
                      href="/terms"
                      className="font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]"
                    >
                      Terms of Service
                    </Link>
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--border-strong)]" />
                    <Link
                      href="/privacy"
                      className="font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]"
                    >
                      Privacy Policy
                    </Link>
                  </div>
                </div>
              )}

              {view === "connecting" && (
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-dim)]">
                    <Spinner className="h-8 w-8 animate-spin text-[var(--accent)]" />
                  </div>
                  <h1 className="mt-6 text-xl font-bold tracking-tight text-[var(--text-primary)]">
                    You&apos;re signed in!
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    Connecting your account to the Bricky AI desktop app…
                  </p>
                  {user?.email && (
                    <p className="mt-3 text-xs text-[var(--text-muted)]">
                      Signed in as{" "}
                      <span className="font-medium text-[var(--text-secondary)]">{user.email}</span>
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleGoogle}
                    className="mt-7 text-xs font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
                  >
                    Use a different Google account
                  </button>
                </div>
              )}

              {view === "done" && (
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)]">
                    <Check className="h-8 w-8 text-[var(--accent)]" />
                  </div>
                  <h1 className="mt-6 text-xl font-bold tracking-tight text-[var(--text-primary)]">
                    You&apos;re signed in!
                  </h1>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Returning to Bricky AI…
                  </p>
                  <p className="mt-4 max-w-xs text-xs leading-relaxed text-[var(--text-muted)]">
                    You can close this window once the desktop app confirms the
                    connection.
                  </p>
                </div>
              )}

              {view === "error" && (
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                    We couldn&apos;t connect your account
                  </h1>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {connectError}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-strong)]"
                    >
                      Try again
                    </button>
                    <Link
                      href="/"
                      className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--border-strong)] px-6 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-border)]"
                    >
                      Return to Bricky AI
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}