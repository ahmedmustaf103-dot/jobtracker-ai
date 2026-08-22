import {
  capabilityUnknownError,
  capabilityValidationError,
} from "@/lib/capabilities/errors";
import { searchRemoteJobs } from "@/lib/agent/remote-jobs";
import {
  serializeApplication,
  serializeApplicationDetails,
} from "@/lib/capabilities/serialize";
import type {
  CapabilityResult,
  CapabilityUser,
} from "@/lib/capabilities/types";
import { generateCoverLetterText } from "@/lib/cover-letter/generate";
import { getGeminiErrorMessage } from "@/lib/gemini-errors";
import {
  createApplication,
  getApplicationStats,
  getApplicationWithEvents,
  listApplications,
  updateApplication,
  updateApplicationStatus,
} from "@/server/services/applications.service";
import { createCoverLetter } from "@/server/services/cover-letters.service";
import {
  generateCoverLetterArgsSchema,
  getApplicationDetailsArgsSchema,
  getApplicationsArgsSchema,
  saveApplicationArgsSchema,
  searchJobsArgsSchema,
  updateApplicationArgsSchema,
  updateApplicationStatusArgsSchema,
} from "@/validations/capabilities";

function validationError(message: string): CapabilityResult<never> {
  return capabilityValidationError(message);
}

function fromUnknownError(
  error: unknown,
  fallback: string,
): CapabilityResult<never> {
  return capabilityUnknownError(error, fallback);
}

export async function searchJobsCapability(
  args: unknown,
): Promise<CapabilityResult<{
  count: number;
  jobs: Awaited<ReturnType<typeof searchRemoteJobs>>["jobs"];
  source: string;
  note?: string;
}>> {
  const parsed = searchJobsArgsSchema.safeParse(args);
  if (!parsed.success) {
    return validationError(
      parsed.error.issues[0]?.message ?? "Invalid search arguments",
    );
  }

  try {
    const { jobs, source } = await searchRemoteJobs(
      parsed.data.query,
      parsed.data.limit,
    );
    return {
      ok: true,
      data: {
        count: jobs.length,
        jobs,
        source,
        note:
          jobs.length === 0
            ? "No relevant remote roles matched that query. Try a tighter skill keyword (e.g. React, Python, designer)."
            : undefined,
      },
    };
  } catch (error) {
    return fromUnknownError(error, "Could not search remote jobs right now.");
  }
}

export async function getPipelineStatsCapability(
  user: CapabilityUser,
): Promise<
  CapabilityResult<{
    total: number;
    byStatus: Record<string, number>;
    recent: ReturnType<typeof serializeApplication>[];
  }>
> {
  const stats = await getApplicationStats(user.userId);
  return {
    ok: true,
    data: {
      total: stats.total,
      byStatus: stats.byStatus,
      recent: stats.recent.map(serializeApplication),
    },
  };
}

export async function getApplicationsCapability(
  user: CapabilityUser,
  args: unknown,
): Promise<
  CapabilityResult<{
    count: number;
    applications: ReturnType<typeof serializeApplication>[];
  }>
> {
  const parsed = getApplicationsArgsSchema.safeParse(args);
  if (!parsed.success) {
    return validationError(
      parsed.error.issues[0]?.message ?? "Invalid search arguments",
    );
  }

  const { query, status, limit } = parsed.data;
  const apps = await listApplications(user.userId, {
    status,
    limit: query ? 50 : limit,
  });

  const needle = query?.trim().toLowerCase();
  const filtered = needle
    ? apps.filter(
        (app) =>
          app.company.toLowerCase().includes(needle) ||
          app.title.toLowerCase().includes(needle) ||
          (app.location?.toLowerCase().includes(needle) ?? false),
      )
    : apps;

  const results = filtered.slice(0, limit).map(serializeApplication);
  return { ok: true, data: { count: results.length, applications: results } };
}

export async function getApplicationDetailsCapability(
  user: CapabilityUser,
  args: unknown,
): Promise<
  CapabilityResult<{
    application: ReturnType<typeof serializeApplicationDetails>;
  }>
> {
  const parsed = getApplicationDetailsArgsSchema.safeParse(args);
  if (!parsed.success) {
    return validationError(
      parsed.error.issues[0]?.message ?? "Invalid application id",
    );
  }

  const application = await getApplicationWithEvents(
    user.userId,
    parsed.data.applicationId,
  );

  if (!application) {
    return { ok: false, error: "Application not found for this user." };
  }

  return {
    ok: true,
    data: { application: serializeApplicationDetails(application) },
  };
}

