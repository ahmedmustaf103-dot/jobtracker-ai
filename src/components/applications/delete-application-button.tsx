"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteApplicationAction } from "@/server/actions/application.actions";

type DeleteApplicationButtonProps = {
  id: string;
  title: string;
  redirectTo?: string;
};

export function DeleteApplicationButton({
  id,
  title,
  redirectTo,
}: DeleteApplicationButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteApplicationAction(id);
      if (result.error) {
        setError(result.error);
        setOpen(false);
        return;
      }
      setOpen(false);
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        disabled={pending}
        aria-label={`Delete ${title}`}
        className="text-sm font-medium text-red-400 hover:text-red-300 disabled:opacity-50"
      >
        {pending ? "Deleting…" : "Delete"}
      </button>

      {error ? (
        <p className="mt-1 text-xs text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <ConfirmDialog
        open={open}
        title="Delete application?"
        description={`"${title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={pending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
