import type { Metadata } from "next";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { formatDate } from "@/lib/utils";
import { getSession } from "@/lib/auth/session";
import { APPLICATION_STATUS_LABELS } from "@/types";
import { listApplications } from "@/server/services/applications.service";

export const metadata: Metadata = {
  title: "Applications",
};

export default async function ApplicationsPage() {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const applications = await listApplications(userId);

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Applications"
        description="All roles you are tracking."
      />

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500">No applications yet.</p>
          <p className="mt-2 text-xs text-zinc-400">
            Create and edit flows ship on Day 6. Run <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">npm run db:seed</code> for demo data.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <tr>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="px-4 py-3 font-medium">{app.title}</td>
                  <td className="px-4 py-3 text-zinc-500">{app.company}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium dark:bg-zinc-800">
                      {APPLICATION_STATUS_LABELS[app.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {formatDate(app.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
