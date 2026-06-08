"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_ORDER,
  type ApplicationStatus,
} from "@/types";
import type { ApplicationActionState } from "@/server/actions/application.actions";

export type ApplicationFormValues = {
  company: string;
  title: string;
  location?: string | null;
  url?: string | null;
  status: ApplicationStatus;
  salary?: string | null;
  notes?: string | null;
};

type ApplicationFormProps = {
  action: (
    prevState: ApplicationActionState,
    formData: FormData,
  ) => Promise<ApplicationActionState>;
  submitLabel: string;
  defaultValues?: ApplicationFormValues;
};

const initialState: ApplicationActionState = {};

export function ApplicationForm({
  action,
  submitLabel,
  defaultValues,
}: ApplicationFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            name="company"
            required
            defaultValue={defaultValues?.company}
            placeholder="Acme Corp"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Job title *</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={defaultValues?.title}
            placeholder="Senior Engineer"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={defaultValues?.location ?? ""}
            placeholder="Remote"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            name="salary"
            defaultValue={defaultValues?.salary ?? ""}
            placeholder="$120k – $150k"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? "WISHLIST"}
          >
            {APPLICATION_STATUS_ORDER.map((status) => (
              <option key={status} value={status}>
                {APPLICATION_STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">Job posting URL</Label>
          <Input
            id="url"
            name="url"
            type="url"
            defaultValue={defaultValues?.url ?? ""}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={defaultValues?.notes ?? ""}
          placeholder="Interview prep, recruiter name, etc."
        />
      </div>

      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
