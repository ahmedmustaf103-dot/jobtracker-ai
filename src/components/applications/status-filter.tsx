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
          ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-900/30"
          : "bg-white/5 text-zinc-400 ring-1 ring-inset ring-white/10 hover:bg-white/10 hover:text-zinc-100",
      )}
    >
      {children}
    </Link>
  );
}
