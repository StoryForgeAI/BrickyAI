import { siteConfig } from "@/lib/config";

/**
 * Client-safe resolver for the base origin that Supabase Auth should redirect
 * the user back to after OAuth / email flows complete.
 *
 * Priority:
 *   1. `NEXT_PUBLIC_SITE_URL` — explicit production override (set to the
 *      deployed Bricky AI domain on Vercel). Deterministic.
 *   2. `window.location.origin` — fall back to the current page origin, which
 *      keeps local development (localhost) and Vercel preview deployments
 *      working without any configuration.
 *   3. `siteConfig.url` — final fallback used outside the browser.
 *
 * There is deliberately NO hardcoded localhost URL: production always resolves
 * to the canonical deployed origin.
 */
export function getAuthRedirectOrigin(): string {
  const override = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (override) return override.replace(/\/+$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return siteConfig.url;
}

/**
 * Builds the full post-auth landing URL for a given site path.
 * `path` may be empty, "/", or a full path such as "/download".
 * Falls back to the site root when no path is provided.
 */
export function authRedirectTo(path = "/"): string {
  const origin = getAuthRedirectOrigin();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}