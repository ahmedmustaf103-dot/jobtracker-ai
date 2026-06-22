import { cn } from "@/lib/utils";

type SectionBadgeProps = {
  children: React.ReactNode;
  variant?: "accent" | "muted";
  className?: string;
};

export function SectionBadge({
  children,
  variant = "muted",
  className,
}: SectionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium",
        variant === "accent"
          ? "border border-violet-500/30 bg-violet-500/10 text-violet-200"
          : "border border-white/10 bg-white/[0.03] text-violet-300",
        className,
      )}
    >
      {children}
    </span>
  );
}
