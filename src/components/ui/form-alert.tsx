import { cn } from "@/lib/utils";

type FormAlertProps = {
  variant: "error" | "success" | "info";
  children: React.ReactNode;
  id?: string;
  className?: string;
};

const variants = {
  error:
    "border-red-500/20 bg-red-500/10 text-red-300",
  success:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  info:
    "border-sky-500/20 bg-sky-500/10 text-sky-300",
};

export function FormAlert({
  variant,
  children,
  id,
  className,
}: FormAlertProps) {
  return (
    <p
      id={id}
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        variants[variant],
        className,
      )}
    >
      {children}
    </p>
  );
}
