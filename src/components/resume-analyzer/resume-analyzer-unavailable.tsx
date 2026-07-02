import Link from "next/link";
import { FileSearch } from "lucide-react";

import { GithubIcon } from "@/components/marketing/github-icon";
import { resumeAnalyzerDisabledMessage } from "@/config/features";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";

export function ResumeAnalyzerUnavailable() {
  return (
    <div className="space-y-6">
      <EmptyState
        icon={FileSearch}
        title="Resume analyzer unavailable"
        description={resumeAnalyzerDisabledMessage}
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/cover-letters">Try cover letter generator</Link>
          </Button>
        }
      />

      <Panel className="space-y-3 text-sm text-zinc-400">
        <p>
          Connect a Vercel Blob store to enable uploads in production, or run{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-zinc-300">
            npm run dev
          </code>{" "}
          locally for filesystem storage.
        </p>
        <Button asChild variant="ghost" size="sm" className="h-auto p-0 text-violet-300">
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
            <GithubIcon className="mr-1.5 inline h-4 w-4" />
            View setup in README
          </a>
        </Button>
      </Panel>
    </div>
  );
}
