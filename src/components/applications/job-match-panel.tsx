"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileSearch,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";

import { AnalysisSectionCard } from "@/components/resume-analyzer/analysis-section-card";
import { ScoreRing } from "@/components/resume-analyzer/score-ring";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FormAlert } from "@/components/ui/form-alert";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import {
  analyzeJobMatchAction,
  type JobMatchActionState,
} from "@/server/actions/job-match.actions";
import { recommendationLabel } from "@/validations/job-match";

type JobMatchPanelProps = {
  applicationId: string;
  company: string;
  role: string;
  hasResume: boolean;
  resumeFileName?: string | null;
  defaultJobDescription?: string;
  defaultJobDescriptionSource?: "notes" | "cover_letter" | null;
};

const initialState: JobMatchActionState = {};

export function JobMatchPanel({
  applicationId,
  company,
  role,
  hasResume,
  resumeFileName,
  defaultJobDescription = "",
  defaultJobDescriptionSource = null,
}: JobMatchPanelProps) {
  const [state, formAction, pending] = useActionState(
    analyzeJobMatchAction,
    initialState,
  );
  const [jobDescription, setJobDescription] = useState(defaultJobDescription);

  useEffect(() => {
    setJobDescription(defaultJobDescription);
  }, [defaultJobDescription]);

  const sourceHint = useMemo(() => {
    if (defaultJobDescriptionSource === "notes") {
      return "Prefilled from application notes — edit if needed.";
    }
    if (defaultJobDescriptionSource === "cover_letter") {
      return "Prefilled from a matching cover letter — edit if needed.";
    }
    return "Paste the full job description for the most accurate score.";
  }, [defaultJobDescriptionSource]);

  if (!hasResume) {
    return (
      <Panel>
        <h2 className="text-sm font-semibold text-zinc-100">AI Job Match</h2>
        <div className="mt-4">
          <EmptyState
            icon={FileSearch}
            title="Resume required"
            description="Upload a resume in Resume analyzer so we can compare it to this role."
            action={
              <Button asChild size="sm" variant="outline">
                <Link href="/resume-analyzer">Go to Resume analyzer</Link>
              </Button>
            }
          />
        </div>
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">AI Job Match</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Compare your latest resume
            {resumeFileName ? (
              <>
                {" "}
                (<span className="text-zinc-400">({resumeFileName})</span>
              </>
            ) : null}{" "}
            to {role} at {company}.
          </p>
        </div>
      </div>

      <form action={formAction} className="mt-5 space-y-4">
        <input type="hidden" name="applicationId" value={applicationId} />
        <div className="space-y-2">
          <Label htmlFor={`job-match-jd-${applicationId}`}>
            Job description
          </Label>
          <Textarea
            id={`job-match-jd-${applicationId}`}
            name="jobDescription"
            rows={8}
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the job description here…"
            className="min-h-[160px] resize-y"
            disabled={pending}
            required
          />
          <p className="text-xs text-zinc-500">{sourceHint}</p>
        </div>

        {state.error ? (
          <FormAlert variant="error">{state.error}</FormAlert>
        ) : null}

        <Button type="submit" disabled={pending || jobDescription.trim().length < 40}>
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Scoring match…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Score match
            </>
          )}
        </Button>
      </form>

      {pending && !state.match ? (
        <p className="mt-4 text-sm text-zinc-500">
          Analyzing resume against the job description…
        </p>
      ) : null}

      {state.match ? (
        <div className="mt-8 space-y-6 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
            <ScoreRing score={state.match.score} size={112} />
            <div className="text-center sm:text-left">
              <p className="text-2xl font-semibold tabular-nums text-zinc-50">
                {state.match.score}% Match
              </p>
              <p className="mt-1 text-sm font-medium text-violet-300">
                {recommendationLabel(state.match.recommendation)}
              </p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
                {state.match.summary}
              </p>
              {state.dataUsed ? (
                <p className="mt-2 text-xs text-zinc-600">
                  Resume: {state.dataUsed.resumeFileName} · JD source:{" "}
                  {state.dataUsed.jobDescriptionSource.replace("_", " ")}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AnalysisSectionCard
              title="Matching skills"
              items={state.match.matchingSkills}
              icon={CheckCircle2}
              tone="emerald"
              emptyMessage="No clear skill overlaps found in the resume."
            />
            <AnalysisSectionCard
              title="Potential gaps"
              items={state.match.missingOrWeakerSkills}
              icon={AlertTriangle}
              tone="amber"
              emptyMessage="No major skill gaps called out."
            />
            <AnalysisSectionCard
              title="Experience"
              items={
                state.match.experienceGaps.length > 0
                  ? state.match.experienceGaps
                  : ["Good alignment with the role's experience requirements."]
              }
              icon={Target}
              tone="sky"
            />
            <AnalysisSectionCard
              title="Strengths"
              items={state.match.strengths}
              icon={Sparkles}
              tone="violet"
              emptyMessage="No strengths returned."
            />
          </div>

          <Panel padding="sm" className="bg-white/[0.02]">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Scoring notes
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {state.match.scoringNotes}
            </p>
          </Panel>
        </div>
      ) : null}
    </Panel>
  );
}
