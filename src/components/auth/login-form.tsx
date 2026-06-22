"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  credentialsSignInAction,
  type AuthActionState,
} from "@/server/actions/auth.actions";

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    credentialsSignInAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-4"
      aria-describedby={state.error ? "login-error" : undefined}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          aria-invalid={state.error ? true : undefined}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          aria-invalid={state.error ? true : undefined}
        />
      </div>
      {state.error ? (
        <FormAlert variant="error" id="login-error">
          {state.error}
        </FormAlert>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-sm text-zinc-500">
        No account?{" "}
        <Link
          href="/register"
          className="font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
