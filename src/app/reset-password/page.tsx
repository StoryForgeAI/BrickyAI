import type { Metadata } from "next";
import AuthCardLayout from "@/components/auth/AuthCardLayout";
import ResetPasswordClient from "@/components/auth/ResetPasswordClient";

export const metadata: Metadata = {
  title: "Choose a new password — Bricky AI",
  description: "Choose a new password for your Bricky AI account.",
  robots: { index: false, follow: false },
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ key?: string | string[]; login?: string | string[] }>;
}

function first(value: string | string[] | undefined): string {
  const item = Array.isArray(value) ? value[0] : value;
  return item?.trim() ?? "";
}

export default async function ResetPasswordPage(props: ResetPasswordPageProps) {
  const searchParams = await props.searchParams;
  return (
    <AuthCardLayout eyebrow="Password reset">
      <ResetPasswordClient resetKey={first(searchParams.key)} login={first(searchParams.login)} />
    </AuthCardLayout>
  );
}