import { BarChart3, Briefcase, CalendarClock, Sparkles } from "lucide-react";

import { isResumeAnalyzerEnabled } from "@/lib/resume/storage-config";
import { SectionBadge } from "@/components/ui/section-badge";

const featureCards = [
  {
    icon: Briefcase,
    title: "Application tracking",
    description:
      "Capture every role with company, salary, location, and notes. Move applications through a clear pipeline from wishlist to offer.",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: CalendarClock,
    title: "Interview stages",
    description:
      "Track screening, technical rounds, and final calls in one place so follow-ups and deadlines stay visible.",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Search overview",
    description:
      "Totals, pipeline breakdown, and recent activity give you a clear picture of progress without manual reporting.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Sparkles,
    title: "AI application tools",
    description: isResumeAnalyzerEnabled()
      ? "Generate cover letters from job descriptions and analyse resumes for ATS readiness, keywords, and improvements."
      : "Generate tailored cover letters from job descriptions with Google Gemini — editable drafts you can save per role.",
    gradient: "from-amber-500 to-orange-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionBadge>Core features</SectionBadge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Built for a serious job search
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-400">
            A focused toolkit to manage your search like a pipeline — not a
            messy spreadsheet.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map(({ icon: Icon, title, description, gradient }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div
                className={`absolute inset-x-0 -top-px h-px bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
              >
                <Icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-zinc-50">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
