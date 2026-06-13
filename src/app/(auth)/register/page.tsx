import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          Start tracking applications in under a minute.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
