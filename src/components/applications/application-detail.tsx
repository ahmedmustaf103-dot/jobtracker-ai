import Link from "next/link";
import { ExternalLink, MapPin, PenLine, Wallet } from "lucide-react";

import { AddApplicationNoteForm } from "@/components/applications/add-application-note-form";
import { ApplicationStatusSelect } from "@/components/applications/application-status-select";
import { ApplicationStatusTimeline } from "@/components/applications/application-status-timeline";
import { DeleteApplicationButton } from "@/components/applications/delete-application-button";
import { JobMatchPanel } from "@/components/applications/job-match-panel";
import { StatusBadge } from "@/components/applications/status-badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";
import type { getApplicationWithEvents } from "@/server/services/applications.service";

type ApplicationDetailProps = {
  application: NonNullable<
    Awaited<ReturnType<typeof getApplicationWithEvents>>
  >;
  hasResume: boolean;
  resumeFileName?: string | null;
  defaultJobDescription?: string;
  defaultJobDescriptionSource?: "notes" | "cover_letter" | null;
};

export function ApplicationDetail({
  application,
  hasResume,
  resumeFileName,
  defaultJobDescription = "",
  defaultJobDescriptionSource = null,
}: ApplicationDetailProps) {
  const coverLetterHref = `/cover-letters?company=${encodeURIComponent(application.company)}&role=${encodeURIComponent(application.title)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Panel>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={application.status} />
                <ApplicationStatusSelect
                  id={application.id}
                  status={application.status}
                />
              </div>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {application.location ? (
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      Location
                    </dt>
                    <dd className="mt-1 text-sm text-zinc-200">
                      {application.location}
                    </dd>
                  </div>
                ) : null}
                {application.salary ? (
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
                      <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
                      Salary
                    </dt>
                    <dd className="mt-1 text-sm text-zinc-200">
                      {application.salary}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Applied
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {formatDate(application.appliedAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Last updated
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {formatDate(application.updatedAt)}
                  </dd>
                </div>
              </dl>
              {application.url ? (
                <a
                  href={application.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300"
                >
                  View job posting
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        </Panel>

        {application.notes ? (
          <Panel>
            <h2 className="text-sm font-semibold text-zinc-100">Notes</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
              {application.notes}
            </p>
          </Panel>
        ) : null}

        <JobMatchPanel
          applicationId={application.id}
          company={application.company}
          role={application.title}
          hasResume={hasResume}
          resumeFileName={resumeFileName}
          defaultJobDescription={defaultJobDescription}
          defaultJobDescriptionSource={defaultJobDescriptionSource}
        />

        <Panel>
          <h2 className="text-sm font-semibold text-zinc-100">
            Activity timeline
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Status changes and notes are recorded automatically.
          </p>
          <div className="mt-5">
            <ApplicationStatusTimeline events={application.events} />
          </div>
        </Panel>
      </div>

      <aside className="space-y-6">
        <Panel>
          <h2 className="text-sm font-semibold text-zinc-100">Quick actions</h2>
          <div className="mt-4 flex flex-col gap-2">
            <Button asChild variant="outline" size="sm" className="justify-start">
              <Link href={`/applications/${application.id}/edit`}>
                Edit details
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="justify-start">
              <Link href={coverLetterHref}>
                <PenLine className="h-4 w-4" aria-hidden="true" />
                Draft cover letter
              </Link>
            </Button>
            <DeleteApplicationButton
              id={application.id}
              title={application.title}
              redirectTo="/applications"
            />
          </div>
        </Panel>

        <Panel>
          <AddApplicationNoteForm applicationId={application.id} />
        </Panel>
      </aside>
    </div>
  );
}
