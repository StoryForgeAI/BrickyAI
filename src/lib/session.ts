/**
 * HttpOnly session cookie helpers.
 *
 * The browser never holds the WordPress JWT directly — it lives in this
 * HttpOnly cookie (`bricky_session`) that the BFF routes read in order to call
 * WordPress with `Authorization: Bearer …`.
 */

import "server-only";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "bricky_session";
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  };
}

/** Reads the WordPress JWT out of the session cookie (or null). */
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

/** Stores the WordPress JWT in an HttpOnly session cookie. */
export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, cookieOptions());
}

/** Expires the session cookie. */
export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    ...cookieOptions(),
    maxAge: 0,
  });
}