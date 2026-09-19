import type { Metadata } from "next";
import AuthCardLayout from "@/components/auth/AuthCardLayout";
import RegisterClient from "@/components/auth/RegisterClient";

export const metadata: Metadata = {
  title: "Create account — Bricky AI",
  description: "Create your Bricky AI account.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <AuthCardLayout eyebrow="Create account">
      <RegisterClient />
    </AuthCardLayout>
  );
}