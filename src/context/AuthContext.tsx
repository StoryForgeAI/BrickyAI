"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isBrickyApiConfigured } from "@/lib/config";
import { WINDOWS_DOWNLOAD_URL, PLUGIN_DOWNLOAD_URL } from "@/lib/config";
import type { BrickyAccount } from "@/lib/bricky-api";

/**
 * A deferred action that runs after a successful sign-in. Only JSON-serializable
 * actions are supported because Google authentication requires a full-page
 * redirect (the action survives in sessionStorage).
 */
export type AuthPendingAction =
  | { type: "navigate-download" }
  | { type: "download-windows" }
  | { type: "download-plugin" }
  | { type: "navigate-pricing" }
  | { type: "navigate-dashboard" };

const PENDING_STORAGE_KEY = "bricky-auth-pending";

interface AuthContextValue {
  /** Whether a Bricky AI backend URL is configured for this deployment. */
  configured: boolean;
  /** True while the persisted session is being restored after load. */
  loading: boolean;
  /** The signed-in account (read-only; credits/subscription are server-managed). */
  account: BrickyAccount | null;
  signOut: () => Promise<void>;
  /** Force-refresh the account snapshot from `/api/account`. */
  refreshAccount: () => Promise<void>;
  /**
   * Ensure the user is signed in before an action. If signed in, runs the
   * action immediately; otherwise stores it as pending and redirects to
   * /login so it can run right after authentication.
   */
  requireAuth: (action: AuthPendingAction) => void;
  /** Run a pending action stored before a sign-in redirect (used by /login). Returns true when one ran. */
  runStoredPendingAction: () => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredPending(): AuthPendingAction | null {
  try {
    const raw = sessionStorage.getItem(PENDING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthPendingAction;
    if (parsed && typeof parsed.type === "string") return parsed;
  } catch {
    /* ignore malformed storage */
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // When the backend isn't configured there is nothing to restore, so loading
  // is false from the start.
  const [loading, setLoading] = useState(() => !isBrickyApiConfigured);
  const [account, setAccount] = useState<BrickyAccount | null>(null);
  const pendingRef = useRef<AuthPendingAction | null>(null);
  // Accounts for which the one-time starter-credit claim was already attempted
  // this page lifetime. Keys off the account id so a fresh sign-in retries.
  const starterClaimedRef = useRef<Set<number>>(new Set());
  // Bumped after a successful claim so the account snapshot is re-fetched.
  const [accountVersion, setAccountVersion] = useState(0);

  const getPending = useCallback((): AuthPendingAction | null => {
    return pendingRef.current ?? readStoredPending();
  }, []);

  const storePending = useCallback((action: AuthPendingAction | null) => {
    pendingRef.current = action;
    try {
      if (action) sessionStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(action));
      else sessionStorage.removeItem(PENDING_STORAGE_KEY);
    } catch {
      /* storage unavailable (private mode etc.) — in-memory ref still works */
    }
  }, []);

  const runAction = useCallback(
    (action: AuthPendingAction | null) => {
      if (!action) return;
      const startDownload = (url: string) => {
        if (!url || url === "#") return;
        const a = document.createElement("a");
        a.href = url;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
      if (action.type === "download-windows") startDownload(WINDOWS_DOWNLOAD_URL);
      else if (action.type === "download-plugin") startDownload(PLUGIN_DOWNLOAD_URL);
      else if (
        action.type === "navigate-download" ||
        action.type === "navigate-pricing" ||
        action.type === "navigate-dashboard"
      ) {
        const href =
          action.type === "navigate-download"
            ? "/download"
            : action.type === "navigate-pricing"
              ? "/pricing"
              : "/dashboard";
        router.push(href);
      }
      storePending(null);
    },
    [router, storePending]
  );

  // Restore the session cookie against the backend on load.
  useEffect(() => {
    if (!isBrickyApiConfigured) return;
    let active = true;
    void (async () => {
      try {
        const res = await fetch("/api/auth/session");
        const body = (await res.json()) as { authenticated?: boolean; account?: BrickyAccount | null };
        if (!active) return;
        if (body.authenticated && body.account) setAccount(body.account);
      } catch {
        /* offline — stay signed out; a refresh will retry */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Once per session, ask the server for the one-time starter-credit
  // entitlement. The server decides (validated JWT, HttpOnly device cookie,
  // atomic claim in WordPress) and the balance is re-read below; the client
  // never writes or computes credits. Failed transport attempts are retried on
  // the next account change instead of being permanently marked done.
  useEffect(() => {
    if (!isBrickyApiConfigured || !account?.id) return;
    const id = account.id;
    if (starterClaimedRef.current.has(id)) return;
    starterClaimedRef.current.add(id);
    let active = true;
    void (async () => {
      try {
        const res = await fetch("/api/credit/claim-starter", { method: "POST" });
        const body = (await res.json()) as { granted?: boolean };
        if (!active) return;
        if (body.granted) {
          // 80 credits granted — refresh the balance so the UI shows the
          // server-computed value immediately.
          setAccountVersion((v) => v + 1);
        }
      } catch {
        // Transport failure only — allow a retry on the next account change.
        starterClaimedRef.current.delete(id);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrickyApiConfigured, account?.id]);

  // Re-fetch the authoritative account snapshot (balance, subscription, etc.)
  // whenever it changes or the claim effect bumps the version.
  useEffect(() => {
    if (!isBrickyApiConfigured || !account?.id) return;
    let active = true;
    void (async () => {
      try {
        const res = await fetch("/api/account");
        const body = (await res.json()) as { ok?: boolean; account?: BrickyAccount | null };
        if (!active) return;
        if (body.ok && body.account) setAccount(body.account);
      } catch {
        /* keep the current snapshot on transport failure */
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrickyApiConfigured, account?.id, accountVersion]);

  const refreshAccount = useCallback(async () => {
    if (!isBrickyApiConfigured) return;
    try {
      const res = await fetch("/api/account");
      const body = (await res.json()) as { ok?: boolean; account?: BrickyAccount | null };
      if (body.ok && body.account) setAccount(body.account);
    } catch {
      /* keep the current snapshot */
    }
  }, []);

  const signOut = useCallback(async () => {
    storePending(null);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* session cookie still cleared server-side below via the route itself */
    }
    setAccount(null);
  }, [storePending]);

  const requireAuth = useCallback(
    (action: AuthPendingAction) => {
      if (account) {
        runAction(action);
        return;
      }
      storePending(action);
      const path = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(path)}`);
    },
    [account, runAction, storePending, router]
  );

  const runStoredPendingAction = useCallback(() => {
    const action = getPending();
    if (!action) return false;
    runAction(action);
    return true;
  }, [runAction, getPending]);

  const value = useMemo<AuthContextValue>(
    () => ({
      configured: isBrickyApiConfigured,
      loading,
      account,
      signOut,
      refreshAccount,
      requireAuth,
      runStoredPendingAction,
    }),
    [loading, account, signOut, refreshAccount, requireAuth, runStoredPendingAction]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}