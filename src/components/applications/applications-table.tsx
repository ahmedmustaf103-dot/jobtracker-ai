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
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 bg-white/[0.03] text-zinc-400">
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
        <tbody className="divide-y divide-white/5">
          {applications.map((app) => (
            <tr key={app.id} className="transition-colors hover:bg-white/[0.02]">
              <td className="px-4 py-3 font-medium text-zinc-100">
                {app.title}
              </td>
              <td className="px-4 py-3 text-zinc-400">{app.company}</td>
              <td className="px-4 py-3">
                <ApplicationStatusSelect id={app.id} status={app.status} />
              </td>
              <td className="px-4 py-3 text-zinc-500">
                {formatDate(app.updatedAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/applications/${app.id}/edit`}
                    className="text-sm font-medium text-violet-400 hover:text-violet-300"
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
