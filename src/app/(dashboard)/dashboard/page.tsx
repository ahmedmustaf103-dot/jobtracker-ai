import type { Metadata } from "next";
import Link from "next/link";

import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome, {firstName}</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        You are signed in as {session?.user?.email}. Full dashboard UI ships on
        Day 4.
      </p>
      <Link href="/" className="text-sm font-medium text-indigo-600">
        ← Back to home
      </Link>
    </div>
  );
}
