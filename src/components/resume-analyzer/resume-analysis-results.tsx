"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Search,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";

import { AnalysisSectionCard } from "@/components/resume-analyzer/analysis-section-card";
import { ScoreRing } from "@/components/resume-analyzer/score-ring";
import type { ResumeAnalysisRecord } from "@/types/resume";

type ResumeAnalysisResultsProps = {
  analysis: ResumeAnalysisRecord;
};

export function ResumeAnalysisResults({ analysis }: ResumeAnalysisResultsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-violet-600/10 via-white/[0.02] to-fuchsia-600/10 p-8 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="text-xs font-medium uppercase tracking-wider text-violet-300">
            Overall resume score
          </p>
          <h3 className="mt-2 text-xl font-semibold text-zinc-50">
            {analysis.fileName}
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            AI-powered analysis of structure, content, and ATS readiness.
          </p>
        </div>
        <ScoreRing score={analysis.score} size={132} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AnalysisSectionCard
          title="Strengths"
          items={analysis.strengths}
          icon={CheckCircle2}
          tone="emerald"
        />
        <AnalysisSectionCard
          title="Weaknesses"
          items={analysis.weaknesses}
          icon={AlertTriangle}
          tone="amber"
        />
        <AnalysisSectionCard
          title="Missing skills"
          items={analysis.missingSkills}
          icon={Target}
          tone="rose"
          emptyMessage="No obvious skill gaps detected."
        />
        <AnalysisSectionCard
          title="ATS optimization"
          items={analysis.atsSuggestions}
          icon={Search}
          tone="sky"
        />
        <AnalysisSectionCard
          title="Recommended improvements"
          items={analysis.improvements}
          icon={Wrench}
          tone="violet"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-300">
            <Sparkles className="h-5 w-5" />
          </span>
          <h3 className="text-sm font-semibold text-zinc-100">
            Keyword analysis
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <KeywordGroup
            label="Present"
            keywords={analysis.keywords.present}
            chipClass="bg-emerald-500/15 text-emerald-300 ring-emerald-500/25"
          />
          <KeywordGroup
            label="Missing"
            keywords={analysis.keywords.missing}
            chipClass="bg-rose-500/15 text-rose-300 ring-rose-500/25"
          />
          <KeywordGroup
            label="Recommended"
            keywords={analysis.keywords.recommended}
            chipClass="bg-violet-500/15 text-violet-300 ring-violet-500/25"
          />
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-xs text-zinc-400">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
        Edit your extracted resume text below and re-analyze after making
        improvements to track your score over time.
      </div>
    </div>
  );
}

function KeywordGroup({
  label,
  keywords,
  chipClass,
}: {
  label: string;
  keywords: string[];
  chipClass: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      {keywords.length === 0 ? (
        <p className="text-sm text-zinc-500">None identified</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <span
              key={kw}
              className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${chipClass}`}
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
