"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/form-alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  addApplicationNoteAction,
  type ApplicationActionState,
} from "@/server/actions/application.actions";

const initialState: ApplicationActionState = {};

type AddApplicationNoteFormProps = {
  applicationId: string;
};

export function AddApplicationNoteForm({
  applicationId,
}: AddApplicationNoteFormProps) {
  const [state, formAction, pending] = useActionState(
    addApplicationNoteAction.bind(null, applicationId),
    initialState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="timeline-note">Add a timeline note</Label>
        <Textarea
          id="timeline-note"
          name="note"
          rows={3}
          required
          placeholder="Recruiter replied, technical interview scheduled for Friday…"
          disabled={pending}
        />
      </div>
      {state.error ? <FormAlert variant="error">{state.error}</FormAlert> : null}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Add note"}
      </Button>
    </form>
  );
}
