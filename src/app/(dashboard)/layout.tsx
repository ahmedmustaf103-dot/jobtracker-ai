import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getSession } from "@/lib/auth/session";
import { isResumeAnalyzerEnabled } from "@/lib/resume/storage-config";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardShell resumeAnalyzerEnabled={isResumeAnalyzerEnabled()}>
      {children}
    </DashboardShell>
  );
}
