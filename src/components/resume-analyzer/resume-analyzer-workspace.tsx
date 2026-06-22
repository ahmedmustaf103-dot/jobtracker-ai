"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";

import { ResumeAnalysisHistory } from "@/components/resume-analyzer/resume-analysis-history";
import { ResumeAnalysisResults } from "@/components/resume-analyzer/resume-analysis-results";
import { ResumeUploadZone } from "@/components/resume-analyzer/resume-upload-zone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getResumeExtractedTextAction,
  reanalyzeResumeAction,
  uploadAndAnalyzeResumeAction,
  type ResumeAnalyzerState,
} from "@/server/actions/resume.actions";
import type { ResumeAnalysisRecord } from "@/types/resume";

const initialState: ResumeAnalyzerState = {};

type ResumeAnalyzerWorkspaceProps = {
  history: ResumeAnalysisRecord[];
};

export function ResumeAnalyzerWorkspace({ history }: ResumeAnalyzerWorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, uploadAction, uploading] = useActionState(
    uploadAndAnalyzeResumeAction,
    initialState,
  );
  const [reanalyzeState, reanalyzeAction, reanalyzing] = useActionState(
    reanalyzeResumeAction,
    initialState,
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeAnalysis, setActiveAnalysis] =
    useState<ResumeAnalysisRecord | null>(history[0] ?? null);
  const [extractedText, setExtractedText] = useState("");
  const [resumeId, setResumeId] = useState<string | null>(
    history[0]?.resumeId ?? null,
  );
  const [loadingText, setLoadingText] = useState(false);

  const busy = uploading || reanalyzing;

  useEffect(() => {
    if (uploadState.analysis) {
      setActiveAnalysis(uploadState.analysis);
      setExtractedText(uploadState.extractedText ?? "");
      setResumeId(uploadState.resumeId ?? null);
    }
  }, [uploadState]);

  useEffect(() => {
    if (reanalyzeState.analysis) {
      setActiveAnalysis(reanalyzeState.analysis);
      setExtractedText(reanalyzeState.extractedText ?? "");
      setResumeId(reanalyzeState.resumeId ?? null);
    }
  }, [reanalyzeState]);

  useEffect(() => {
    const initial = history[0];
    if (!initial) return;

    let cancelled = false;
    setLoadingText(true);

    getResumeExtractedTextAction(initial.resumeId).then((result) => {
      if (cancelled) return;
      if (result.text) {
        setExtractedText(result.text);
        setResumeId(initial.resumeId);
      }
      setLoadingText(false);
    });

    return () => {
      cancelled = true;
    };
  }, [history]);

  function handleFileSelect(file: File) {
    setSelectedFile(file);
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
    }
  }

  async function handleSelectHistory(analysis: ResumeAnalysisRecord) {
    setActiveAnalysis(analysis);
    setResumeId(analysis.resumeId);
    setLoadingText(true);
    setExtractedText("");

    const result = await getResumeExtractedTextAction(analysis.resumeId);
    if (result.text) {
      setExtractedText(result.text);
    }
    setLoadingText(false);
  }

  const error = uploadState.error || reanalyzeState.error;
  const success = uploadState.success || reanalyzeState.success;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">
              Upload resume
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              PDF or DOCX — we extract text and run an AI analysis.
            </p>
          </div>

          <form action={uploadAction} className="space-y-4">
            <ResumeUploadZone
              onFileSelect={handleFileSelect}
              disabled={busy}
              selectedFileName={selectedFile?.name}
            />
            <input
              ref={fileInputRef}
              type="file"
              name="resume"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              tabIndex={-1}
            />

            {error && !busy ? (
              <p
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            {success && !busy ? (
              <p
                className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
                role="status"
              >
                {success}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={busy || !selectedFile}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing resume…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze resume
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {busy ? (
            <AnalysisSkeleton />
          ) : activeAnalysis ? (
            <ResumeAnalysisResults analysis={activeAnalysis} />
          ) : (
            <EmptyResults />
          )}
        </div>
      </div>

      {resumeId && (extractedText || loadingText) ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-zinc-100">
              Edit & re-analyze
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Tweak your resume text and run a fresh analysis.
            </p>
          </div>
          {loadingText ? (
            <p className="text-sm text-zinc-500" aria-live="polite">
              Loading resume text…
            </p>
          ) : (
            <form action={reanalyzeAction} className="space-y-4">
              <input type="hidden" name="resumeId" value={resumeId} />
              <div className="space-y-2">
                <Label htmlFor="extractedText" className="text-zinc-300">
                  Extracted resume text
                </Label>
                <Textarea
                  id="extractedText"
                  name="extractedText"
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  rows={12}
                  className="min-h-[280px] resize-y font-mono text-xs leading-relaxed"
                  disabled={busy}
                />
              </div>
              <Button type="submit" variant="outline" disabled={busy}>
                {reanalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Re-analyzing…
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Re-analyze
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-zinc-300">
          Previous analyses
        </h2>
        <ResumeAnalysisHistory
          analyses={history}
          activeId={activeAnalysis?.id}
          onSelect={handleSelectHistory}
        />
      </section>
    </div>
  );
}

function EmptyResults() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15">
        <Sparkles className="h-7 w-7 text-violet-300" />
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-300">
        Your analysis will appear here
      </p>
      <p className="mt-1 max-w-xs text-xs text-zinc-500">
        Upload a resume to receive your score, strengths, ATS tips, and keyword
        insights.
      </p>
    </div>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Analyzing resume">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:flex-row sm:justify-between">
        <div className="space-y-3">
          <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
          <div className="h-6 w-48 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-64 animate-pulse rounded bg-white/5" />
        </div>
        <div className="h-[132px] w-[132px] animate-pulse rounded-full bg-white/10" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
    </div>
  );
}
