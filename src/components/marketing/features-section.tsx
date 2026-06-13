import { BarChart3, Briefcase, CalendarClock, Sparkles } from "lucide-react";

const features = [
  {
    icon: Briefcase,
    title: "Application Tracking",
    description:
      "Capture every role with company, salary, location, and notes. Move applications through a clear pipeline from wishlist to offer.",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: CalendarClock,
    title: "Interview Management",
    description:
      "Keep every interview stage organised. Track screening, technical rounds, and final calls so nothing slips through the cracks.",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Visualise your pipeline with live stats, status breakdowns, and response rates. Know exactly where you stand at a glance.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Sparkles,
    title: "AI Job Search Assistant",
    description:
      "Get smart follow-up reminders, tailored application tips, and next-step suggestions powered by AI to land offers faster.",
    gradient: "from-amber-500 to-orange-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-violet-300">
            Everything you need
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Built for a serious job search
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            A complete toolkit to manage your search like a pipeline — not a
            messy spreadsheet.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description, gradient }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div
                className={`absolute inset-x-0 -top-px h-px bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="h-6 w-6 text-white" />
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
