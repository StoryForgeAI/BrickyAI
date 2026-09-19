import { BRICKY_API_URL } from "@/lib/config";
import { siteConfig } from "@/lib/config";

/**
 * Client-safe helpers for provider-based sign-in.
 *
 * Google is fully supported by the WordPress backend: `GET /wp-json/bricky/v1/auth/google/start`
 * sets an HttpOnly flow cookie and redirects through Nextend Social Login,
 * then returns to `/auth/google/callback?code=…` where the BFF exchanges the
 * one-time code.
 *
 * Facebook is intentionally ISOLATED: the backend plugin only wires the Google
 * provider, so there is no `/auth/facebook/*` contract. The UI still offers
 * "Continue with Facebook", but clicking it surfaces a clean, honest notice
 * instead of pretending to sign in. See the final migration report.
 */

/** Once a browser Google flow exists, the callback lives at this site path. */
export const GOOGLE_CALLBACK_PATH = "/auth/google/callback";
/** Expected future Facebook callback path (unused until the backend contract lands). */
export const FACEBOOK_CALLBACK_PATH = "/auth/facebook/callback";

export type SocialProvider = "google" | "facebook";

/** sessionStorage key used to remember where a Google round-trip should return. */
export const GOOGLE_RETURN_KEY = "bricky-google-return";

export interface SocialProviderInfo {
  id: SocialProvider;
  label: string;
  /** Whether the WordPress backend currently supports the full flow. */
  enabled: boolean;
}

export const SOCIAL_PROVIDERS: SocialProviderInfo[] = [
  { id: "google", label: "Google", enabled: true },
  { id: "facebook", label: "Facebook", enabled: false },
];

/**
 * Full URL the browser should navigate to in order to start Google sign-in.
 * A full-page navigation is required (WordPress + Nextend set cookies and
 * redirect), so this is never fetched.
 */
export function googleStartUrl(): string {
  const base = BRICKY_API_URL.replace(/\/+$/, "");
  return `${base}/wp-json/bricky/v1/auth/google/start`;
}

/**
 * Start the full-page Google sign-in flow. The current path is remembered in
 * sessionStorage (`GOOGLE_RETURN_KEY`) so `/auth/google/callback` can return
 * the user here after the code exchange. `returnPath` defaults to the current
 * page.
 */
export function startGoogleFlow(returnPath?: string): void {
  const target = returnPath ?? window.location.pathname + window.location.search;
  try {
    sessionStorage.setItem(GOOGLE_RETURN_KEY, target);
  } catch {
    /* private mode — the callback falls back to reading the query string */
  }
  window.location.href = googleStartUrl();
}

/**
 * Resolve where a Google round-trip should return: the sessionStorage path set
 * by `startGoogleFlow`, or a provided fallback. Consumed by the OAuth callback
 * page once the account is ready.
 */
export function googleReturnPath(): string | null {
  try {
    const stored = sessionStorage.getItem(GOOGLE_RETURN_KEY);
    if (stored && stored.startsWith("/")) return stored;
  } catch {
    /* reading unavailable — fall through */
  }
  return null;
}

export function isSocialLoginConfigured(): boolean {
  return BRICKY_API_URL !== "";
}

/**
 * The site's own canonical base for building login/callback links from env.
 * Kept for parity with the old oauth helper; Google landing is now backend-driven.
 */
export function siteBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim()?.replace(/\/+$/, "") ?? siteConfig.url;
}