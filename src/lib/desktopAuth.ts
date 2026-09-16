/**
 * Shared contract for the Bricky AI desktop-app authentication handshake.
 *
 * This module is CLIENT-SAFE (no `node:crypto`, no secrets) and is used by
 * both the browser pages and the server API routes so the endpoints and the
 * UI agree on machine-readable error codes.
 *
 * Flow — code-based (primary, what the desktop app ships today):
 *
 *   1. The desktop app generates a high-entropy `code` and opens
 *      `/auth/desktop?code=…` in the user's default browser.
 *   2. The website signs the user in with Google (existing Supabase OAuth) and
 *      binds the code to the authenticated user via
 *      `POST /api/auth/desktop/complete` (`{ requestId, code }`).
 *   3. The desktop app redeems `{ code }` at
 *      `POST /api/auth/desktop/exchange`. The server redeems the code
 *      atomically (single-use) and returns the verified account.
 *
 * Legacy `request_id` + `device_secret` flow (started via
 * `POST /api/auth/desktop/start`) remains supported for backwards
 * compatibility.
 *
 * Only the SHA-256 hash of a code/secret is ever stored; a code is never sent
 * to a URL beyond the initial browser open, and a raw device secret is never
 * placed in a URL at all. Full details + the database schema are in
 * `docs/DESKTOP_AUTH_SETUP.md`.
 */

/** How long a desktop sign-in request stays valid once started (seconds). */
export const DESKTOP_AUTH_TTL_SECONDS = 10 * 60;

export const DESKTOP_AUTH_ERRORS = {
  /** Request id missing or malformed in the request body. */
  INVALID_REQUEST: "invalid_request",
  /** Request id unknown, or the secret does not match this request. */
  INVALID: "invalid",
  /** Exchange called before the browser has completed sign-in. */
  PENDING: "pending",
  /** The request outlived its short lifetime. */
  EXPIRED: "expired",
  /** The one-time code was already redeemed. */
  ALREADY_USED: "already_used",
  /** The request is bound to a different Google account. */
  ALREADY_BOUND: "already_bound",
} as const;

export type DesktopAuthErrorCode =
  (typeof DESKTOP_AUTH_ERRORS)[keyof typeof DESKTOP_AUTH_ERRORS];

/**
 * Bounds for the code the desktop app generates and places in the
 * `/auth/desktop?code=…` URL. Wide bounds keep the check permissive while
 * still rejecting obviously bogus input (whitespace, shorts, megabytes).
 */
export const DESKTOP_CODE_MIN_LENGTH = 8;
export const DESKTOP_CODE_MAX_LENGTH = 512;

/** Printable ASCII without whitespace: `[!-~]`. */
const WELL_FORMED_CODE_RE = /^[!-~]{8,512}$/;

/**
 * True when `value` looks like a code the Bricky AI desktop app would
 * generate: printable ASCII of a sane length, no whitespace, no control
 * characters. The server never queries/inserts a desktop session for an
 * unwell-formed value, so garbage URLs are rejected cheaply.
 */
export function isWellFormedDesktopCode(value: string): boolean {
  return WELL_FORMED_CODE_RE.test(value);
}

/**
 * Reads the desktop credential out of an exchange request body. Accepts the
 * common field names the desktop app might send (`code`, `token`, …).
 * Returns `null` when absent or not a non-empty string. Does NOT validate the
 * code format — callers apply `isWellFormedDesktopCode` before trusting it.
 */
export function extractDesktopCredential(body: Record<string, unknown> | null): string | null {
  if (!body) return null;
  const raw =
    body["code"] ??
    body["auth_code"] ??
    body["authorization_code"] ??
    body["token"] ??
    body["deviceSecret"] ??
    body["device_secret"];
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Shape returned by `POST /api/auth/desktop/complete`. */
export interface DesktopAuthCompleteResponse {
  ok?: boolean;
  error?: string;
  code?: DesktopAuthErrorCode;
}

/** Shape returned by `POST /api/auth/desktop/start`. */
export interface DesktopAuthStartResponse {
  request_id: string;
  /** Returned exactly once — the desktop app must keep it secret. */
  device_secret: string;
  expires_in: number;
  redirect_url: string;
}

/** Shape returned by a successful `POST /api/auth/desktop/exchange`. */
export interface DesktopAuthExchangeUser {
  id: string;
  email: string | null;
  email_verified: boolean;
  credits: number | null;
  subscription: string | null;
  subscription_expires_at: string | null;
}