"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { deleteAccount } from "@/lib/account";
import { PLANS } from "@/lib/plans";
import { Close, Shield, Spinner, User, Sparkles, Layers, Server, ArrowRight } from "@/components/icons";

function planLabel(planId: string | null | undefined): string {
  if (!planId) return "Free";
  const plan = PLANS.find((p) => p.id === planId);
  return plan ? plan.name : planId.charAt(0).toUpperCase() + planId.slice(1);
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function DashboardPage() {
  const { account, configured, loading: authLoading, requireAuth, signOut } = useAuth();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!deleteOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDeleteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteOpen]);

  const handleDelete = async () => {
    if (!configured || !account) return;
    setDeleting(true);
    setDeleteError(null);
    const result = await deleteAccount();
    setDeleting(false);
    if (result.ok) {
      setDeleteOpen(false);
      void signOut();
    } else {
      setDeleteError(result.error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="mx-auto max-w-2xl px-5 pt-32 pb-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-dim)]">
          <Server className="h-6 w-6 text-[var(--accent)]" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Dashboard isn&apos;t linked to an account yet
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
          This deployment hasn&apos;t connected the Bricky AI backend, so there
          is no account to manage here. On the live site the dashboard shows
          your subscription, weekly credits, and account settings.
        </p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="mx-auto max-w-2xl px-5 pt-32 pb-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-dim)]">
          <User className="h-6 w-6 text-[var(--accent)]" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Sign in to view your dashboard
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
          Your subscription, weekly credits, and account settings live here.
        </p>
        <button
          type="button"
          onClick={() => requireAuth({ type: "navigate-dashboard" })}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-black transition-all hover:bg-[var(--accent-strong)]"
        >
          Sign in
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const subscription = account.subscription ?? null;
  const plan = subscription?.plan ?? null;
  const planName = planLabel(plan);
  const status = subscription?.status?.toLowerCase();
  const statusLabel = status === "active" || status === "trialing" ? "Active" : status ? planName : null;

  return (
    <div className="mx-auto max-w-4xl px-5 pt-24 pb-24">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">Account dashboard</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {account.email ?? "Your account"}
          </h1>
        </div>
        <p className="text-xs text-[var(--text-muted)]">Member since {formatDate(account.created_at)}</p>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            Credits balance
          </div>
          <p className="mt-3 text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            {creditsLabel(account)}
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {subscription ? "Your plan credits arrive weekly." : "Free accounts start with 80 credits. Subscriptions add weekly credits."}
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
            <Layers className="h-4 w-4 text-[var(--accent)]" />
            Subscription
          </div>
          <div className="mt-3 flex items-center gap-3">
            <p className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{planName}</p>
            {statusLabel && (
              <span className="rounded-full bg-[var(--accent-dim)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                {statusLabel}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {subscription
              ? `Current period ends ${formatDate(subscription.current_period_end)}. Next weekly grant ${formatDate(subscription.next_weekly_grant_at)}.`
              : "Upgrade on the pricing page to add weekly credits."}
          </p>
          <a
            href="/pricing"
            className="mt-4 inline-flex h-10 items-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
          >
            Manage subscription
          </a>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
          <Shield className="h-4 w-4 text-[var(--accent)]" />
          Security &amp; account
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          {account.email_verified
            ? "Your email is verified. Bricky AI never sees your AI provider keys."
            : "Your email isn&apos;t verified yet — check your inbox for the verification link."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              void signOut();
            }}
            className="inline-flex h-10 items-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
          >
            Sign out
          </button>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="inline-flex h-10 items-center rounded-full border border-red-500/30 bg-red-500/10 px-5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
          >
            Delete account
          </button>
        </div>
      </section>

      {deleteOpen && (
        <ConfirmModal
          title="Delete your account?"
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          busy={deleting}
          error={deleteError}
          confirmLabel="Delete account"
          danger
        >
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            This permanently deletes your account and associated personal data
            (some records may be retained where legally required). This cannot
            be undone.
          </p>
        </ConfirmModal>
      )}
    </div>
  );
}

function creditsLabel(account: { credits: number | null | undefined }): string {
  if (account.credits === null || account.credits === undefined) return "—";
  return Intl.NumberFormat().format(Math.floor(account.credits));
}

function ConfirmModal({
  title,
  onClose,
  onConfirm,
  busy,
  error,
  confirmLabel,
  danger = false,
  children,
}: {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  busy: boolean;
  error: string | null;
  confirmLabel: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] p-7 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <Close className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
        {error && <p className="mt-3 text-sm text-[var(--text-secondary)]">{error}</p>}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className={`inline-flex h-11 flex-1 items-center justify-center rounded-full text-sm font-semibold text-black transition-colors disabled:opacity-60 ${
              danger ? "bg-red-500 hover:bg-red-600" : "bg-[var(--accent)] hover:bg-[var(--accent-strong)]"
            }`}
          >
            {busy ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}