import Link from "next/link";
import { ArrowRight, BarChart3, Briefcase, Sparkles } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Briefcase,
    title: "Track every application",
    description:
      "Organize roles by company, stage, and salary — from wishlist to offer.",
  },
  {
    icon: BarChart3,
    title: "Pipeline visibility",
    description:
      "See where you stand at a glance with status breakdowns and recent activity.",
  },
  {
    icon: Sparkles,
    title: "AI-assisted insights",
    description:
      "Smart follow-up reminders and application tips — coming in a future release.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-20 text-center sm:py-28">
        <p className="mb-4 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200">
          10-day build · Day 4 complete
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Land your next role with{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            {siteConfig.name}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          {siteConfig.description}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/register">
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 border-t border-zinc-200 py-16 dark:border-zinc-800 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
