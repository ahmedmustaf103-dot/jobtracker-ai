import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";
import { siteConfig } from "@/config/site";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <Panel className="shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          Free for {siteConfig.pricing.trialDays} days — set up in under a minute.
        </p>
      </div>
      <RegisterForm />
    </Panel>
  );
}
