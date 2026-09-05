"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { getBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { WINDOWS_DOWNLOAD_URL, PLUGIN_DOWNLOAD_URL } from "@/lib/config";
import AuthModal from "@/components/auth/AuthModal";

export type AuthMode = "login" | "signup" | "forgot";

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
const modeName: Record<AuthMode, string> = {
  login: "Log in",
  signup: "Create account",
  forgot: "Reset password",
};

interface AuthContextValue {
  /** Whether Supabase environment variables are configured for this deployment. */
  configured: boolean;
  /** True while the persisted session is being restored after load. */
  loading: boolean;
  user: User | null;
  session: Session | null;
  /** Open the auth modal (optionally in a specific mode). */
  openAuth: (options?: { mode?: AuthMode }) => void;
  closeAuth: () => void;
  isOpen: boolean;
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<AuthPendingAction | null>(null);
  const pendingRef = useRef<AuthPendingAction | null>(null);

  const supabase = isSupabaseConfigured ? getBrowserSupabaseClient() : null;

  const storePending = useCallback((action: AuthPendingAction | null) => {
    pendingRef.current = action;
    setPending(action);
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

  /** Restore a pending action stored before a Google OAuth round-trip. */
  useEffect(() => {
    const stored = readStoredPending();
    if (stored) storePending(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

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
        setError(
          "Google sign-in was cancelled or could not be completed. Please try again."
        );
        setIsOpen(true);
        window.history.replaceState({}, "", window.location.pathname);
      }
    };

    void restore();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, changedSession) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        setSession(changedSession);
        setUser(changedSession?.user ?? null);
        if (event === "SIGNED_IN") {
          const stored = pendingRef.current ?? readStoredPending();
          if (stored) runAction(stored);
        }
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        storePending(null);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase, runAction, storePending]);

  const openAuth = useCallback(
    (options?: { mode?: AuthMode }) => {
      setError(null);
      if (options?.mode) setMode(options.mode);
      setIsOpen(true);
    },
    []
  );

  const closeAuth = useCallback(() => {
    setIsOpen(false);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const signOut = useCallback(async () => {
    storePending(null);
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, [supabase, storePending]);

  const requireAuth = useCallback(
    (action: AuthPendingAction) => {
      if (user) {
        runAction(action);
        return;
      }
      storePending(action);
      openAuth({ mode: "login" });
    },
    [user, runAction, storePending, openAuth]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      configured: isSupabaseConfigured,
      loading,
      user,
      session,
      openAuth,
      closeAuth,
      isOpen,
      mode,
      setMode,
      error,
      clearError,
      signOut,
      requireAuth,
    }),
    [loading, user, session, openAuth, closeAuth, isOpen, mode, error, clearError, signOut, requireAuth]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal
        open={isOpen}
        mode={mode}
        onClose={closeAuth}
        onChangeView={setMode}
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

export { modeName };