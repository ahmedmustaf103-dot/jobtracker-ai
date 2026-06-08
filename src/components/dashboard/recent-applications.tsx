import Link from "next/link";

import { formatDate } from "@/lib/utils";
import { APPLICATION_STATUS_LABELS } from "@/types";
import type { ApplicationStats } from "@/server/services/applications.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RecentApplicationsProps = {
  applications: ApplicationStats["recent"];
};

export function RecentApplications({ applications }: RecentApplicationsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent applications</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href="/applications">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-200 py-10 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-500">No applications yet.</p>
            <p className="mt-2 text-xs text-zinc-400">
              Add applications on Day 6, or run the seed script to load demo data.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {applications.map((app) => (
              <li
                key={app.id}
                className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{app.title}</p>
                  <p className="text-sm text-zinc-500">{app.company}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium dark:bg-zinc-800">
                    {APPLICATION_STATUS_LABELS[app.status]}
                  </span>
                  <span className="text-zinc-400">{formatDate(app.updatedAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
