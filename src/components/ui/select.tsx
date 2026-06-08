import * as React from "react";

import { cn } from "@/lib/utils";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, ...props }, ref) => (
  <select
    className={cn(
      "flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Select.displayName = "Select";

export { Select };
