import { isResumeAnalyzerEnabled } from "@/lib/resume/storage-config";

/**
 * Feature flags — client-safe resume flag mirrors server when explicitly enabled.
 * Dashboard layout passes the authoritative server value to navigation components.
 */
export const features = {
  resumeAnalyzer:
    process.env.NEXT_PUBLIC_RESUME_ANALYZER_ENABLED === "true" ||
    process.env.NODE_ENV === "development",
} as const;

export { isResumeAnalyzerEnabled };

export const resumeAnalyzerDisabledMessage =
  "Resume upload needs Vercel Blob in production. Add a Blob store and BLOB_READ_WRITE_TOKEN, or run locally to try the analyzer.";
