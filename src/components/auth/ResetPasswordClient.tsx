"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Spinner } from "@/components/icons";

const inputClass =
  "h-11 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-border)]";

export default function ResetPasswordClient({ resetKey, login }: { resetKey: string; login: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const missingParams = !resetKey || !login;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: resetKey, login, password }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (!body.ok) {
        setError(body.error ?? "We couldn't reset your password. Please request a new link.");
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  if (missingParams) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Link incomplete</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          This password reset link is incomplete or has expired. Please request a
          new one.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-strong)]"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)]">
          <Check className="h-8 w-8 text-[var(--accent)]" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Password updated
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Your password has been changed. You can now sign in with your new password.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-strong)]"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Choose a new password</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
        Pick a strong password you haven&apos;t used before.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-300"
        >
          {error}
        </div>
      )}

      <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="reset-password" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            New password
          </label>
          <div className="relative">
            <input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="reset-confirm" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Confirm password
          </label>
          <input
            id="reset-confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter your password"
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={submitting || password.length < 8 || !confirm}
          className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-sm font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_36px_var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? <Spinner className="h-4 w-4 animate-spin" /> : null}
          {submitting ? "Updating…" : "Update password"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
        <Link href="/login" className="font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}