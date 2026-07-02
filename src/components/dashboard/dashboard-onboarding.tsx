import Link from "next/link";
import { Briefcase, FileSearch, PenLine } from "lucide-react";

import { isResumeAnalyzerEnabled } from "@/lib/resume/storage-config";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const allSteps = [
  {
    icon: Briefcase,
    title: "Add an application",
    description: "Log a role you're targeting and set its current stage.",
    href: "/applications/new",
    cta: "Add application",
  },
  {
    icon: PenLine,
    title: "Draft a cover letter",
    description: "Paste a job description and generate an editable first draft.",
    href: "/cover-letters",
    cta: "Open cover letters",
  },
  {
    icon: FileSearch,
    title: "Review your resume",
    description: "Upload a PDF or DOCX for ATS feedback and keyword suggestions.",
    href: "/resume-analyzer",
    cta: "Open resume analyzer",
  },
] as const;

const steps = allSteps.filter(
  (step) => step.href !== "/resume-analyzer" || isResumeAnalyzerEnabled(),
);

export function DashboardOnboarding() {
  return (
    <Card className="border-violet-500/20 bg-violet-500/[0.04]">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-zinc-100">
          Get started with {siteConfig.name}
        </CardTitle>
        <p className="text-sm leading-relaxed text-zinc-400">
          Choose where to begin — you can always come back to the others later.
        </p>
      </CardHeader>
      <CardContent>
        <ul
          className={`grid gap-4 ${steps.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}
        >
          {steps.map(({ icon: Icon, title, description, href, cta }) => (
            <li
              key={href}
              className="flex flex-col rounded-xl border border-white/10 bg-white/[0.02] p-5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15">
                <Icon className="h-4 w-4 text-violet-300" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-sm font-medium text-zinc-100">{title}</h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-zinc-500">
                {description}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                <Link href={href}>{cta}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
