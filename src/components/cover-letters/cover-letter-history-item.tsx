"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Trash2 } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import { CopyButton } from "@/components/cover-letters/copy-button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteCoverLetterAction } from "@/server/actions/cover-letter.actions";

type CoverLetterHistoryItemProps = {
  id: string;
  company: string;
  role: string;
  content: string;
  createdAt: string;
};

export function CoverLetterHistoryItem({
  id,
  company,
  role,
  content,
  createdAt,
}: CoverLetterHistoryItemProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, startDelete] = useTransition();

  function handleConfirmDelete() {
    startDelete(async () => {
      await deleteCoverLetterAction(id);
      setConfirmOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <div className="rounded-xl border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between gap-3 p-4">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex flex-1 items-center gap-3 text-left"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-zinc-500 transition-transform",
                expanded && "rotate-180",
              )}
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-zinc-100">
                {role}
              </span>
              <span className="block truncate text-xs text-zinc-500">
                {company} · {formatDate(createdAt)}
              </span>
            </span>
          </button>
          <div className="flex shrink-0 items-center gap-2">
            <CopyButton value={content} />
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={deleting}
              aria-label={`Delete cover letter for ${role} at ${company}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        {expanded ? (
          <div className="border-t border-white/[0.06] p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">
              {content}
            </pre>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete cover letter?"
        description={`The cover letter for ${role} at ${company} will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
