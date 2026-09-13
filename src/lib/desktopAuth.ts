/**
 * Shared contract for the Bricky AI desktop-app authentication handshake.
 *
 * This module is CLIENT-SAFE (no `node:crypto`, no secrets) and is used by
 * both the browser pages and the server API routes so the endpoints and the
 * UI agree on machine-readable error codes.
 *
 * Flow (device-flow style):
 *
 *   1. The desktop app calls `POST /api/auth/desktop/start` and receives a
 *      `request_id` (public identifier) plus a `device_secret` (256-bit
 *      random value returned exactly once to the app).
 *   2. The app opens `redirect_url` in the user's default browser. The
 *      website signs the user in with Google (existing Supabase OAuth).
 *   3. The browser calls `POST /api/auth/desktop/complete` which binds the
 *      request to the authenticated user.
 *   4. The desktop app exchanges `{ request_id, device_secret }` at
 *      `POST /api/auth/desktop/exchange`. The server redeems the code
 *      atomically (single-use) and returns the verified account.
 *
 * The `device_secret` is never sent to the browser, never placed in a URL and
 * is stored only as a SHA-256 hash. Full details + the database schema are in
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