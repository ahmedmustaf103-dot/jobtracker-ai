import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          Sign in to your JobTracker AI account.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
