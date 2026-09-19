import type { Metadata } from "next";
import AuthCardLayout from "@/components/auth/AuthCardLayout";
import GoogleCallbackClient from "@/components/auth/GoogleCallbackClient";

export const metadata: Metadata = {
  title: "Signing in — Bricky AI",
  description: "Completing your Bricky AI sign-in.",
  robots: { index: false, follow: false },
};

interface GoogleCallbackPageProps {
  searchParams: Promise<{ redirect?: string | string[] }>;
}

function first(value: string | string[] | undefined): string {
  const item = Array.isArray(value) ? value[0] : value;
  const trimmed = item?.trim();
  return trimmed && trimmed.startsWith("/") ? trimmed : "/dashboard";
}

export default async function GoogleCallbackPage(props: GoogleCallbackPageProps) {
  const searchParams = await props.searchParams;
  return (
    <AuthCardLayout eyebrow="Google sign-in">
      <GoogleCallbackClient fallbackRedirect={first(searchParams.redirect)} />
    </AuthCardLayout>
  );
}