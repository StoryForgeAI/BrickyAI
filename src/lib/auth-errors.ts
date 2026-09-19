/**
 * Centralized WordPress error-code → friendly user-facing message mapping.
 *
 * Both the BFF routes and client pages use this so the UI never shows raw
 * REST errors or network jargon. Codes mirror `wp-content/plugins/bricky-ai-api.php`
 * and the `jwt-authentication-for-wp-rest-api` plugin (which prefixes its
 * codes with `[jwt_auth] `).
 */

export const NETWORK_ERROR_MESSAGE = "We couldn't connect to Bricky AI. Please try again.";
export const GENERIC_ERROR_MESSAGE = "We couldn't complete that. Please try again.";

/** Codes that should never reach the UI (WordPress plumbing errors). */
const NON_USER_FACING_CODES = new Set([
  "rest_forbidden",
  "rest_no_route",
  "rest_invalid_json",
  "rest_cookie_invalid_nonce",
  "jwt_auth_bad_auth_header",
  "jwt_auth_invalid_token",
  "jwt_auth_expired_token",
  "jwt_auth_no_auth_header",
  "internal_error",
  "network_error",
]);

/**
 * Strips the JWT plugin's `[jwt_auth] ` prefix. Normalized codes are *also*
 * keyed below so both forms resolve.
 */
export function normalizeCode(raw: unknown): string {
  if (typeof raw !== "string" || raw === "") return "";
  return raw.replace(/^\[jwt_auth\]\s*/i, "").trim();
}

const MESSAGES: Record<string, string> = {
  incorrect_password: "Incorrect email or password.",
  invalid_email: "Incorrect email or password.",
  invalid_username: "Incorrect email or password.",
  bricky_email_not_verified: "Please verify your email before signing in.",

  invalid_email_format: "Please enter a valid email address.",
  weak_password: "Password must be at least 8 characters long.",
  email_exists: "An account with this email already exists. Try signing in instead.",
  registration_failed: "We couldn't create your account right now. Please try again.",

  missing_token: "This verification link is incomplete. Please check the link in your email.",
  invalid_token: "This verification link is invalid. Please request a new one.",
  token_already_used: "This verification link has already been used. You're all set.",
  token_expired: "This verification link has expired. Please request a new one.",
  user_not_found: "The account for this link could not be found. Please try again.",

  missing_code: "This sign-in link is incomplete. Please try again.",
  invalid_code: "This sign-in link is invalid. Please try again.",
  code_already_used: "This sign-in link has already been used. Please sign in again.",
  code_expired: "This sign-in link has expired. Please try again.",

  missing_reset_data: "This password reset link is incomplete. Please check the link in your email.",
  invalid_reset_key: "This password reset link is invalid or expired. Please request a new one.",
  invalid_user: "The account for this link could not be found. Please request a new link.",

  starter_already_claimed: "You've already received your starter credits.",
  starter_already_claimed_on_browser: "Starter credits have already been claimed on this browser.",

  not_authenticated: "Please sign in again.",
};

/**
 * Maps a WordPress REST error to a friendly message without leaking raw
 * backend text.
 */
export function friendlyMessage(
  status: number,
  body: { code?: unknown; message?: unknown } | null,
  fallback = GENERIC_ERROR_MESSAGE
): string {
  if (status === 0) return NETWORK_ERROR_MESSAGE;

  const code = normalizeCode(body?.code);
  if (code && MESSAGES[code]) return MESSAGES[code];

  const message =
    typeof body?.message === "string" && body.message.trim() !== "" ? body.message.trim() : "";
  if (message && !NON_USER_FACING_CODES.has(code)) return message;

  return fallback;
}