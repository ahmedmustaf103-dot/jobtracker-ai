import Link from "next/link";
import { ArrowRight, Play, ShieldCheck, Sparkles, Star } from "lucide-react";

import { DashboardPreview } from "@/components/marketing/dashboard-preview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[140px] animate-pulse-glow" />
      <div className="pointer-events-none absolute right-0 top-40 h-[360px] w-[360px] rounded-full bg-fuchsia-700/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1.5 text-xs font-medium text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered job search, organised
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
              Track Every Job Application{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-300 bg-clip-text text-transparent">
                From Application to Offer
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              Manage applications, interviews, rejections, and offers in one
              place. Stay organised and land your next role faster.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-900/40 transition-transform hover:scale-[1.03]"
              >
                Start Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#showcase"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-zinc-100 backdrop-blur transition-colors hover:bg-white/[0.07]"
              >
                <Play className="h-4 w-4" />
                View Demo
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["from-violet-500 to-fuchsia-500", "from-sky-500 to-cyan-500", "from-emerald-500 to-teal-500", "from-amber-500 to-orange-500"].map(
                    (g, i) => (
                      <span
                        key={i}
                        className={`h-8 w-8 rounded-full border-2 border-[#0A0A0A] bg-gradient-to-br ${g}`}
                      />
                    ),
                  )}
                </div>
                <p className="text-sm text-zinc-400">
                  <span className="font-semibold text-zinc-100">12,000+</span>{" "}
                  job seekers
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="ml-1 text-sm text-zinc-400">4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                No credit card
              </div>
            </div>
          </div>

          {/* Right */}
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
