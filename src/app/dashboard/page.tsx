import type { Metadata } from "next";
import DashboardPage from "@/components/dashboard/DashboardPage";

export const metadata: Metadata = {
  title: "Dashboard — Bricky AI",
  description:
    "Your Bricky AI account dashboard: subscription status, weekly credits, and test-system account controls.",
};

export default function DashboardRoute() {
  return <DashboardPage />;
}