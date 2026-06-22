"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Trash2 } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import { ScoreRing } from "@/components/resume-analyzer/score-ring";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteResumeAnalysisAction } from "@/server/actions/resume.actions";
import type { ResumeAnalysisRecord } from "@/types/resume";

type ResumeAnalysisHistoryProps = {
  analyses: ResumeAnalysisRecord[];
  activeId?: string | null;
  onSelect: (analysis: ResumeAnalysisRecord) => void;
};

export function ResumeAnalysisHistory({
  analyses,
  activeId,
  onSelect,
}: ResumeAnalysisHistoryProps) {
  if (analyses.length === 0) {
    return (
      <EmptyState
        title="No previous analyses"
        description="Upload a resume above to create your first analysis."
      />
    );
  }

  return (
    <div className="space-y-3">
      {analyses.map((analysis) => (
        <HistoryItem
          key={analysis.id}
          analysis={analysis}
          active={analysis.id === activeId}
          onSelect={() => onSelect(analysis)}
        />
      ))}
    </div>
  );
}

function HistoryItem({
  analysis,
  active,
  onSelect,
}: {
  analysis: ResumeAnalysisRecord;
  active: boolean;
  onSelect: () => void;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, startDelete] = useTransition();

  function handleConfirmDelete() {
    startDelete(async () => {
      await deleteResumeAnalysisAction(analysis.id);
      setConfirmOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <div
        className={cn(
          "flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-colors",
          active
            ? "border-violet-500/40 bg-violet-500/10"
            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
        )}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect();
        }}
        role="button"
        tabIndex={0}
        aria-current={active ? "true" : undefined}
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <ScoreRing score={analysis.score} size={56} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-100">
              {analysis.fileName}
            </p>
            <p className="text-xs text-zinc-500">
              {formatDate(analysis.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ChevronDown
            className={cn(
              "h-4 w-4 text-zinc-500 transition-transform",
              active && "rotate-180 text-violet-400",
            )}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmOpen(true);
            }}
            disabled={deleting}
            aria-label={`Delete analysis for ${analysis.fileName}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete analysis?"
        description={`The analysis for "${analysis.fileName}" will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
