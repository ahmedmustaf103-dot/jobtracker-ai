import type { Metadata } from "next";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { ResumeAnalyzerWorkspace } from "@/components/resume-analyzer/resume-analyzer-workspace";
import { getSession } from "@/lib/auth/session";
import {
  listResumeAnalyses,
  mapAnalysisFromDb,
} from "@/server/services/resumes.service";

export const metadata: Metadata = {
  title: "Resume Analyzer",
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
        title="AI Resume Analyzer"
        description="Upload your resume for an instant AI score, ATS tips, and keyword insights."
      />
      <ResumeAnalyzerWorkspace history={history} />
    </div>
  );
}
