import { BarChart3, FileSearch, PenLine, Target } from "lucide-react";

import { SectionBadge } from "@/components/ui/section-badge";

const capabilities = [
  {
    icon: Target,
    title: "Pipeline tracking",
    description:
      "Log every role with company, salary, and notes. Move applications through a clear status workflow.",
  },
  {
    icon: BarChart3,
    title: "Search overview",
    description:
      "See totals, pipeline breakdown, and recent activity on a dashboard built for daily use.",
  },
  {
    icon: PenLine,
    title: "Cover letter generator",
    description:
      "Paste a job description and generate a tailored draft you can edit and save.",
  },
  {
    icon: FileSearch,
    title: "Resume analyzer",
    description:
      "Upload a PDF or DOCX for an ATS score, strengths, gaps, and keyword suggestions.",
  },
];

export function StatsSection() {
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/[0.12] via-white/[0.02] to-fuchsia-600/[0.1] p-10 sm:p-14">
          <div className="pointer-events-none absolute -left-20 top-0 h-60 w-60 rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-60 w-60 rounded-full bg-fuchsia-600/20 blur-[100px]" />

          <div className="relative mx-auto max-w-2xl text-center">
            <SectionBadge variant="accent">What you get</SectionBadge>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
              Everything in one workspace
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              Tracking, analytics, and AI tools designed to work together — not
              bolted on as afterthoughts.
            </p>
          </div>

          <div className="relative mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center sm:text-left">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 sm:mx-0">
                  <Icon className="h-5 w-5 text-violet-300" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-zinc-100">
                  {title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
