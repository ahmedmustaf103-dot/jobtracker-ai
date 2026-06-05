import type { Metadata } from "next";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const session = await getSession();

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Settings"
        description="Manage your account. Full settings ship on Day 8."
      />
      <div className="max-w-lg rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-zinc-100 py-2 dark:border-zinc-800">
            <dt className="text-zinc-500">Name</dt>
            <dd className="font-medium">{session?.user?.name ?? "—"}</dd>
          </div>
          <div className="flex justify-between py-2">
            <dt className="text-zinc-500">Email</dt>
            <dd className="font-medium">{session?.user?.email ?? "—"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
