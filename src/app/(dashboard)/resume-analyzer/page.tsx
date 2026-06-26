import type { Metadata } from "next";

import { features } from "@/config/features";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { ResumeAnalyzerUnavailable } from "@/components/resume-analyzer/resume-analyzer-unavailable";
import { ResumeAnalyzerWorkspace } from "@/components/resume-analyzer/resume-analyzer-workspace";
import { getSession } from "@/lib/auth/session";
import {
  listResumeAnalyses,
  mapAnalysisFromDb,
} from "@/server/services/resumes.service";

export const metadata: Metadata = {
  title: "Resume analyzer",
};

export default async function ResumeAnalyzerPage() {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  if (!features.resumeAnalyzer) {
    return (
      <div className="space-y-8">
        <DashboardHeader
          title="Resume analyzer"
          description="Available when running locally — the live demo focuses on tracking and cover letters."
        />
        <ResumeAnalyzerUnavailable />
      </div>
    );
  }

  const records = await listResumeAnalyses(userId);
  const history = records.map(mapAnalysisFromDb);

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Resume analyzer"
        description="Upload a PDF or DOCX for an ATS score, keyword gaps, and improvement suggestions."
      />
      <ResumeAnalyzerWorkspace history={history} />
    </div>
  );
}
