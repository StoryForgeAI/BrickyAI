"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { startGoogleFlow } from "@/lib/social-auth";
import { useAuth } from "@/context/AuthContext";
import { Facebook, GoogleG, Spinner } from "@/components/icons";

const inputClass =
  "h-11 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-border)]";

export default function LoginClient({ redirect }: { redirect: string }) {
  const router = useRouter();
  const { loading, account, refreshAccount, runStoredPendingAction } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const redirectedRef = useRef(false);

  // Already signed in (fresh visit to /login while a session exists): carry on.
  useEffect(() => {
    if (loading || !account || redirectedRef.current) return;
    redirectedRef.current = true;
    runStoredPendingAction();
    router.replace(redirect || "/dashboard");
  }, [loading, account, redirect, router, runStoredPendingAction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string; needsVerification?: boolean };
      if (!body.ok) {
        setError(body.error ?? "We couldn't sign you in. Please try again.");
        setSubmitting(false);
        return;
      }
      await refreshAccount();
      runStoredPendingAction();
      router.replace(redirect || "/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const handleGoogle = () => {
    startGoogleFlow(redirect && redirect !== "/dashboard" ? redirect : "/dashboard");
  };

  const handleFacebook = () => {
    setNotice("Facebook sign-in isn't available just yet — please use Google or email. We'll let you know when it launches.");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Welcome back</h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
        Sign in to continue to Bricky AI.
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
          <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Email
          </label>
          <input
            id="login-email"
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
          <label htmlFor="login-password" className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
          <div className="mt-2 flex items-center justify-between text-xs">
            <Link href="/forgot-password" className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]">
              Forgot password?
            </Link>
            <span className="text-[var(--text-muted)]">
              New here?{" "}
              <Link href="/register" className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]">
                Create an account
              </Link>
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !email || !password}
          className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-sm font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_36px_var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? <Spinner className="h-4 w-4 animate-spin" /> : null}
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs leading-relaxed text-[var(--text-muted)]">
        By signing in you agree to the{" "}
        <Link href="/terms" className="font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]">
          Privacy Policy
        </Link>.
      </p>
    </div>
  );
}