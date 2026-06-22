"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FileSearch,
  LayoutDashboard,
  LogOut,
  PenLine,
  Settings,
} from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/server/actions/auth.actions";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/cover-letters", label: "Cover letters", icon: PenLine },
  { href: "/resume-analyzer", label: "Resume analyzer", icon: FileSearch },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

type DashboardSidebarProps = {
  className?: string;
  onNavigate?: () => void;
  mobileClose?: React.ReactNode;
};

export function DashboardSidebar({
  className,
  onNavigate,
  mobileClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Dashboard navigation"
      className={cn(
        "flex flex-col border-r border-white/[0.06] bg-surface lg:min-h-screen lg:w-64",
        className,
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-4">
        <Logo href="/dashboard" size="sm" onNavigate={onNavigate} />
        {mobileClose}
      </div>

      <nav aria-label="Main" className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-violet-500/15 text-violet-200 ring-1 ring-inset ring-violet-500/25"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <form action={signOutAction} className="border-t border-white/[0.06] p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </form>
    </aside>
  );
}
