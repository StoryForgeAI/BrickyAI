"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { Logo, Spinner } from "@/components/icons";

type Status = "waiting" | "ready" | "saving" | "success" | "invalid" | "error";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("waiting");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = getBrowserSupabaseClient();
    if (!supabase) {
      setStatus("invalid");
      setMessage("Authentication isn't configured for this deployment yet.");
      return;
    }

    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "INITIAL_SESSION" && session)) {
        setStatus("ready");
        setTimeout(() => passwordRef.current?.focus(), 250);
      }
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        // The user may have opened the page directly without a recovery link.
        setTimeout(() => {
          setStatus((s) => (s === "ready" ? s : "invalid"));
          setMessage((m) => m ?? "This password reset link is invalid or has expired.");
        }, 300);
      }
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      setStatus("error");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords don't match.");
      setStatus("error");
      return;
    }
    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;
    setStatus("saving");
    setMessage(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage("We couldn't update your password. Please try again.");
      setStatus("error");
      return;
    }
    await supabase.auth.signOut();
    setStatus("success");
  };

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center pt-32 pb-24 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,120,71,0.10),transparent_55%)]" />
      </div>

      <div className="w-full max-w-md px-5 sm:px-8">
        <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-2xl">
          <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-dim)] text-[var(--accent)]">
              <Logo className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[var(--text-primary)]">Bricky AI</h1>
              <p className="text-sm text-[var(--text-secondary)]">Set a new password</p>
            </div>
          </div>

          <div className="px-6 py-6">
            {status === "waiting" && (
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <Spinner className="h-4 w-4 animate-spin text-[var(--accent)]" />
                Checking your reset link…
              </div>
            )}

            {status === "success" && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-relaxed text-emerald-300">
                Your password has been updated. You can now sign in with your
                new password.
              </div>
            )}

            {status === "invalid" && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                {message}
              </div>
            )}

            {(status === "ready" || status === "error" || status === "saving") && (
              <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-[var(--text-primary)]">
                  New password
                  <input
                    ref={passwordRef}
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-border)]"
                  />
                </label>

                <label className="mt-4 block text-sm font-medium text-[var(--text-primary)]">
                  Confirm new password
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-border)]"
                  />
                </label>

                {message && status === "error" && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "saving"}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] disabled:opacity-60"
                >
                  {status === "saving" && <Spinner className="h-4 w-4 animate-spin" />}
                  {status === "saving" ? "Updating…" : "Update password"}
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-sm">
              <Link
                href="/"
                className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
              >
                Back to Bricky AI
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}