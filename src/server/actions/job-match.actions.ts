"use server";

import { requireSession } from "@/lib/auth/session";
import { analyzeJobMatchCapability } from "@/lib/capabilities/handlers";
import { rateLimit, rateLimitMessage } from "@/lib/rate-limit";
import type { JobDescriptionSource } from "@/lib/job-match/resolve-jd";
import type { JobMatchResult } from "@/validations/job-match";

export type JobMatchActionState = {
  error?: string;
  match?: JobMatchResult;
  dataUsed?: {
    resumeFileName: string;
    jobDescriptionSource: JobDescriptionSource;
  };
};

export async function analyzeJobMatchAction(
  _prev: JobMatchActionState,
  formData: FormData,
): Promise<JobMatchActionState> {
  const session = await requireSession();

  const limited = rateLimit(
    `job-match:${session.user.id}`,
    15,
    60 * 60 * 1000,
  );
  if (!limited.ok) {
    return { error: rateLimitMessage(limited.retryAfterSec) };
  }

  const applicationId = String(formData.get("applicationId") ?? "");
  const jobDescriptionRaw = formData.get("jobDescription");
  const jobDescription =
    typeof jobDescriptionRaw === "string" && jobDescriptionRaw.trim()
      ? jobDescriptionRaw
      : undefined;

  const result = await analyzeJobMatchCapability(
    {
      userId: session.user.id,
      candidateName: session.user.name?.trim() || "the candidate",
      email: session.user.email ?? "",
    },
    { applicationId, jobDescription },
  );

  if (!result.ok) {
    return { error: result.error };
  }

  return {
    match: result.data.match,
    dataUsed: result.data.dataUsed,
  };
}
