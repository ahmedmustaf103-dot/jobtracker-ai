import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <Panel className="shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Sign in
        </h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          Access your applications, pipeline, and AI tools.
        </p>
      </div>
      <LoginForm />
    </Panel>
  );
}
