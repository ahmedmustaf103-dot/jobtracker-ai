import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type AnalysisSectionCardProps = {
  title: string;
  items: string[];
  icon: LucideIcon;
  tone?: "violet" | "emerald" | "amber" | "sky" | "rose";
  emptyMessage?: string;
};

const toneStyles = {
  violet: {
    ring: "bg-violet-500/15 text-violet-300",
    border: "hover:border-violet-500/30",
  },
  emerald: {
    ring: "bg-emerald-500/15 text-emerald-300",
    border: "hover:border-emerald-500/30",
  },
  amber: {
    ring: "bg-amber-500/15 text-amber-300",
    border: "hover:border-amber-500/30",
  },
  sky: {
    ring: "bg-sky-500/15 text-sky-300",
    border: "hover:border-sky-500/30",
  },
  rose: {
    ring: "bg-rose-500/15 text-rose-300",
    border: "hover:border-rose-500/30",
  },
};

export function AnalysisSectionCard({
  title,
  items,
  icon: Icon,
  tone = "violet",
  emptyMessage = "No items to show.",
}: AnalysisSectionCardProps) {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors",
        styles.border,
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            styles.ring,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">{emptyMessage}</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm leading-relaxed text-zinc-300"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/80" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
