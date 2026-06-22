import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase } from "lucide-react";

import { ApplicationsTable } from "@/components/applications/applications-table";
import { StatusFilter } from "@/components/applications/status-filter";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { formatCountLabel } from "@/lib/format";
import { getSession } from "@/lib/auth/session";
import type { ApplicationStatus } from "@/types";
import { listApplications } from "@/server/services/applications.service";
import { applicationStatusSchema } from "@/validations/application";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Applications",
};

type ApplicationsPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function ApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const { status: statusParam } = await searchParams;
  const parsedStatus = statusParam
    ? applicationStatusSchema.safeParse(statusParam)
    : null;
  const activeStatus = parsedStatus?.success ? parsedStatus.data : undefined;

  const applications = await listApplications(userId, { status: activeStatus });

  const description = activeStatus
    ? `${formatCountLabel(applications.length, "application")} in this filter.`
    : `${formatCountLabel(applications.length, "application")} in your pipeline.`;

  return (
    <div className="space-y-8">
      <DashboardHeader title="Applications" description={description}>
        <Button asChild size="sm">
          <Link href="/applications/new">Add application</Link>
        </Button>
      </DashboardHeader>

      <StatusFilter activeStatus={activeStatus as ApplicationStatus | undefined} />

      {applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={
            activeStatus
              ? "No applications match this filter"
              : "No applications yet"
          }
          description={
            activeStatus
              ? "Try another status or clear the filter to see everything."
              : "Add a role you're applying for to start tracking your pipeline."
          }
          action={
            activeStatus ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/applications">Clear filter</Link>
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href="/applications/new">Add application</Link>
              </Button>
            )
          }
        />
      ) : (
        <ApplicationsTable applications={applications} />
      )}
    </div>
  );
}
