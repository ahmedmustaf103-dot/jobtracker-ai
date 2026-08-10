/**
 * Verify the JobTracker MCP stdio server:
 * - starts
 * - lists tools
 * - exercises each tool (with MCP_USER_EMAIL / MCP_USER_ID)
 *
 * Usage: node scripts/verify-mcp.mjs
 */

import { config as loadEnv } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
loadEnv({ path: resolve(root, ".env") });
loadEnv({ path: resolve(root, ".env.local"), override: true });

const results = [];

function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`${mark}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function callTool(client, name, args = {}) {
  return client.callTool({ name, arguments: args });
}

function textPayload(result) {
  const text = result.content?.find((c) => c.type === "text")?.text ?? "";
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function main() {
  if (!process.env.MCP_USER_ID && !process.env.MCP_USER_EMAIL) {
    process.env.MCP_USER_EMAIL = "demo@jobtracker.ai";
    console.log("Using default MCP_USER_EMAIL=demo@jobtracker.ai");
  }

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "mcp/src/server.ts"],
    cwd: root,
    env: {
      ...process.env,
      MCP_USER_EMAIL: process.env.MCP_USER_EMAIL,
      MCP_USER_ID: process.env.MCP_USER_ID,
    },
    stderr: "pipe",
  });

  transport.stderr?.on("data", (chunk) => {
    process.stderr.write(chunk);
  });

  const client = new Client({ name: "jobtracker-mcp-verify", version: "0.1.0" });

  try {
    await client.connect(transport);
    record("MCP server starts / client connects", true);

    const listed = await client.listTools();
    const names = (listed.tools ?? []).map((t) => t.name).sort();
    const expected = [
      "generate_cover_letter",
      "get_application_details",
      "get_applications",
      "get_pipeline_stats",
      "save_application",
      "search_jobs",
      "update_application",
    ];
    const hasAll = expected.every((n) => names.includes(n));
    record(
      "Discover available tools",
      hasAll && names.length === expected.length,
      names.join(", "),
    );

    for (const tool of listed.tools ?? []) {
      const hasDesc = Boolean(tool.description && tool.description.length > 10);
      const hasSchema = Boolean(tool.inputSchema);
      record(
        `Tool schema: ${tool.name}`,
        hasDesc && hasSchema,
        hasDesc ? "description + inputSchema" : "missing description",
      );
    }

    const search = await callTool(client, "search_jobs", {
      query: "react",
      limit: 3,
    });
    const searchData = textPayload(search);
    record(
      "search_jobs works",
      !search.isError && typeof searchData.count === "number",
      `count=${searchData.count} source=${searchData.source}`,
    );

    const apps = await callTool(client, "get_applications", { limit: 5 });
    const appsData = textPayload(apps);
    record(
      "get_applications works",
      !apps.isError && Array.isArray(appsData.applications),
      `count=${appsData.count}`,
    );

    const stats = await callTool(client, "get_pipeline_stats", {});
    const statsData = textPayload(stats);
    record(
      "get_pipeline_stats works",
      !stats.isError && typeof statsData.total === "number",
      `total=${statsData.total}`,
    );

    let applicationId = appsData.applications?.[0]?.id;
    if (!applicationId) {
      const saved = await callTool(client, "save_application", {
        company: "MCP Verify Co",
        title: "Verification Engineer",
        status: "WISHLIST",
        notes: "Created by scripts/verify-mcp.mjs",
      });
      const savedData = textPayload(saved);
      applicationId = savedData.application?.id;
      record(
        "save_application works",
        !saved.isError && Boolean(applicationId),
        applicationId ?? savedData.error,
      );
    } else {
      record("save_application works", true, "skipped (existing apps present)");
    }

    const details = await callTool(client, "get_application_details", {
      applicationId,
    });
    const detailsData = textPayload(details);
    record(
      "get_application_details works",
      !details.isError && detailsData.application?.id === applicationId,
      applicationId,
    );

    const updated = await callTool(client, "update_application", {
      applicationId,
      notes: `MCP verify note ${new Date().toISOString()}`,
    });
    const updatedData = textPayload(updated);
    record(
      "update_application works safely",
      !updated.isError && updatedData.updated === true,
      updatedData.application?.status ?? updatedData.error,
    );

    const foreign = await callTool(client, "get_application_details", {
      applicationId: "definitely-not-a-real-id",
    });
    const foreignData = textPayload(foreign);
    record(
      "Unauthorized / foreign id rejected",
      Boolean(foreign.isError || foreignData.error),
      foreignData.error ?? "error flag set",
    );

    const invalid = await callTool(client, "search_jobs", { query: "" });
    const invalidData = textPayload(invalid);
    record(
      "Invalid input produces useful error",
      Boolean(invalid.isError || invalidData.error),
      invalidData.error ?? "error flag set",
    );

    if (process.env.GEMINI_API_KEY) {
      const letter = await callTool(client, "generate_cover_letter", {
        company: "MCP Verify Co",
        role: "Verification Engineer",
        jobDescription:
          "We need an engineer who can validate MCP tool integrations, write clear reports, and keep user data isolated across tenants while collaborating with product and platform teams.",
      });
      const letterData = textPayload(letter);
      record(
        "generate_cover_letter works",
        !letter.isError && Boolean(letterData.coverLetter?.id),
        letterData.coverLetter?.id ?? letterData.error,
      );
    } else {
      record(
        "generate_cover_letter works",
        true,
        "skipped (GEMINI_API_KEY not set)",
      );
    }
  } catch (error) {
    record("MCP server starts / client connects", false, String(error));
  } finally {
    try {
      await client.close();
    } catch {
      // ignore
    }
  }

  // Separate process with no MCP identity — user-scoped tools must fail clearly.
  // Explicit empty values win over dotenv file defaults inside the server.
  const unauthEnv = {
    ...process.env,
    MCP_USER_ID: "",
    MCP_USER_EMAIL: "",
  };

  const unauthTransport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "mcp/src/server.ts"],
    cwd: root,
    env: unauthEnv,
    stderr: "ignore",
  });
  const unauthClient = new Client({
    name: "jobtracker-mcp-unauth",
    version: "0.1.0",
  });

  try {
    await unauthClient.connect(unauthTransport);
    const denied = await unauthClient.callTool({
      name: "get_applications",
      arguments: {},
    });
    const deniedData = textPayload(denied);
    record(
      "Unauthorized access is rejected",
      Boolean(denied.isError || /MCP auth|MCP_USER/i.test(deniedData.error ?? "")),
      deniedData.error ?? "error flag set",
    );
  } catch (error) {
    record("Unauthorized access is rejected", false, String(error));
  } finally {
    try {
      await unauthClient.close();
    } catch {
      // ignore
    }
  }

  const failed = results.filter((r) => !r.ok);
  console.log("\n— Summary —");
  console.log(`Passed: ${results.filter((r) => r.ok).length}/${results.length}`);
  if (failed.length) {
    console.log("Failures:");
    for (const f of failed) console.log(`- ${f.name}: ${f.detail}`);
    process.exit(1);
  }
}

main();
