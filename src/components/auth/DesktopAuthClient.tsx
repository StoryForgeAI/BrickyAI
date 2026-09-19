"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { startGoogleFlow } from "@/lib/social-auth";
import { useAuth } from "@/context/AuthContext";
import {
  DESKTOP_AUTH_ERRORS,
  isWellFormedDesktopCode,
  type DesktopAuthErrorCode,
} from "@/lib/desktopAuth";
import { Check, GoogleG, Logo, Spinner } from "@/components/icons";

interface DesktopAuthClientProps {
  /**
   * The identifier the browser page was opened with. For the code-based flow
   * this is the app-generated code itself; for the legacy flow it is the
   * `request_id` from `/api/auth/desktop/start`.
   */
  requestId: string | null;
  /** True when `requestId` is the app-generated code (`?code=…` / `?desktop_code=…`). */
  codeFlow: boolean;
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
      return "This sign-in request is already connected to another account. Please close this window and start again from the Bricky AI desktop app.";
    case DESKTOP_AUTH_ERRORS.INVALID:
    case DESKTOP_AUTH_ERRORS.INVALID_REQUEST:
      return "This sign-in request is invalid or no longer available. Please close this window and start again from the Bricky AI desktop app.";
    default:
      return fallback;
  }
}

export default function DesktopAuthClient({ requestId, codeFlow }: DesktopAuthClientProps) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const { account, loading, configured } = useAuth();

  const [urlError, setUrlError] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [connectDone, setConnectDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const completeAttemptedRef = useRef<Set<string>>(new Set());
  const redirectTimerRef = useRef<number | null>(null);

  const missingId = !requestId;
  // A code flow with a malformed credential is invalid up front: the server
  // rejects it too, but failing fast avoids a pointless Google round-trip.
  const malformedCode =
    codeFlow && requestId ? !isWellFormedDesktopCode(requestId) : false;

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
    if (missingId || !requestId || !account?.id) return;
    const key = `${requestId}:${account.id}`;
    if (completeAttemptedRef.current.has(key)) return;
    completeAttemptedRef.current.add(key);

    let active = true;
    void (async () => {
      try {
        const res = await fetch("/api/auth/desktop/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(codeFlow ? { requestId, code: requestId } : { requestId }),
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
              body?.error ??
                "We couldn't connect your account right now. Please try again."
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
  }, [missingId, requestId, codeFlow, account?.id, router]);

  const handleGoogle = () => {
    if (!configured) return;
    setSubmitting(true);
    setUrlError(null);
    startGoogleFlow(window.location.pathname + window.location.search);
  };

  let view: "unconfigured" | "missing" | "invalid" | "preparing" | "signin" | "connecting" | "done" | "error";
  if (!configured) view = "unconfigured";
  else if (malformedCode) view = "invalid";
  else if (missingId) view = "missing";
  else if (loading) view = "preparing";
  else if (connectDone) view = "done";
  else if (connectError) view = "error";
  else if (account) view = "connecting";
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
                  Authentication isn&apos;t configured for this deployment yet.
                  The operator needs to set{" "}
                  <code className="font-mono text-xs text-[var(--accent)]">NEXT_PUBLIC_BRICKY_API_URL</code>{" "}
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

              {view === "invalid" && (
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    Sign-in link invalid
                  </h1>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {connectionErrorText(
                      DESKTOP_AUTH_ERRORS.INVALID_REQUEST,
                      "This sign-in request is invalid or no longer available. Please close this window and start again from the Bricky AI desktop app."
                    )}
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
                    Authentication is handled securely by Bricky AI. This window
                    stays open while the app connects your account — no need to
                    enter a code.
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
                  {account?.email && (
                    <p className="mt-3 text-xs text-[var(--text-muted)]">
                      Signed in as{" "}
                      <span className="font-medium text-[var(--text-secondary)]">{account.email}</span>
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