"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Spinner } from "@/components/icons";

const inputClass =
  "h-11 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-border)]";

type Status = "verifying" | "verified" | "error";

export default function VerifyEmailClient({
  token,
  initialEmail,
}: {
  token: string | null;
  initialEmail: string;
}) {
  const [status, setStatus] = useState<Status>(token ? "verifying" : "error");
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState(initialEmail);
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!token || startedRef.current) return;
    startedRef.current = true;
    let active = true;
    void (async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        const body = (await res.json()) as { ok?: boolean; error?: string; message?: string };
        if (!active) return;
        if (body.ok) {
          setStatus("verified");
          setMessage(body.message ?? "Your email has been verified.");
        } else {
          setStatus("error");
          setMessage(body.error ?? "This verification link is invalid or has expired.");
        }
      } catch {
        if (active) {
          setStatus("error");
          setMessage("Network error. Please try again.");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);

  const handleResend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (resending || !email) return;
      setResending(true);
      setResendNotice(null);
      try {
        const res = await fetch("/api/auth/resend-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const body = (await res.json()) as { ok?: boolean; message?: string };
        setResendNotice(
          body.message ??
            "If an unverified account exists for this email, a verification email will be sent."
        );
      } catch {
        setResendNotice("Network error. Please try again.");
      } finally {
        setResending(false);
      }
    },
    [email, resending]
  );

  if (token) {
    return (
      <div className="text-center">
        {status === "verifying" && (
          <>
            <Spinner className="mx-auto h-8 w-8 animate-spin text-[var(--accent)]" />
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Verifying your email…
            </h1>
          </>
        )}
        {status === "verified" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)]">
              <Check className="h-8 w-8 text-[var(--accent)]" />
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Email verified
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{message}</p>
            <Link
              href="/login"
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-strong)]"
            >
              Sign in
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Verification failed
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {message ?? "This verification link is invalid or has expired."}
            </p>
            <p className="mt-4 text-xs text-[var(--text-muted)]">
              Enter your email below to request a new link.
            </p>
          </>
        )}
        {status === "error" && <ResendForm email={email} setEmail={setEmail} onResend={handleResend} resending={resending} notice={resendNotice} />}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Verify your email</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
        Enter your email address and we&apos;ll send a new verification link.
      </p>
      <ResendForm email={email} setEmail={setEmail} onResend={handleResend} resending={resending} notice={resendNotice} align="left" />
      <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
        Already verified?{" "}
        <Link href="/login" className="font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function ResendForm({
  email,
  setEmail,
  onResend,
  resending,
  notice,
  align = "center",
}: {
  email: string;
  setEmail: (v: string) => void;
  onResend: (e: React.FormEvent) => void;
  resending: boolean;
  notice: string | null;
  align?: "center" | "left";
}) {
  return (
    <form className="mt-5 space-y-3 text-left" onSubmit={onResend}>
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
        disabled={resending || !email}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] text-sm font-semibold text-[var(--text-primary)] transition-all hover:border-[var(--accent-border)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {resending ? <Spinner className="h-4 w-4 animate-spin" /> : null}
        {resending ? "Sending…" : "Resend verification email"}
      </button>
      {notice && (
        <p className={`text-xs leading-relaxed text-[var(--text-secondary)] ${align === "center" ? "text-center" : ""}`}>
          {notice}
        </p>
      )}
    </form>
  );
}