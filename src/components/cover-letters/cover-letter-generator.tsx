"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/cover-letters/copy-button";
import {
  generateCoverLetterAction,
  updateCoverLetterAction,
  type CoverLetterActionState,
} from "@/server/actions/cover-letter.actions";

const initialState: CoverLetterActionState = {};

export function CoverLetterGenerator() {
  const [state, formAction, generating] = useActionState(
    generateCoverLetterAction,
    initialState,
  );

  const [draft, setDraft] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">(
    "idle",
  );
  const [saving, startSaving] = useTransition();

  // Load freshly generated content into the editable area.
  useEffect(() => {
    if (state.coverLetter && state.coverLetter.id !== activeId) {
      setDraft(state.coverLetter.content);
      setActiveId(state.coverLetter.id);
      setSaveState("idle");
    }
  }, [state.coverLetter, activeId]);

  function handleSave() {
    if (!activeId) return;
    startSaving(async () => {
      const result = await updateCoverLetterAction(activeId, draft);
      setSaveState(result.error ? "error" : "saved");
      setTimeout(() => setSaveState("idle"), 2500);
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input form */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-zinc-300">
                Company
              </Label>
              <Input
                id="company"
                name="company"
                required
                placeholder="Stripe"
                disabled={generating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-zinc-300">
                Role
              </Label>
              <Input
                id="role"
                name="role"
                required
                placeholder="Senior Frontend Engineer"
                disabled={generating}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription" className="text-zinc-300">
              Job description
            </Label>
            <Textarea
              id="jobDescription"
              name="jobDescription"
              required
              rows={10}
              placeholder="Paste the full job description here…"
              className="min-h-[220px] resize-y"
              disabled={generating}
            />
            <p className="text-xs text-zinc-500">
              The more detail you paste, the more tailored your letter will be.
            </p>
          </div>

          {state.error ? (
            <p
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
              role="alert"
            >
              {state.error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={generating}>
            <Sparkles className="h-4 w-4" />
            {generating ? "Generating…" : "Generate cover letter"}
          </Button>
        </form>
      </div>

      {/* Result */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-100">
            Your cover letter
          </h2>
          {draft ? <CopyButton value={draft} /> : null}
        </div>

        {generating ? (
          <div className="space-y-3" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-white/5"
                style={{ width: `${70 + ((i * 7) % 30)}%` }}
              />
            ))}
          </div>
        ) : draft ? (
          <div className="space-y-3">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={18}
              className="min-h-[420px] resize-y leading-relaxed"
              aria-label="Generated cover letter"
            />
            <div className="flex items-center justify-end gap-3">
              {saveState === "saved" ? (
                <span className="text-xs text-emerald-400">Saved</span>
              ) : null}
              {saveState === "error" ? (
                <span className="text-xs text-red-400">Couldn’t save</span>
              ) : null}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15">
              <Sparkles className="h-6 w-6 text-violet-300" />
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-300">
              Nothing here yet
            </p>
            <p className="mt-1 max-w-xs text-xs text-zinc-500">
              Fill in the details and generate a tailored cover letter in
              seconds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
