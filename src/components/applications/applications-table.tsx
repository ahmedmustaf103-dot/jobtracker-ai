import Link from "next/link";

import { ApplicationStatusSelect } from "@/components/applications/application-status-select";
import { DeleteApplicationButton } from "@/components/applications/delete-application-button";
import { formatDate } from "@/lib/utils";
import type { JobApplication } from "@/types";

type ApplicationsTableProps = {
  applications: JobApplication[];
};

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <tr>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Updated</th>
            <th className="px-4 py-3 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
          {applications.map((app) => (
            <tr key={app.id}>
              <td className="px-4 py-3 font-medium">{app.title}</td>
              <td className="px-4 py-3 text-zinc-500">{app.company}</td>
              <td className="px-4 py-3">
                <ApplicationStatusSelect id={app.id} status={app.status} />
              </td>
              <td className="px-4 py-3 text-zinc-400">
                {formatDate(app.updatedAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/applications/${app.id}/edit`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Edit
                  </Link>
                  <DeleteApplicationButton id={app.id} title={app.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
