"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

type CopyButtonProps = {
  value: string;
  className?: string;
  label?: string;
};

export function CopyButton({ value, className, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — ignore silently.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.07]",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </button>
  );
}
