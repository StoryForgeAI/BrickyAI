/**
 * Server-only HTTP client for the WordPress Bricky AI API.
 *
 * This module is imported exclusively by server route handlers (BFF). It
 * performs the server-to-server WordPress calls and surfaces the normalized
 * response (status, parsed JSON body, upstream `Set-Cookie` headers) so the
 * calling route can decide what to do with each result.
 */

import "server-only";
import { brickyUrl, BRICKY_NAMESPACE } from "@/lib/bricky-api";

/** Prefixes the `bricky/v1` namespace unless the caller already specified a full `wp-json` path. */
function resolvePath(path: string): string {
  if (path.startsWith("/wp-json")) return path;
  return `${BRICKY_NAMESPACE}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Standardized result of a call to the WordPress backend. */
export interface BrickyServerResponse {
  /** HTTP status from WordPress; `0` means the network layer failed. */
  status: number;
  /** Parsed JSON body; `null` when the response was empty or not JSON. */
  body: Record<string, unknown> | null;
  /** Raw `Set-Cookie` values sent by WordPress (e.g. `bricky_device_id`). */
  setCookies: string[];
}

export interface BrickyServerRequestOptions {
  method?: "GET" | "POST";
  /** JSON-serializable request body (sent with `Content-Type: application/json`). */
  body?: unknown;
  /** JWT to send as `Authorization: Bearer …`. */
  token?: string;
  /** Raw browser cookies to forward (used so WordPress can see the device cookie). */
  cookiesToForward?: string;
  cache?: RequestCache;
}

/**
 * Calls `{BRICKY_API_URL}{path}` from the server.
 *
 * A fetch/network failure is never thrown: it is surfaced as `status: 0` with
 * a `network_error` body so callers can map it to a friendly message.
 */
export async function brickyServerRequest(
  path: string,
  options: BrickyServerRequestOptions = {}
): Promise<BrickyServerResponse> {
  const { method = "GET", body, token, cookiesToForward, cache = "no-store" } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (cookiesToForward) headers["Cookie"] = cookiesToForward;

  try {
    const res = await fetch(brickyUrl(resolvePath(path)), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache,
    });

    const text = await res.text();
    let parsed: Record<string, unknown> | null = null;
    if (text) {
      try {
        parsed = JSON.parse(text) as Record<string, unknown>;
      } catch {
        parsed = null;
      }
    }

    let setCookies: string[] = [];
    if (typeof res.headers.getSetCookie === "function") {
      setCookies = res.headers.getSetCookie();
    } else {
      const raw = res.headers.get("set-cookie");
      if (raw) setCookies = [raw];
    }

    return { status: res.status, body: parsed, setCookies };
  } catch {
    return { status: 0, body: { code: "network_error" }, setCookies: [] };
  }
}

/**
 * Tries to read a cookie value by name out of a raw WordPress `Set-Cookie`
 * header list. Used to capture `bricky_access_token` emitted during the Google
 * exchange so the BFF can store its own HttpOnly session cookie.
 */
export function cookieFromSetCookies(setCookies: string[], name: string): string | null {
  for (const header of setCookies) {
    const match = header.match(new RegExp(`(?:^|,\\s*)${name}=([^;]+)`));
    if (match?.[1]) return match[1];
  }
  return null;
}