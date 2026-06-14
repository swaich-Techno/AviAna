import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false
  }
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  return <DashboardShell session={session}>{children}</DashboardShell>;
}
