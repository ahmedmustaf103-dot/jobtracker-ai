import type { Metadata } from "next";

import { JobSearchAssistant } from "@/components/assistant/job-search-assistant";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export const metadata: Metadata = {
  title: "AI Assistant",
};

export default function AssistantPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        title="AI Job Search Assistant"
        description="An agent that searches remote jobs, inspects your pipeline, and updates applications with tool calls."
      />
      <JobSearchAssistant />
    </div>
  );
}
