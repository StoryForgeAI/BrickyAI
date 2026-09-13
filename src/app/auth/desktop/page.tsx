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
  searchParams: Promise<{ request_id?: string | string[] }>;
}

/**
 * Dedicated entry point for the Bricky AI desktop application's browser-based
 * sign-in flow. The desktop app opens `/auth/desktop?request_id=...` in the
 * user's default browser; after Google authentication the browser binds the
 * handshake and returns the user to the home page.
 *
 * Google is the only sign-in method (reusing the site's existing Supabase
 * OAuth). There is intentionally no email/password path here.
 */
export default async function DesktopAuthPage(props: DesktopAuthPageProps) {
  const searchParams = await props.searchParams;
  const raw = searchParams.request_id;
  const requestId = Array.isArray(raw) ? raw[0] : raw;

  return <DesktopAuthClient requestId={requestId?.trim() || null} />;
}