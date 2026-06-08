import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[100px] w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
