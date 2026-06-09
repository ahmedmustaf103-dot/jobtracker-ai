import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_ORDER,
  type ApplicationStatus,
} from "@/types";

type StatusFilterProps = {
  activeStatus?: ApplicationStatus;
};

export function StatusFilter({ activeStatus }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterLink href="/applications" active={!activeStatus}>
        All
      </FilterLink>
      {APPLICATION_STATUS_ORDER.map((status) => (
        <FilterLink
          key={status}
          href={`/applications?status=${status}`}
          active={activeStatus === status}
        >
          {APPLICATION_STATUS_LABELS[status]}
        </FilterLink>
      ))}
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-indigo-600 text-white"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
      )}
    >
      {children}
    </Link>
  );
}
