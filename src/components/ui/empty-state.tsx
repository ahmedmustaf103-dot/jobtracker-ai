import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-white/10 px-6 py-12 text-center",
        className,
      )}
    >
      {Icon ? (
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15">
          <Icon className="h-5 w-5 text-violet-300" aria-hidden="true" />
        </div>
      ) : null}
      <p
        className={cn(
          "text-sm font-medium text-zinc-300",
          Icon ? "mt-4" : undefined,
        )}
      >
        {title}
      </p>
      {description ? (
        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-500">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
