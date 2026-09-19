"use client";

import Link from "next/link";
import { useState } from "react";
import { Spinner } from "@/components/icons";

const inputClass =
  "h-11 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-border)]";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !email) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = (await res.json()) as { message?: string };
      setMessage(
        body.message ??
          "If an account exists for this email address, a password reset email has been sent."
      );
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Reset your password</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
        Enter the email address for your account and we&apos;ll send you a link to
        choose a new password.
      </p>

      {message ? (
        <div
          role="status"
          className="mt-6 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-dim)] px-4 py-3 text-sm leading-relaxed text-[var(--text-primary)]"
        >
          {message}
        </div>
      ) : (
        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={submitting || !email}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-sm font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_36px_var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? <Spinner className="h-4 w-4 animate-spin" /> : null}
            {submitting ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}