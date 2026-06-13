import { CheckCircle2 } from "lucide-react";

import { DashboardPreview } from "@/components/marketing/dashboard-preview";

const highlights = [
  "Real-time pipeline stats and offer-rate tracking",
  "Filter by status and update stages in one click",
  "Recent activity feed so you never lose momentum",
];

export function ShowcaseSection() {
  return (
    <section id="showcase" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-violet-300">
            Product tour
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            A dashboard that keeps you in control
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Everything about your search, in one beautifully organised view.
          </p>
        </div>

        <div className="relative">
          {/* Glow + glass frame */}
          <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-violet-600/20 via-transparent to-fuchsia-600/20 blur-3xl" />
          <div className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-2.5 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-4">
            <DashboardPreview />
          </div>
        </div>

        <ul className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          {highlights.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm text-zinc-300"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
