import type { Metadata } from "next";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardOnboarding } from "@/components/dashboard/dashboard-onboarding";
import { RecentApplications } from "@/components/dashboard/recent-applications";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { getSession } from "@/lib/auth/session";
import { getApplicationStats } from "@/server/services/applications.service";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const stats = await getApplicationStats(userId);
  const firstName = session.user?.name?.split(" ")[0] ?? "there";
  const isNewUser = stats.total === 0;

  return (
    <div className="space-y-8">
      <DashboardHeader
        title={isNewUser ? `Hi, ${firstName}` : `Welcome back, ${firstName}`}
        description={
          isNewUser
            ? "Add your first application to start building your pipeline."
            : `${stats.total} role${stats.total === 1 ? "" : "s"} tracked across your search.`
        }
      />
      {isNewUser ? <DashboardOnboarding /> : null}
      {!isNewUser ? (
        <>
          <StatsCards stats={stats} />
          <RecentApplications applications={stats.recent} />
        </>
      ) : null}
    </div>
  );
}
