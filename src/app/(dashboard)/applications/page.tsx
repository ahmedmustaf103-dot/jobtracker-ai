import type { Metadata } from "next";
import Link from "next/link";

import { ApplicationsTable } from "@/components/applications/applications-table";
import { StatusFilter } from "@/components/applications/status-filter";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";
import type { ApplicationStatus } from "@/types";
import { listApplications } from "@/server/services/applications.service";
import { applicationStatusSchema } from "@/validations/application";

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

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Applications"
        description={
          activeStatus
            ? `Showing ${applications.length} application(s) filtered by status.`
            : "All roles you are tracking."
        }
      >
        <Button asChild size="sm">
          <Link href="/applications/new">Add application</Link>
        </Button>
      </DashboardHeader>

      <StatusFilter activeStatus={activeStatus as ApplicationStatus | undefined} />

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500">
            {activeStatus
              ? "No applications match this filter."
              : "No applications yet."}
          </p>
          {activeStatus ? (
            <Button asChild className="mt-4" variant="outline" size="sm">
              <Link href="/applications">Clear filter</Link>
            </Button>
          ) : (
            <Button asChild className="mt-4" size="sm">
              <Link href="/applications/new">Add your first role</Link>
            </Button>
          )}
        </div>
      ) : (
        <ApplicationsTable applications={applications} />
      )}
    </div>
  );
}
