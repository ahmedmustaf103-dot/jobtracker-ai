"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteApplicationAction } from "@/server/actions/application.actions";

type DeleteApplicationButtonProps = {
  id: string;
  title: string;
};

export function DeleteApplicationButton({
  id,
  title,
}: DeleteApplicationButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${title}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteApplicationAction(id);
      if (result.error) {
        window.alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="text-sm font-medium text-red-400 hover:text-red-300 disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
