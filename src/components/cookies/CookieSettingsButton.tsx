"use client";

import { useCookieConsent } from "@/context/CookieConsentContext";

interface CookieSettingsButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function CookieSettingsButton({ className, children }: CookieSettingsButtonProps) {
  const { openSettings } = useCookieConsent();
  return (
    <button type="button" onClick={openSettings} className={className}>
      {children ?? "Cookie Settings"}
    </button>
  );
}