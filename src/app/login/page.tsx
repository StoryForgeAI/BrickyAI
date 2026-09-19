import type { Metadata } from "next";
import AuthCardLayout from "@/components/auth/AuthCardLayout";
import LoginClient from "@/components/auth/LoginClient";

export const metadata: Metadata = {
  title: "Sign in — Bricky AI",
  description: "Sign in to your Bricky AI account.",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string | string[] }>;
}

function first(value: string | string[] | undefined): string {
  const item = Array.isArray(value) ? value[0] : value;
  const trimmed = item?.trim();
  // Only same-site paths are accepted as a post-login redirect.
  return trimmed && trimmed.startsWith("/") ? trimmed : "";
}

export default async function LoginPage(props: LoginPageProps) {
  const searchParams = await props.searchParams;
  return (
    <AuthCardLayout eyebrow="Account sign-in">
      <LoginClient redirect={first(searchParams.redirect)} />
    </AuthCardLayout>
  );
}