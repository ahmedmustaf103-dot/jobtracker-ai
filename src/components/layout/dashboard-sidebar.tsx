"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { signOutAction } from "@/server/actions/auth.actions";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-r border-white/[0.06] bg-[#0c0c0f] lg:min-h-screen lg:w-64">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/[0.06] px-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 text-sm font-bold text-white shadow-lg shadow-violet-900/40">
          JT
        </span>
        <span className="font-semibold text-zinc-50">{siteConfig.name}</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-violet-500/15 text-violet-200 ring-1 ring-inset ring-violet-500/25"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs text-violet-200">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          AI insights — coming soon
        </div>
      </nav>

      <form action={signOutAction} className="border-t border-white/[0.06] p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </form>
    </aside>
  );
}
