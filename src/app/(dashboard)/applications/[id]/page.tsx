import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ApplicationDetail } from "@/components/applications/application-detail";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
import { resolveJobDescription } from "@/lib/job-match/resolve-jd";
import { getSession } from "@/lib/auth/session";
import { getApplicationWithEvents } from "@/server/services/applications.service";
import { findLatestCoverLetterJobDescription } from "@/server/services/cover-letters.service";
import { getLatestResume } from "@/server/services/resumes.service";

type ApplicationDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ApplicationDetailPageProps): Promise<Metadata> {
  const session = await getSession();
  const userId = session?.user?.id;
  const { id } = await params;

  if (!userId) {
    return { title: "Application" };
  }

  const application = await getApplicationWithEvents(userId, id);
  if (!application) {
    return { title: "Application" };
  }

  return {
    title: `${application.title} · ${application.company}`,
  };
}

export default async function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return null;

  const { id } = await params;
  const application = await getApplicationWithEvents(userId, id);
  if (!application) notFound();

  const [resume, cover] = await Promise.all([
    getLatestResume(userId),
    findLatestCoverLetterJobDescription(
      userId,
      application.company,
      application.title,
    ),
  ]);

  const resolved = resolveJobDescription({
    notes: application.notes,
    coverLetterJobDescription: cover?.jobDescription,
  });

  const hasResume = Boolean(
    resume?.extractedText && resume.extractedText.trim().length >= 50,
  );

  return (
    <div className="space-y-8">
      <DashboardHeader
        title={application.title}
        description={application.company}
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/applications">Back to list</Link>
        </Button>
      </DashboardHeader>
      <ApplicationDetail
        application={application}
        hasResume={hasResume}
        resumeFileName={resume?.fileName}
        defaultJobDescription={resolved?.text ?? ""}
        defaultJobDescriptionSource={
          resolved?.source === "paste" ? null : (resolved?.source ?? null)
        }
      />
    </div>
  );
}
