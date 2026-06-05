import type { Metadata } from "next";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      <DashboardHeader
        title={`Welcome, ${firstName}`}
        description="Your job search command center. Stats and applications ship on Day 5."
      />
      <div className="rounded-xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-700">
        <p className="text-sm text-zinc-500">
          Dashboard widgets will appear here in the next commit.
        </p>
      </div>
    </div>
  );
}
