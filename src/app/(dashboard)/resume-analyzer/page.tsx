import type { Metadata } from "next";

import { DashboardHeader } from "@/components/layout/dashboard-header";
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
