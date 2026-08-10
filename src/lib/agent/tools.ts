import {
  SchemaType,
  type FunctionDeclaration,
} from "@google/generative-ai";

import type { AgentContext, AgentToolCallTrace } from "@/lib/agent/types";
import {
  getApplicationsCapability,
  getPipelineStatsCapability,
  saveApplicationCapability,
  searchJobsCapability,
  updateApplicationStatusCapability,
} from "@/lib/capabilities/handlers";
import type { CapabilityResult } from "@/lib/capabilities/types";

export const AGENT_TOOL_DECLARATIONS: FunctionDeclaration[] = [
  {
    name: "search_remote_jobs",
    description:
      "Search live remote job listings matching a query (e.g. React, product designer, TypeScript). Returns only relevant roles with title, company, location, and URL.",
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

function toAgentResult<T>(result: CapabilityResult<T>): T | { error: string } {
  if (!result.ok) {
    return { error: result.error };
  }
  return result.data;
}

function toCapabilityUser(ctx: AgentContext) {
  return {
    userId: ctx.userId,
    candidateName: ctx.candidateName,
    email: "",
  };
}

export async function executeAgentTool(
  name: string,
  args: Record<string, unknown>,
  ctx: AgentContext,
): Promise<AgentToolCallTrace> {
  const user = toCapabilityUser(ctx);
  let result: unknown;

  switch (name) {
    case "search_remote_jobs":
      result = toAgentResult(await searchJobsCapability(args));
      break;
    case "get_pipeline_stats":
      result = toAgentResult(await getPipelineStatsCapability(user));
      break;
    case "search_applications":
      result = toAgentResult(await getApplicationsCapability(user, args));
      break;
    case "save_application":
      result = toAgentResult(await saveApplicationCapability(user, args));
      break;
    case "update_application_status":
      result = toAgentResult(
        await updateApplicationStatusCapability(user, args),
      );
      break;
    default:
      result = { error: `Unknown tool: ${name}` };
  }

  return { name, args, result };
}
