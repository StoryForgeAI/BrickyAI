"use client";

import { AuthProvider } from "@/context/AuthContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import CookieConsentBanner from "@/components/cookies/CookieConsentBanner";
import CookieSettingsModal from "@/components/cookies/CookieSettingsModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CookieConsentProvider>
      <AuthProvider>{children}</AuthProvider>
      <CookieConsentBanner />
      <CookieSettingsModal />
    </CookieConsentProvider>
  );
}