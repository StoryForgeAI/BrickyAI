import type { Metadata } from "next";
import AuthCardLayout from "@/components/auth/AuthCardLayout";
import VerifyEmailClient from "@/components/auth/VerifyEmailClient";

export const metadata: Metadata = {
  title: "Verify email — Bricky AI",
  description: "Verify your Bricky AI email address.",
  robots: { index: false, follow: false },
};

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string | string[]; email?: string | string[] }>;
}

function first(value: string | string[] | undefined): string {
  const item = Array.isArray(value) ? value[0] : value;
  return item?.trim() ?? "";
}

export default async function VerifyEmailPage(props: VerifyEmailPageProps) {
  const searchParams = await props.searchParams;
  const token = first(searchParams.token);
  const email = first(searchParams.email);
  return (
    <AuthCardLayout eyebrow="Email verification">
      <VerifyEmailClient token={token || null} initialEmail={email} />
    </AuthCardLayout>
  );
}