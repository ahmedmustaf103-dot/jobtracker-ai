import { cn } from "@/lib/utils";

type PanelProps = React.ComponentProps<"div"> & {
  padding?: "none" | "sm" | "md";
};

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
};

export function Panel({ className, padding = "md", ...props }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.03]",
        paddingMap[padding],
        className,
      )}
      {...props}
    />
  );
}
