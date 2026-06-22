import Link from "next/link";
import { Briefcase } from "lucide-react";

import { StatusBadge } from "@/components/applications/status-badge";
import { formatDate } from "@/lib/utils";
import type { ApplicationStats } from "@/server/services/applications.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

type RecentApplicationsProps = {
  applications: ApplicationStats["recent"];
};

export function RecentApplications({ applications }: RecentApplicationsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-base font-semibold text-zinc-100">
          Recent applications
        </CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href="/applications">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No recent activity"
            description="Applications you add or update will appear here."
            action={
              <Button asChild size="sm">
                <Link href="/applications/new">Add application</Link>
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-white/5">
            {applications.map((app) => (
              <li
                key={app.id}
                className="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-100">{app.title}</p>
                  <p className="truncate text-sm text-zinc-500">{app.company}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-sm">
                  <StatusBadge status={app.status} />
                  <span className="text-zinc-500">{formatDate(app.updatedAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
