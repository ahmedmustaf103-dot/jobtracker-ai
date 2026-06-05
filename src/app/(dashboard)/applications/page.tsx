import type { Metadata } from "next";

import { DashboardHeader } from "@/components/layout/dashboard-header";

export const metadata: Metadata = {
  title: "Applications",
};

export default function ApplicationsPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Applications"
        description="All roles you are tracking. List view ships on Day 5."
      />
      <div className="rounded-xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-700">
        <p className="text-sm text-zinc-500">No applications to show yet.</p>
      </div>
    </div>
  );
}
