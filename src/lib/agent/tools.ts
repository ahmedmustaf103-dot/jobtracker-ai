import {
  SchemaType,
  type FunctionDeclaration,
} from "@google/generative-ai";

import type { AgentContext, AgentToolCallTrace } from "@/lib/agent/types";
import { searchRemoteJobs } from "@/lib/agent/remote-jobs";
import {
  createApplication,
  getApplicationStats,
  listApplications,
  updateApplicationStatus,
} from "@/server/services/applications.service";
import {
  saveApplicationArgsSchema,
  searchApplicationsArgsSchema,
  searchRemoteJobsArgsSchema,
  updateApplicationStatusArgsSchema,
} from "@/validations/agent";

export const AGENT_TOOL_DECLARATIONS: FunctionDeclaration[] = [
  {
    name: "search_remote_jobs",
    description:
      "Search a public remote job board for open roles matching a query (e.g. React, product designer, data engineer).",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: {
          type: SchemaType.STRING,
          description: "Keywords for title, company, or skills",
        },
        limit: {
          type: SchemaType.INTEGER,
          description: "Max results to return (1-10). Defaults to 5.",
          nullable: true,
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_pipeline_stats",
    description:
      "Get the user's application pipeline summary: totals by status and recent applications.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {},
    },
  },
  {
    name: "search_applications",
    description:
      "Search the user's tracked job applications by company/title text and optional status filter.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: {
          type: SchemaType.STRING,
          description: "Optional company or title keyword",
          nullable: true,
        },
        status: {
          type: SchemaType.STRING,
          description:
            "Optional status filter: WISHLIST, APPLIED, SCREENING, INTERVIEW, OFFER, REJECTED, WITHDRAWN",
          nullable: true,
        },
        limit: {
          type: SchemaType.INTEGER,
          description: "Max results (1-20). Defaults to 10.",
          nullable: true,
        },
      },
    },
  },
  {
    name: "save_application",
    description:
      "Create a new job application in the user's tracker. Prefer status WISHLIST unless the user already applied.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        company: { type: SchemaType.STRING, description: "Company name" },
        title: { type: SchemaType.STRING, description: "Job title" },
        location: {
          type: SchemaType.STRING,
          description: "Location or Remote",
          nullable: true,
        },
        url: {
          type: SchemaType.STRING,
          description: "Job posting URL",
          nullable: true,
        },
        salary: {
          type: SchemaType.STRING,
          description: "Salary text if known",
          nullable: true,
        },
        notes: {
          type: SchemaType.STRING,
          description: "Short note about the role",
          nullable: true,
        },
        status: {
          type: SchemaType.STRING,
          description:
            "WISHLIST, APPLIED, SCREENING, INTERVIEW, OFFER, REJECTED, or WITHDRAWN",
          nullable: true,
        },
      },
      required: ["company", "title"],
    },
  },
  {
    name: "update_application_status",
    description:
      "Update the status of an existing application. Requires a real applicationId from search_applications or get_pipeline_stats.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        applicationId: {
          type: SchemaType.STRING,
          description: "Application id from the tracker",
        },
        status: {
          type: SchemaType.STRING,
          description:
            "New status: WISHLIST, APPLIED, SCREENING, INTERVIEW, OFFER, REJECTED, or WITHDRAWN",
        },
      },
      required: ["applicationId", "status"],
    },
  },
];

function serializeApplication(app: {
  id: string;
  company: string;
  title: string;
  location: string | null;
  url: string | null;
  status: string;
  salary: string | null;
  updatedAt: Date;
}) {
  return {
    id: app.id,
    company: app.company,
    title: app.title,
    location: app.location,
    url: app.url,
    status: app.status,
    salary: app.salary,
    updatedAt: app.updatedAt.toISOString(),
  };
}

async function executeSearchRemoteJobs(args: unknown) {
  const parsed = searchRemoteJobsArgsSchema.safeParse(args);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid search arguments",
    };
  }

  try {
    const jobs = await searchRemoteJobs(parsed.data.query, parsed.data.limit);
    return {
      count: jobs.length,
      jobs,
      source: "remotive",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not search remote jobs right now.",
    };
  }
}

async function executeGetPipelineStats(ctx: AgentContext) {
  const stats = await getApplicationStats(ctx.userId);
  return {
    total: stats.total,
    byStatus: stats.byStatus,
    recent: stats.recent.map(serializeApplication),
  };
}

async function executeSearchApplications(ctx: AgentContext, args: unknown) {
  const parsed = searchApplicationsArgsSchema.safeParse(args);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid search arguments",
    };
  }

  const { query, status, limit } = parsed.data;
  const apps = await listApplications(ctx.userId, {
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
  return { count: results.length, applications: results };
}

async function executeSaveApplication(ctx: AgentContext, args: unknown) {
  const parsed = saveApplicationArgsSchema.safeParse(args);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid application data",
    };
  }

  const created = await createApplication(ctx.userId, {
    company: parsed.data.company,
    title: parsed.data.title,
    location: parsed.data.location,
    url: parsed.data.url,
    salary: parsed.data.salary,
    notes: parsed.data.notes,
    status: parsed.data.status,
  });

  return {
    saved: true,
    application: serializeApplication(created),
  };
}

async function executeUpdateApplicationStatus(
  ctx: AgentContext,
  args: unknown,
) {
  const parsed = updateApplicationStatusArgsSchema.safeParse(args);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid status update",
    };
  }

  const updated = await updateApplicationStatus(
    ctx.userId,
    parsed.data.applicationId,
    parsed.data.status,
  );

  if (!updated) {
    return { error: "Application not found for this user." };
  }

  return {
    updated: true,
    application: serializeApplication(updated),
  };
}

export async function executeAgentTool(
  name: string,
  args: Record<string, unknown>,
  ctx: AgentContext,
): Promise<AgentToolCallTrace> {
  let result: unknown;

  switch (name) {
    case "search_remote_jobs":
      result = await executeSearchRemoteJobs(args);
      break;
    case "get_pipeline_stats":
      result = await executeGetPipelineStats(ctx);
      break;
    case "search_applications":
      result = await executeSearchApplications(ctx, args);
      break;
    case "save_application":
      result = await executeSaveApplication(ctx, args);
      break;
    case "update_application_status":
      result = await executeUpdateApplicationStatus(ctx, args);
      break;
    default:
      result = { error: `Unknown tool: ${name}` };
  }

  return { name, args, result };
}
