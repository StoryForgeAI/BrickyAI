/**
 * Shared types and URL helpers for the WordPress "Bricky AI API" backend.
 *
 * The WordPress plugin (`wp-content/plugins/bricky-ai-api.php`) exposes the
 * `bricky/v1` REST namespace at `{BRICKY_API_URL}/wp-json/bricky/v1`. All
 * account, credits and authentication state lives on that backend; this site
 * talks to it through server-side BFF routes so the browser never holds a
 * JWT or reaches WordPress directly.
 */

import { BRICKY_API_URL } from "@/lib/config";

/** REST namespace path prefixes for the Bricky AI WordPress plugin. */
export const BRICKY_NAMESPACE = "/wp-json/bricky/v1" as const;
export const JWT_AUTH_NAMESPACE = "/wp-json/jwt-auth/v1" as const;

/** Builds a full endpoint URL relative to the configured WordPress install. */
export function brickyUrl(path: string): string {
  const base = BRICKY_API_URL.replace(/\/+$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** WordPress installation root (login form URL for the Google flow). */
export function brickyRoot(): string {
  return BRICKY_API_URL.replace(/\/+$/, "");
}

/** User's subscription, exactly as returned by the backend `/account`. */
export interface BrickySubscription {
  plan: string;
  status: string;
  started_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  next_weekly_grant_at: string | null;
  canceled_at: string | null;
}

/** Authenticated account returned by `GET /wp-json/bricky/v1/account`. */
export interface BrickyAccount {
  id: number;
  email: string;
  name: string;
  username: string;
  email_verified: boolean;
  created_at: string | null;
  credits: number;
  subscription: BrickySubscription;
}

/** Response body of `POST /wp-json/jwt-auth/v1/token`. */
export interface BrickyAuthResponse {
  token?: string;
  user_email?: string;
  user_nicename?: string;
  user_display_name?: string;
}

/** Successful body of `POST /wp-json/bricky/v1/auth/google/exchange`. */
export interface BrickyGoogleExchangeResponse {
  success?: boolean;
  authenticated?: boolean;
  account?: BrickyAccount;
}

/** Success body of `GET /wp-json/bricky/v1/account` and `/me`. */
export interface BrickyAccountResponse {
  success: boolean;
  account?: BrickyAccount;
  user?: BrickyAccount;
}

/** Success body of `GET /wp-json/bricky/v1/credits`. */
export interface BrickyCreditsResponse {
  success: boolean;
  credits: number;
}

/** Success body of `POST /wp-json/bricky/v1/credit/claim-starter`. */
export interface BrickyStarterClaimResponse {
  success: boolean;
  credits_added?: number;
  credits?: number;
  claim_id?: number;
}

/**
 * A WordPress REST error body. `code` is the plugin's error code (e.g.
 * `starter_already_claimed`), possibly prefixed by the JWT plugin
 * (`[jwt_auth] incorrect_password`).
 */
export interface BrickyApiErrorBody {
  code?: string;
  message?: string;
  data?: { status?: number };
}