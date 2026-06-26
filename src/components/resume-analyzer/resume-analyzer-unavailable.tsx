import Link from "next/link";
import { FileSearch, Github } from "lucide-react";

import { siteConfig } from "@/config/site";
import { resumeAnalyzerDisabledMessage } from "@/config/features";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";

export function ResumeAnalyzerUnavailable() {
  return (
    <div className="space-y-6">
      <EmptyState
        icon={FileSearch}
        title="Resume analyzer — local development only"
        description={resumeAnalyzerDisabledMessage}
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/cover-letters">Try cover letter generator</Link>
          </Button>
        }
      />

      <Panel className="space-y-3 text-sm text-zinc-400">
        <p>
          The live demo includes application tracking, dashboard analytics, and
          AI cover letters. Clone the repo and run{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-zinc-300">
            npm run dev
          </code>{" "}
          to test PDF/DOCX upload and ATS scoring locally.
        </p>
        <Button asChild variant="ghost" size="sm" className="h-auto p-0 text-violet-300">
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
            <Github className="mr-1.5 inline h-4 w-4" aria-hidden="true" />
            View source on GitHub
          </a>
        </Button>
      </Panel>
    </div>
  );
}
