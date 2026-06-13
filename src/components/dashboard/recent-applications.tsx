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
          <div className="rounded-lg border border-dashed border-white/10 py-10 text-center">
            <p className="text-sm text-zinc-400">No applications yet.</p>
            <p className="mt-2 text-xs text-zinc-500">
              Add applications from the Applications page.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {applications.map((app) => (
              <li
                key={app.id}
                className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-zinc-100">{app.title}</p>
                  <p className="text-sm text-zinc-500">{app.company}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-zinc-300 ring-1 ring-inset ring-white/10">
                    {APPLICATION_STATUS_LABELS[app.status]}
                  </span>
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