export async function saveApplicationCapability(
  user: CapabilityUser,
  args: unknown,
): Promise<
  CapabilityResult<{
    saved: true;
    application: ReturnType<typeof serializeApplication>;
  }>
> {
  const parsed = saveApplicationArgsSchema.safeParse(args);
  if (!parsed.success) {
    return validationError(
      parsed.error.issues[0]?.message ?? "Invalid application data",
    );
  }

  const created = await createApplication(user.userId, {
    company: parsed.data.company,
    title: parsed.data.title,
    location: parsed.data.location,
    url: parsed.data.url,
    salary: parsed.data.salary,
    notes: parsed.data.notes,
    status: parsed.data.status,
  });

  return {
    ok: true,
    data: { saved: true, application: serializeApplication(created) },
  };
}

export async function updateApplicationStatusCapability(
  user: CapabilityUser,
  args: unknown,
): Promise<
  CapabilityResult<{
    updated: true;
    application: ReturnType<typeof serializeApplication>;
  }>
> {
  const parsed = updateApplicationStatusArgsSchema.safeParse(args);
  if (!parsed.success) {
    return validationError(
      parsed.error.issues[0]?.message ?? "Invalid status update",
    );
  }

  const updated = await updateApplicationStatus(
    user.userId,
    parsed.data.applicationId,
    parsed.data.status,
  );

  if (!updated) {
    return { ok: false, error: "Application not found for this user." };
  }

  return {
    ok: true,
    data: { updated: true, application: serializeApplication(updated) },
  };
}

export async function updateApplicationCapability(
  user: CapabilityUser,
  args: unknown,
): Promise<
  CapabilityResult<{
    updated: true;
    application: ReturnType<typeof serializeApplication>;
  }>
> {
  const parsed = updateApplicationArgsSchema.safeParse(args);
  if (!parsed.success) {
    return validationError(
      parsed.error.issues[0]?.message ?? "Invalid application update",
    );
  }

  const existing = await getApplicationWithEvents(
    user.userId,
    parsed.data.applicationId,
  );

  if (!existing) {
    return { ok: false, error: "Application not found for this user." };
  }

  const next = {
    company: parsed.data.company ?? existing.company,
    title: parsed.data.title ?? existing.title,
    location:
      parsed.data.location !== undefined
        ? parsed.data.location
        : (existing.location ?? undefined),
    url: parsed.data.url !== undefined ? parsed.data.url : (existing.url ?? undefined),
    salary:
      parsed.data.salary !== undefined
        ? parsed.data.salary
        : (existing.salary ?? undefined),
    notes:
      parsed.data.notes !== undefined
        ? parsed.data.notes
        : (existing.notes ?? undefined),
    status: parsed.data.status ?? existing.status,
  };

  const updated = await updateApplication(
    user.userId,
    parsed.data.applicationId,
    next,
  );

  if (!updated) {
    return { ok: false, error: "Application not found for this user." };
  }

  return {
    ok: true,
    data: { updated: true, application: serializeApplication(updated) },
  };
}

export async function generateCoverLetterCapability(
  user: CapabilityUser,
  args: unknown,
): Promise<
  CapabilityResult<{
    saved: true;
    coverLetter: {
      id: string;
      company: string;
      role: string;
      content: string;
    };
  }>
> {
  const parsed = generateCoverLetterArgsSchema.safeParse(args);
  if (!parsed.success) {
    return validationError(
      parsed.error.issues[0]?.message ?? "Invalid cover letter input",
    );
  }

  try {
    const content = await generateCoverLetterText({
      company: parsed.data.company,
      role: parsed.data.role,
      jobDescription: parsed.data.jobDescription,
      candidateName: user.candidateName,
    });

    const saved = await createCoverLetter(user.userId, {
      company: parsed.data.company,
      role: parsed.data.role,
      jobDescription: parsed.data.jobDescription,
      content,
    });

    return {
      ok: true,
      data: {
        saved: true,
        coverLetter: {
          id: saved.id,
          company: saved.company,
          role: saved.role,
          content: saved.content,
        },
      },
    };
  } catch (error) {
    return { ok: false, error: getGeminiErrorMessage(error) };
  }
}
