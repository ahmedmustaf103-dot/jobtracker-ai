import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showName?: boolean;
  size?: "sm" | "md";
  href?: string;
  onNavigate?: () => void;
};

const sizeMap = {
  sm: { box: "h-8 w-8 text-xs", gap: "gap-2", text: "text-sm" },
  md: { box: "h-9 w-9 text-sm", gap: "gap-2.5", text: "text-base" },
};

export function Logo({
  className,
  showName = true,
  size = "md",
  href = "/",
  onNavigate,
}: LogoProps) {
  const s = sizeMap[size];

  const content = (
    <>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 font-bold text-white shadow-lg shadow-violet-900/40",
          s.box,
        )}
        aria-hidden="true"
      >
        JT
      </span>
      {showName ? (
        <span className={cn("font-semibold tracking-tight text-zinc-50", s.text)}>
          {siteConfig.name}
        </span>
      ) : null}
    </>
  );

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn("inline-flex items-center", s.gap, className)}
    >
      {content}
    </Link>
  );
}
