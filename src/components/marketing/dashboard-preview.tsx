import {
  Briefcase,
  CalendarCheck,
  Trophy,
} from "lucide-react";

import { previewApplications, previewStats } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const iconMap = {
  briefcase: Briefcase,
  calendar: CalendarCheck,
  trophy: Trophy,
};

const toneMap: Record<string, string> = {
  violet: "bg-violet-500/15 text-violet-300 ring-violet-500/25",
  emerald: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25",
  sky: "bg-sky-500/15 text-sky-300 ring-sky-500/25",
  amber: "bg-amber-500/15 text-amber-300 ring-amber-500/25",
};

export function DashboardPreview({ className }: { className?: string }) {
  const hostname = new URL(siteConfig.url).hostname;

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-white/10 bg-surface-muted/80 shadow-2xl shadow-black/60 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/70" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-amber-400/70" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/70" aria-hidden="true" />
        <div className="ml-3 flex-1">
          <div className="mx-auto w-fit rounded-md bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-500">
            {hostname}/dashboard
          </div>
        </div>
        <span className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
          Example
        </span>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-zinc-500">Overview</p>
            <p className="text-sm font-semibold text-zinc-100">
              Your search at a glance
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-violet-900/40">
            Add application
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {previewStats.map(({ label, value, icon }) => {
            const Icon = iconMap[icon];
            return (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15">
                  <Icon className="h-4 w-4 text-violet-300" aria-hidden="true" />
                </div>
                <p className="text-lg font-semibold text-zinc-50">{value}</p>
                <span className="text-[11px] text-zinc-500">{label}</span>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <p className="text-xs font-medium text-zinc-300">
              Recent applications
            </p>
            <span className="text-[10px] text-violet-400">View all</span>
          </div>
          <ul className="divide-y divide-white/5">
            {previewApplications.map(({ company, role, status, tone }) => (
              <li
                key={`${company}-${role}`}
                className="flex items-center justify-between gap-3 px-4 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-[11px] font-semibold text-zinc-300">
                    {company.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-zinc-100">
                      {role}
                    </p>
                    <p className="truncate text-[10px] text-zinc-500">
                      {company}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1",
                    toneMap[tone],
                  )}
                >
                  {status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
