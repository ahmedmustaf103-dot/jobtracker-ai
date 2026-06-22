import type { ApplicationStatus } from "@/types";
import { APPLICATION_STATUS_LABELS } from "@/types";
import { cn } from "@/lib/utils";

const statusStyles: Partial<Record<ApplicationStatus, string>> = {
  WISHLIST: "bg-zinc-500/15 text-zinc-300 ring-zinc-500/25",
  APPLIED: "bg-sky-500/15 text-sky-300 ring-sky-500/25",
  SCREENING: "bg-amber-500/15 text-amber-300 ring-amber-500/25",
  INTERVIEW: "bg-violet-500/15 text-violet-300 ring-violet-500/25",
  OFFER: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25",
  REJECTED: "bg-red-500/15 text-red-300 ring-red-500/25",
  WITHDRAWN: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/20",
};

type StatusBadgeProps = {
  status: ApplicationStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        statusStyles[status] ?? "bg-white/5 text-zinc-300 ring-white/10",
        className,
      )}
    >
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}
