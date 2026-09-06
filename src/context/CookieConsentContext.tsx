"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createConsentRecord, readStoredConsent, writeStoredConsent } from "@/lib/cookieConsent";

interface CookieConsentContextValue {
  /** True once the visitor has made a consent decision (or a valid one is stored). */
  decided: boolean;
  /** Current value of the optional "preferences" category (default off). */
  preferences: boolean;
  /** Whether the first-visit banner should be shown. */
  bannerVisible: boolean;
  /** Whether the cookie settings modal is open. */
  settingsVisible: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (preferences: boolean) => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [decided, setDecided] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    // localStorage is an external system, so the initial read happens after
    // mount (never during SSR/hydration). Deferred so the very first client
    // render always matches the server render.
    const stored = readStoredConsent();
    const t = setTimeout(() => {
      if (stored) {
        setPreferences(stored.categories.preferences);
        setDecided(true);
        return;
      }
      // First visit or stale version → ask the visitor.
      setBannerVisible(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const decide = useCallback((nextPreferences: boolean) => {
    const record = createConsentRecord({ necessary: true, preferences: nextPreferences });
    writeStoredConsent(record);
    setPreferences(nextPreferences);
    setDecided(true);
    setBannerVisible(false);
    setSettingsVisible(false);
  }, []);

  const acceptAll = useCallback(() => decide(true), [decide]);
  const rejectNonEssential = useCallback(() => decide(false), [decide]);
  const savePreferences = useCallback((next: boolean) => decide(next), [decide]);

  const openSettings = useCallback(() => {
    // Banner and modal must not overlap; the banner is restored on close if
    // the visitor hasn't made a decision yet.
    setBannerVisible(false);
    setSettingsVisible(true);
  }, []);

  const closeSettings = useCallback(() => {
    setSettingsVisible(false);
    setBannerVisible((visible) => visible || !decided);
  }, [decided]);

  return (
    <CookieConsentContext.Provider
      value={
        {
          decided,
          preferences,
          bannerVisible,
          settingsVisible,
          openSettings,
          closeSettings,
          acceptAll,
          rejectNonEssential,
          savePreferences,
        } satisfies CookieConsentContextValue
      }
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return ctx;
}