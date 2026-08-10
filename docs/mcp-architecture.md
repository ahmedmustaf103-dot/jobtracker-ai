# JobTracker AI — MCP architecture (Phase 3)

## Purpose

Expose existing JobTracker capabilities to MCP hosts (Cursor, Claude Desktop, Inspector) without rewriting the Next.js app or duplicating Prisma / job-search / cover-letter logic.

## Diagram

```text
MCP host (Cursor / Inspector)
        │ stdio JSON-RPC
        ▼
mcp/src/server.ts          ← @modelcontextprotocol/server
        │
        ▼
src/lib/capabilities/*     ← shared handlers + Zod validation
        │
        ├── applications.service (Prisma, userId-scoped)
        ├── cover-letters.service + generateCoverLetterText
        └── searchRemoteJobs (Jobicy / Remotive)

Parallel (unchanged UX):
Browser → /assistant → Gemini agent → same capability handlers → same services
```

## Design rules

1. **Reuse, don’t rewrite** — MCP tools call `src/lib/capabilities/handlers.ts`, which wraps existing services.
2. **Gemini agent stays** — in-app Phase 2 agent still uses Gemini function calling; it now routes through the same handlers for DRY.
3. **No remote multi-tenant MCP auth** — stdio process is trusted locally. Identity comes from `MCP_USER_ID` or `MCP_USER_EMAIL` only.
4. **Ownership** — every DB tool uses `userId` from that env resolution; services already enforce `where: { id, userId }`.
5. **No secrets in responses** — tools return structured JSON business data only.

## Tools

| MCP tool | Capability | Underlying logic |
|----------|------------|------------------|
| `search_jobs` | `searchJobsCapability` | `searchRemoteJobs` |
| `get_application_details` | `getApplicationDetailsCapability` | `getApplicationWithEvents` |
| `get_applications` | `getApplicationsCapability` | `listApplications` + filter |
| `generate_cover_letter` | `generateCoverLetterCapability` | `generateCoverLetterText` + `createCoverLetter` |
| `update_application` | `updateApplicationCapability` | `updateApplication` (merge + ownership) |
| `save_application` | `saveApplicationCapability` | `createApplication` |
| `get_pipeline_stats` | `getPipelineStatsCapability` | `getApplicationStats` |

## Local run

```bash
# .env / .env.local
MCP_USER_EMAIL=demo@jobtracker.ai

npm run mcp
# or
npm run mcp:inspect
npm run verify:mcp
```

## Production note

The stdio server is for **local development / personal MCP hosts**. Deploying a shared remote MCP endpoint would require a separate auth model (tokens/OAuth) and is out of Phase 3 scope. The Next.js app on Vercel continues to use session auth as before.
