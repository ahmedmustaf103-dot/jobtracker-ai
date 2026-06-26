/**
 * Feature flags — values are inlined at build time in client bundles.
 */
export const features = {
  /**
   * Resume upload requires local disk or cloud storage (S3, Vercel Blob).
   * On by default in development; off in production unless explicitly enabled.
   */
  resumeAnalyzer:
    process.env.NEXT_PUBLIC_RESUME_ANALYZER_ENABLED === "true" ||
    process.env.NODE_ENV === "development",
} as const;

export const resumeAnalyzerDisabledMessage =
  "Resume upload is disabled on the live demo. File storage needs cloud storage on serverless hosts — run locally to try the full analyzer.";
