"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Small auth-aware line for the download page hero. Renders a neutral
 * placeholder until the persisted session is restored so server and client
 * markup always match.
 */
export default function DownloadAuthStatus() {
  const { user, loading, configured } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || loading || !configured) {
    return (
      <span className="inline-flex h-4 items-center">
        <span className="h-3 w-px bg-[var(--border-strong)]" aria-hidden />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`h-1.5 w-1.5 rounded-full ${user ? "bg-[var(--success)]" : "bg-[var(--text-muted)]"}`}
      />
      {user ? (
        <>You&apos;re signed in — choose a download below.</>
      ) : (
        <>Sign in with Google or email to start your download.</>
      )}
    </span>
  );
}