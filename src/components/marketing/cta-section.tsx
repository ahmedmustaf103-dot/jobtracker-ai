import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { SectionBadge } from "@/components/ui/section-badge";

const included = [
  "Unlimited application tracking",
  "Pipeline overview & status filters",
  "AI cover letter generator",
  "AI resume analyzer",
];

export function CtaSection() {
  const { currency, amount, interval, trialDays } = siteConfig.pricing;

  return (
    <section id="pricing" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-elevated to-surface-muted p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-violet-700/25 blur-[120px]" />

          <div className="relative">
            <SectionBadge variant="accent">Pricing</SectionBadge>

            <div className="mt-6 flex items-end justify-center gap-2">
              <span className="text-5xl font-bold tracking-tight text-zinc-50">
                {currency}
                {amount}
              </span>
              <span className="mb-1.5 text-zinc-400">/{interval}</span>
            </div>
            <p className="mt-3 text-zinc-400">
              One plan with everything included. Cancel anytime.
            </p>

            <ul className="mx-auto mt-8 grid max-w-md gap-3 text-left sm:grid-cols-2">
              {included.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-zinc-300"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/15">
                    <Check className="h-3 w-3 text-violet-300" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-xl px-7 shadow-xl shadow-violet-900/40">
                <Link href="/register">
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl px-7">
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              {trialDays}-day free trial · No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
