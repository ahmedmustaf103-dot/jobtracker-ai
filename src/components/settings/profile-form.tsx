"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateProfileAction,
  type SettingsActionState,
} from "@/server/actions/settings.actions";

const initialState: SettingsActionState = {};

type ProfileFormProps = {
  defaultName: string;
  email: string;
};

export function ProfileForm({ defaultName, email }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Display name</Label>
        <Input
          id="name"
          name="name"
          required
          minLength={2}
          defaultValue={defaultName}
          placeholder="Alex Morgan"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} disabled />
        <p className="text-xs text-zinc-500">
          Email is tied to your sign-in and cannot be changed here.
        </p>
      </div>
      {state.error ? (
        <FormAlert variant="error">{state.error}</FormAlert>
      ) : null}
      {state.success ? (
        <FormAlert variant="success">{state.success}</FormAlert>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
