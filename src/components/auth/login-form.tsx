"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  credentialsSignInAction,
  type AuthActionState,
} from "@/server/actions/auth.actions";

const initialState: AuthActionState = {};

const inputClass =
  "border-white/10 bg-white/[0.04] text-zinc-100 shadow-none placeholder:text-zinc-500 focus-visible:ring-violet-500";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    credentialsSignInAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-zinc-300">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          className={inputClass}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-zinc-300">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={inputClass}
        />
      </div>
      {state.error ? (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
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
