import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0A0A0A] text-zinc-100 lg:flex-row">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none fixed -top-40 right-0 h-[420px] w-[620px] rounded-full bg-violet-700/10 blur-[140px]" />
      <DashboardSidebar />
      <div className="relative flex flex-1 flex-col">
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
