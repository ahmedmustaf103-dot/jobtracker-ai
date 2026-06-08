import type { Metadata } from "next";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { RecentApplications } from "@/components/dashboard/recent-applications";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { getSession } from "@/lib/auth/session";
import { getApplicationStats } from "@/server/services/applications.service";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const stats = await getApplicationStats(userId);
  const firstName = session.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      <DashboardHeader
        title={`Welcome, ${firstName}`}
        description="Your job search command center."
      />
      <StatsCards stats={stats} />
      <RecentApplications applications={stats.recent} />
    </div>
  );
}
