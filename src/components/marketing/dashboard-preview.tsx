import {
  ArrowUpRight,
  Briefcase,
  CalendarCheck,
  Trophy,
} from "lucide-react";

import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Applications",
    value: "248",
    delta: "+12%",
    icon: Briefcase,
    tint: "text-violet-300",
    ring: "bg-violet-500/15",
  },
  {
    label: "Interviews",
    value: "32",
    delta: "+8%",
    icon: CalendarCheck,
    tint: "text-sky-300",
    ring: "bg-sky-500/15",
  },
  {
    label: "Offers",
    value: "6",
    delta: "+2",
    icon: Trophy,
    tint: "text-emerald-300",
    ring: "bg-emerald-500/15",
  },
];

const chart = [38, 52, 44, 67, 58, 80, 72, 95];

const recent = [
  { company: "Stripe", role: "Senior Frontend Engineer", status: "Interview", tone: "violet" },
  { company: "Linear", role: "Product Engineer", status: "Offer", tone: "emerald" },
  { company: "Vercel", role: "Full Stack Developer", status: "Applied", tone: "sky" },
  { company: "Notion", role: "Staff Engineer", status: "Screening", tone: "amber" },
] as const;

const toneMap: Record<string, string> = {
  violet: "bg-violet-500/15 text-violet-300 ring-violet-500/25",
  emerald: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25",
  sky: "bg-sky-500/15 text-sky-300 ring-sky-500/25",
  amber: "bg-amber-500/15 text-amber-300 ring-amber-500/25",
};

export function DashboardPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d10]/80 shadow-2xl shadow-black/60 backdrop-blur-xl",
        className,
      )}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/70" />
        <span className="h-3 w-3 rounded-full bg-amber-400/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
        <div className="ml-3 flex-1">
          <div className="mx-auto w-fit rounded-md bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-500">
            app.jobtracker.ai/dashboard
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500">Welcome back</p>
            <p className="text-sm font-semibold text-zinc-100">
              Your pipeline overview
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-violet-900/40">
            Add application
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ label, value, delta, icon: Icon, tint, ring }) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
            >
              <div
                className={cn(
                  "mb-2 flex h-8 w-8 items-center justify-center rounded-lg",
                  ring,
                )}
              >
                <Icon className={cn("h-4 w-4", tint)} />
              </div>
              <p className="text-lg font-semibold text-zinc-50">{value}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">{label}</span>
                <span className="inline-flex items-center text-[10px] font-medium text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />
                  {delta}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart + status split */}
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-300">
                Applications / week
              </p>
              <p className="text-[10px] text-zinc-500">Last 8 weeks</p>
            </div>
            <div className="flex h-24 items-end gap-2">
              {chart.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-violet-600/40 to-fuchsia-500/80"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-3 text-xs font-medium text-zinc-300">
              Offer rate
            </p>
            <div className="flex items-center justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[conic-gradient(theme(colors.violet.500)_0%,theme(colors.fuchsia.500)_68%,rgba(255,255,255,0.08)_68%)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0d0d10]">
                  <span className="text-sm font-semibold text-zinc-50">
                    68%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent applications */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <p className="text-xs font-medium text-zinc-300">
              Recent applications
            </p>
            <span className="text-[10px] text-violet-400">View all</span>
          </div>
          <ul className="divide-y divide-white/5">
            {recent.map(({ company, role, status, tone }) => (
              <li
                key={company}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.06] text-[11px] font-semibold text-zinc-300">
                    {company.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-100">{role}</p>
                    <p className="text-[10px] text-zinc-500">{company}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium ring-1",
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
