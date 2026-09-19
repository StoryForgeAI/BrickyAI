"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { googleReturnPath, GOOGLE_RETURN_KEY } from "@/lib/social-auth";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/icons";

type Status = "working" | "done" | "error";

export default function GoogleCallbackClient({ fallbackRedirect }: { fallbackRedirect: string }) {
  const router = useRouter();
  const { refreshAccount, runStoredPendingAction } = useAuth();
  const [status, setStatus] = useState<Status>("working");
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    let active = true;

    const finish = () => {
      const returnTo = googleReturnPath() ?? fallbackRedirect;
      try {
        sessionStorage.removeItem(GOOGLE_RETURN_KEY);
      } catch {
        /* ignore */
      }
      // Run any deferred action first; then move on (harmless if it also navigated).
      runStoredPendingAction();
      router.replace(returnTo);
    };

    void (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code") ?? "";
      const oauthError = params.get("error");

      if (oauthError) {
        if (!active) return;
        setStatus("error");
        setError("Google sign-in was cancelled or could not be completed. Please try again.");
        return;
      }
      if (!code) {
        if (!active) return;
        setStatus("error");
        setError("This sign-in link is incomplete. Please try again.");
        return;
      }

      try {
        const res = await fetch("/api/auth/google/exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const body = (await res.json()) as { ok?: boolean; error?: string };
        if (!active) return;
        if (!body.ok) {
          setStatus("error");
          setError(body.error ?? "We couldn't complete Google sign-in. Please try again.");
          return;
        }
        await refreshAccount();
        if (!active) return;
        setStatus("done");
        finish();
      } catch {
        if (active) {
          setStatus("error");
          setError("Network error. Please try again.");
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [fallbackRedirect, refreshAccount, runStoredPendingAction, router]);

  return (
    <div className="text-center">
      {status === "working" && (
        <>
          <Spinner className="mx-auto h-8 w-8 animate-spin text-[var(--accent)]" />
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Signing you in…
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Finishing up with Google.
          </p>
        </>
      )}
      {status === "done" && (
        <>
          <Spinner className="mx-auto h-8 w-8 animate-spin text-[var(--accent)]" />
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            You&apos;re signed in
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Taking you to Bricky AI…</p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Sign-in failed
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{error}</p>
          <Link
            href="/login"
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-strong)]"
          >
            Back to sign in
          </Link>
        </>
      )}
    </div>
  );
}