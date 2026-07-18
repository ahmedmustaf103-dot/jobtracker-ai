"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Sparkles } from "lucide-react";

import { CopyButton } from "@/components/cover-letters/copy-button";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import {
  generateCoverLetterAction,
  updateCoverLetterAction,
  type CoverLetterActionState,
} from "@/server/actions/cover-letter.actions";

const initialState: CoverLetterActionState = {};

type CoverLetterGeneratorProps = {
  defaultCompany?: string;
  defaultRole?: string;
};

export function CoverLetterGenerator({
  defaultCompany,
  defaultRole,
}: CoverLetterGeneratorProps) {
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
      <Panel>
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                required
                defaultValue={defaultCompany}
                placeholder="Northwind Labs"
                disabled={generating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                required
                defaultValue={defaultRole}
                placeholder="Senior Frontend Engineer"
                disabled={generating}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job description</Label>
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
              Paste the full job posting for a detailed 4-paragraph letter (~300 words). More detail usually means a stronger, more specific draft.
            </p>
          </div>

          {state.error ? (
            <FormAlert variant="error">{state.error}</FormAlert>
          ) : null}

          <Button type="submit" className="w-full" disabled={generating}>
            <Sparkles className="h-4 w-4" />
            {generating ? "Generating…" : "Generate cover letter"}
          </Button>
        </form>
      </Panel>

      <Panel>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-zinc-100">
            Generated draft
          </h2>
          {draft ? <CopyButton value={draft} /> : null}
        </div>

        {generating ? (
          <div className="space-y-3" aria-busy="true" aria-label="Generating cover letter">
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
                <FormAlert variant="success" className="border-0 bg-transparent px-0 py-0 text-xs">
                  Changes saved
                </FormAlert>
              ) : null}
              {saveState === "error" ? (
                <FormAlert variant="error" className="border-0 bg-transparent px-0 py-0 text-xs">
                  Could not save changes
                </FormAlert>
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
          <EmptyState
            icon={Sparkles}
            title="No draft yet"
            description="Add the company, role, and job description, then generate your first letter."
            className="min-h-[420px] border-0 bg-transparent py-16"
          />
        )}
      </Panel>
    </div>
  );
}
