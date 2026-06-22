"use client";

import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={onCancel}
      className={cn(
        "fixed inset-0 z-50 m-auto w-[min(100%-2rem,28rem)] rounded-2xl border border-white/10",
        "bg-surface-elevated p-0 text-zinc-100 shadow-2xl backdrop:bg-black/60",
        "open:animate-in open:fade-in-0",
      )}
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold text-zinc-50">{title}</h2>
        <p className="mt-2 text-sm text-zinc-400">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={
              destructive
                ? "bg-red-600 hover:bg-red-500"
                : undefined
            }
          >
            {loading ? "Working…" : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
