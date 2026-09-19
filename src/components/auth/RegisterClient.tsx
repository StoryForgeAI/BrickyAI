"use client";

import Link from "next/link";
import { useState } from "react";
import { startGoogleFlow } from "@/lib/social-auth";
import { Facebook, GoogleG, Spinner } from "@/components/icons";

const inputClass =
  "h-11 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-border)]";

export default function RegisterClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string; message?: string };
      if (!body.ok) {
        setError(body.error ?? "We couldn't create your account. Please try again.");
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const handleGoogle = () => {
    startGoogleFlow("/dashboard");
  };

  const handleFacebook = () => {
    setNotice("Facebook sign-up isn't available just yet — please use Google or email. We'll let you know when it launches.");
  };

  if (done) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Check your email</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          We&apos;ve sent a verification link to{" "}
          <span className="font-medium text-[var(--text-primary)]">{email}</span>. Open it to
          verify your account, then sign in.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-strong)]"
        >
          Go to sign in
        </Link>
        <p className="mt-4 text-xs text-[var(--text-muted)]">
          Didn&apos;t get it?{" "}
          <Link href={`/verify-email?email=${encodeURIComponent(email)}`} className="font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]">
            Resend the verification email
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Create your account</h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
        Get started with Bricky AI in a minute.
      </p>

      <button
        type="button"
        onClick={handleGoogle}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[var(--text-primary)] px-5 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-white"
      >
        <GoogleG className="h-4.5 w-4.5" />
        Continue with Google
      </button>

      <button
        type="button"
        onClick={handleFacebook}
        className="mt-3 flex w-full items-center justify-center gap-3 rounded-full border border-[var(--border-strong)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent-border)]"
      >
        <Facebook className="h-4.5 w-4.5" />
        Continue with Facebook
      </button>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-[var(--border-subtle)]" />
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">or</span>
        <span className="h-px flex-1 bg-[var(--border-subtle)]" />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-300"
        >
          {error}
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent-dim)] px-4 py-3 text-sm leading-relaxed text-[var(--text-primary)]"
        >
          {notice}
        </div>
      )}

      <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="register-name" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Name <span className="text-[var(--text-muted)]">(optional)</span>
          </label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="register-email" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="register-password" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
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

        <button
          type="submit"
          disabled={submitting || !email || password.length < 8}
          className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-sm font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_36px_var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? <Spinner className="h-4 w-4 animate-spin" /> : null}
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]">
          Sign in
        </Link>
      </p>
    </div>
  );
}