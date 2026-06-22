import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { Button } from "@/components/ui/button";

const highlights = [
  { icon: Sparkles, label: "AI cover letters & resume analysis" },
  { icon: Zap, label: "Pipeline tracking from wishlist to offer" },
  { icon: ShieldCheck, label: "Free to start — no card required" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[140px] animate-pulse-glow" />
      <div className="pointer-events-none absolute right-0 top-40 h-[360px] w-[360px] rounded-full bg-fuchsia-700/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1.5 text-xs font-medium text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />
              Built for focused job searches
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
              Track every application{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-300 bg-clip-text text-transparent">
                from first apply to offer
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              One workspace for your pipeline, interview stages, and AI-assisted
              applications — without spreadsheets or scattered notes.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-xl px-6 shadow-xl shadow-violet-900/40">
                <Link href="/register">
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl px-6">
                <Link href="#showcase">See the product</Link>
              </Button>
            </div>

            <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2">
              {highlights.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-sm text-zinc-400"
                >
                  <Icon className="h-4 w-4 shrink-0 text-violet-400" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/10 blur-2xl" />
            <div className="relative animate-float">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
