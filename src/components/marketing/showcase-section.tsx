import { CheckCircle2 } from "lucide-react";

import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { SectionBadge } from "@/components/ui/section-badge";

const highlights = [
  "Pipeline stats and status breakdown on your overview",
  "Filter applications by stage and update status inline",
  "Recent activity so you always know what changed",
];

export function ShowcaseSection() {
  return (
    <section id="showcase" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <SectionBadge>Product preview</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            A dashboard designed for daily use
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-400">
            Sample data shown below — your dashboard reflects your own pipeline
            as you add applications.
          </p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-violet-600/20 via-transparent to-fuchsia-600/20 blur-3xl" />
          <div className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-2.5 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-4">
            <DashboardPreview />
          </div>
        </div>

        <ul className="mx-auto mt-10 flex max-w-3xl flex-col items-start justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-2">
          {highlights.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm text-zinc-300"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-400" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
