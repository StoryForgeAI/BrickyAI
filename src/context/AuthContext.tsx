"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { getBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { WINDOWS_DOWNLOAD_URL, PLUGIN_DOWNLOAD_URL } from "@/lib/config";
import type { Profile } from "@/lib/profile";
import { claimStarterCredits } from "@/lib/credit";
import AuthModal from "@/components/auth/AuthModal";

/**
 * A deferred action that runs after a successful sign-in. Only JSON-serializable
 * actions are supported because Google authentication requires a full-page
 * redirect (the action survives in sessionStorage).
 */
export type AuthPendingAction =
  | { type: "navigate-download" }
  | { type: "download-windows" }
  | { type: "download-plugin" };

const PENDING_STORAGE_KEY = "bricky-auth-pending";

interface AuthContextValue {
  /** Whether Supabase environment variables are configured for this deployment. */
  configured: boolean;
  /** True while the persisted session is being restored after load. */
  loading: boolean;
  user: User | null;
  session: Session | null;
  /** The signed-in user's `profiles` row (read-only; credits/subscription are server-managed). */
  profile: Profile | null;
  /** Open the auth (Google-only) modal. */
  openAuth: () => void;
  /** Close the modal and cancel any deferred action stored by `requireAuth`. */
  closeAuth: () => void;
  isOpen: boolean;
  /** Friendly, user-presentable error message (never raw backend errors). */
  error: string | null;
  clearError: () => void;
  signOut: () => Promise<void>;
  /**
   * Ensure the user is signed in before an action. If signed in, runs the
   * action immediately; otherwise stores it as pending and opens the modal so
   * it can run right after authentication.
   */
  requireAuth: (action: AuthPendingAction) => void;
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
  // When Supabase isn't configured there is nothing to restore, so loading is
  // false from the start.
  const [loading, setLoading] = useState(() => !isSupabaseConfigured);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingRef = useRef<AuthPendingAction | null>(null);
  // Tokens for which the one-time starter-credit claim was already attempted
  // this page lifetime. Keys off the access token so a fresh session retries.
  const starterClaimedRef = useRef<Set<string>>(new Set());
  // Bumped after a successful claim so the read-only profile is re-fetched.
  const [profileVersion, setProfileVersion] = useState(0);

  const supabase = isSupabaseConfigured ? getBrowserSupabaseClient() : null;

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
      else if (action.type === "navigate-download") router.push("/download");
      storePending(null);
    },
    [router, storePending]
  );

  useEffect(() => {
    if (!supabase) return;

    let active = true;

    const restore = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);

      // Detect a failed OAuth redirect (e.g. the user cancelled at Google).
      const params = new URLSearchParams(window.location.search);
      if (params.get("error")) {
        setError("Google sign-in was cancelled or could not be completed. Please try again.");
        setIsOpen(true);
        window.history.replaceState({}, "", window.location.pathname);
      }
    };

    void restore();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, changedSession) => {
      if (event === "INITIAL_SESSION") {
        setSession(changedSession);
        setUser(changedSession?.user ?? null);
        setLoading(false);
        // After a Google OAuth round-trip the library swaps the PKCE code for a
        // session on this page load and emits INITIAL_SESSION. Run a deferred
        // action that was set before the redirect (e.g. "download this file").
        if (changedSession) {
          const stored = getPending();
          if (stored) runAction(stored);
        }
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        setSession(changedSession);
        setUser(changedSession?.user ?? null);
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase, runAction, getPending]);

  // Once per session, ask the server for the one-time starter-credit
  // entitlement. The server decides (validated session, HttpOnly device cookie,
  // atomic claim in Postgres) and the balance is re-read below; the client
  // never writes or computes credits. Failed transport attempts are retried on
  // the next session refresh instead of being permanently marked done.
  useEffect(() => {
    if (!supabase || !session?.access_token) return;
    const token = session.access_token;
    if (starterClaimedRef.current.has(token)) return;
    starterClaimedRef.current.add(token);
    let active = true;
    void (async () => {
      const result = await claimStarterCredits();
      if (!active) return;
      if (result.ok) {
        // Claim consumed or already claimed — refresh the balance so the UI
        // shows the server-computed value (e.g. 80 on first sign-in).
        setProfileVersion((v) => v + 1);
      } else {
        // Transport failure only — allow a retry on the next session event.
        starterClaimedRef.current.delete(token);
      }
    })();
    return () => {
      active = false;
    };
  }, [supabase, session?.access_token]);

  // Fetch the signed-in user's read-only `profiles` row whenever the auth user
  // changes. The browser uses its own user ID only for the SELECT (the fetch is
  // scoped to the authenticated user), and credits/subscription remain
  // server-managed values — the client never writes them. The profile is
  // cleared in the sign-out handlers below, not via setState in this effect.
  useEffect(() => {
    if (!supabase || !user?.id) return;
    let active = true;
    void (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      if (error) {
        setProfile(null);
      } else {
        setProfile((data as Profile | null) ?? null);
      }
    })();
    return () => {
      active = false;
    };
  }, [supabase, user?.id, profileVersion]);

  const openAuth = useCallback(() => {
    setError(null);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
    setError(null);
    storePending(null);
  }, [storePending]);

  const clearError = useCallback(() => setError(null), []);

  const signOut = useCallback(async () => {
    storePending(null);
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  }, [supabase, storePending]);

  const requireAuth = useCallback(
    (action: AuthPendingAction) => {
      if (user) {
        runAction(action);
        return;
      }
      storePending(action);
      openAuth();
    },
    [user, runAction, storePending, openAuth]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      configured: isSupabaseConfigured,
      loading,
      user,
      session,
      profile,
      openAuth,
      closeAuth,
      isOpen,
      error,
      clearError,
      signOut,
      requireAuth,
    }),
    [loading, user, session, profile, openAuth, closeAuth, isOpen, error, clearError, signOut, requireAuth]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal
        open={isOpen}
        onClose={closeAuth}
        error={error}
        onClearError={clearError}
      />
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}