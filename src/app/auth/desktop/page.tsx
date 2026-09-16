import type { Metadata } from "next";
import DesktopAuthClient from "@/components/auth/DesktopAuthClient";

export const metadata: Metadata = {
  title: "Sign in to Bricky AI",
  description:
    "Sign in securely to continue to the Bricky AI desktop application.",
  robots: {
    index: false,
    follow: false,
  },
};

interface DesktopAuthPageProps {
  searchParams: Promise<{
    request_id?: string | string[];
    code?: string | string[];
    desktop_code?: string | string[];
  }>;
}

function first(value: string | string[] | undefined): string | undefined {
  if (value === undefined) return undefined;
  const item = Array.isArray(value) ? value[0] : value;
  const trimmed = item?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Dedicated entry point for the Bricky AI desktop application's browser-based
 * sign-in flow. The desktop app opens `/auth/desktop?code=…` (code generated
 * by the app) in the user's default browser. After Google authentication the
 * browser binds the handshake and returns the user to the home page.
 *
 * Param precedence:
 *   1. `desktop_code` — returned from Google OAuth in the code-based flow,
 *      so the app's code is never confused with Supabase's PKCE `code` that
 *      may also be present after the round trip.
 *   2. `request_id` — the legacy `/api/auth/desktop/start` flow.
 *   3. `code` — the code the desktop app originally opened the page with.
 *
 * Google is the only sign-in method (reusing the site's existing Supabase
 * OAuth). There is intentionally no email/password path here.
 */
export default async function DesktopAuthPage(props: DesktopAuthPageProps) {
  const searchParams = await props.searchParams;
  const desktopCode = first(searchParams.desktop_code);
  const requestIdParam = first(searchParams.request_id);
  const codeParam = first(searchParams.code);

  let requestId: string | null;
  let codeFlow: boolean;
  if (desktopCode) {
    requestId = desktopCode;
    codeFlow = true;
  } else if (requestIdParam) {
    requestId = requestIdParam;
    codeFlow = false;
  } else if (codeParam) {
    requestId = codeParam;
    codeFlow = true;
  } else {
    requestId = null;
    codeFlow = false;
  }

  return <DesktopAuthClient requestId={requestId} codeFlow={codeFlow} />;
}