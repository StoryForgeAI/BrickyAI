import type { Metadata } from "next";
import AuthCardLayout from "@/components/auth/AuthCardLayout";
import ForgotPasswordClient from "@/components/auth/ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Reset password — Bricky AI",
  description: "Request a password reset link for your Bricky AI account.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthCardLayout eyebrow="Password reset">
      <ForgotPasswordClient />
    </AuthCardLayout>
  );
}