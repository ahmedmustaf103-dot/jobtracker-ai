/**
 * JobTracker AI MCP server (stdio).
 * Reuses existing capability handlers / Prisma services — no duplicated business logic.
 *
 * Run: npm run mcp
 * Auth: MCP_USER_ID or MCP_USER_EMAIL (local trusted process only)
 */

import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";

import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";

import {
  McpAuthError,
  resolveMcpUser,
} from "../../src/lib/capabilities/auth-context";
import {
  generateCoverLetterCapability,
  getApplicationDetailsCapability,
  getApplicationsCapability,
  getPipelineStatsCapability,
  saveApplicationCapability,
  searchJobsCapability,
  updateApplicationCapability,
} from "../../src/lib/capabilities/handlers";
import type { CapabilityUser } from "../../src/lib/capabilities/types";
import { fromCapabilityResult, toolError } from "./format";

// Load local env files without overriding vars already set by the MCP host.
loadEnv({ path: resolve(process.cwd(), ".env") });
loadEnv({ path: resolve(process.cwd(), ".env.local") });

const applicationStatusEnum = z.enum([
  "WISHLIST",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
]);

let cachedUser: CapabilityUser | null = null;

async function requireUser(): Promise<CapabilityUser> {
  if (!cachedUser) {
    cachedUser = await resolveMcpUser();
  }
  return cachedUser;
}

function createServer() {
  const server = new McpServer({
    name: "jobtracker-ai",
    version: "0.1.0",
  });

  server.registerTool(
    "search_jobs",
    {
      title: "Search remote jobs",
      description:
        "Search live remote job listings (Jobicy, with Remotive fallback). Returns relevant roles with title, company, location, and URL.",
      inputSchema: z.object({
        query: z
          .string()
          .trim()
          .min(1)
          .max(120)
          .describe("Keywords for title, skills, or role"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(10)
          .optional()
          .describe("Max results (1-10). Defaults to 5."),
      }),
    },
    async (args) => fromCapabilityResult(await searchJobsCapability(args)),
  );

  server.registerTool(
    "get_application_details",
    {
      title: "Get application details",
      description:
        "Get a tracked JobTracker application (and timeline events) by id for the authenticated MCP user. Does not fetch remote job-board postings.",
      inputSchema: z.object({
        applicationId: z
          .string()
          .trim()
          .min(1)
          .max(64)
          .describe("Application id from get_applications or the tracker"),
      }),
    },
    async (args) => {
      try {
        const user = await requireUser();
        return fromCapabilityResult(
          await getApplicationDetailsCapability(user, args),
        );
      } catch (error) {
        return toolError(
          error instanceof McpAuthError
            ? error.message
            : "Failed to load application details.",
        );
      }
    },
  );

  server.registerTool(
    "get_applications",
    {
      title: "List applications",
      description:
        "List or search the authenticated user's tracked job applications.",
      inputSchema: z.object({
        query: z
          .string()
          .trim()
          .max(120)
          .optional()
          .describe("Optional company or title keyword"),
        status: applicationStatusEnum
          .optional()
          .describe("Optional status filter"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(20)
          .optional()
          .describe("Max results (1-20). Defaults to 10."),
      }),
    },
    async (args) => {
      try {
        const user = await requireUser();
        return fromCapabilityResult(
          await getApplicationsCapability(user, args),
        );
      } catch (error) {
        return toolError(
          error instanceof McpAuthError
            ? error.message
            : "Failed to list applications.",
        );
      }
    },
  );

  server.registerTool(
    "generate_cover_letter",
    {
      title: "Generate cover letter",
      description:
        "Generate a tailored cover letter with Gemini and save it for the authenticated user (same behaviour as the app UI).",
      inputSchema: z.object({
        company: z.string().trim().min(1).max(120),
        role: z.string().trim().min(1).max(120),
        jobDescription: z
          .string()
          .trim()
          .min(40)
          .max(8000)
          .describe("Full job description text"),
      }),
    },
    async (args) => {
      try {
        const user = await requireUser();
        return fromCapabilityResult(
          await generateCoverLetterCapability(user, args),
        );
      } catch (error) {
        return toolError(
          error instanceof McpAuthError
            ? error.message
            : "Failed to generate cover letter.",
        );
      }
    },
  );

  server.registerTool(
    "update_application",
    {
      title: "Update application",
      description:
        "Update fields on an existing application owned by the authenticated user. Provide applicationId plus at least one field (company, title, location, url, salary, notes, status).",
      inputSchema: z.object({
        applicationId: z.string().trim().min(1).max(64),
        company: z.string().trim().min(1).max(120).optional(),
        title: z.string().trim().min(1).max(120).optional(),
        location: z.string().trim().max(120).optional(),
        url: z.string().trim().url().max(500).optional(),
        salary: z.string().trim().max(80).optional(),
        notes: z.string().trim().max(5000).optional(),
        status: applicationStatusEnum.optional(),
      }),
    },
    async (args) => {
      try {
        const user = await requireUser();
        return fromCapabilityResult(
          await updateApplicationCapability(user, args),
        );
      } catch (error) {
        return toolError(
          error instanceof McpAuthError
            ? error.message
            : "Failed to update application.",
        );
      }
    },
  );

  server.registerTool(
    "save_application",
    {
      title: "Save application",
      description:
        "Create a new tracked application for the authenticated user (wishlist by default).",
      inputSchema: z.object({
        company: z.string().trim().min(1).max(120),
        title: z.string().trim().min(1).max(120),
        location: z.string().trim().max(120).optional(),
        url: z.string().trim().url().max(500).optional(),
        salary: z.string().trim().max(80).optional(),
        notes: z.string().trim().max(2000).optional(),
        status: applicationStatusEnum.optional(),
      }),
    },
    async (args) => {
      try {
        const user = await requireUser();
        return fromCapabilityResult(
          await saveApplicationCapability(user, args),
        );
      } catch (error) {
        return toolError(
          error instanceof McpAuthError
            ? error.message
            : "Failed to save application.",
        );
      }
    },
  );

  server.registerTool(
    "get_pipeline_stats",
    {
      title: "Pipeline stats",
      description:
        "Get the authenticated user's application pipeline totals by status and recent applications.",
      inputSchema: z.object({}),
    },
    async () => {
      try {
        const user = await requireUser();
        return fromCapabilityResult(await getPipelineStatsCapability(user));
      } catch (error) {
        return toolError(
          error instanceof McpAuthError
            ? error.message
            : "Failed to load pipeline stats.",
        );
      }
    },
  );

  return server;
}

serveStdio(createServer);

process.stderr.write(
  "[jobtracker-ai-mcp] stdio server ready (configure MCP_USER_ID or MCP_USER_EMAIL)\n",
);
