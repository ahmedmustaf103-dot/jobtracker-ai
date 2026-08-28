# Case study: JobTracker AI

**Live demo:** [jobtracker-ai-tau.vercel.app](https://jobtracker-ai-tau.vercel.app)  
**Repo:** [github.com/ahmedmustaf103-dot/jobtracker-ai](https://github.com/ahmedmustaf103-dot/jobtracker-ai)  
**Demo login:** `demo@jobtracker.ai` / `password123`

## Problem

Job searching usually means a spreadsheet for applications, a separate doc for cover letters, and another tab for resume tweaks. Progress is hard to see, and AI tools are scattered — useful drafts, but nothing wired into the actual pipeline.

## Solution

JobTracker AI is a full-stack AI-powered job application platform that combines application tracking, AI-assisted cover letters, resume analysis, job search, an AI agent with tool calling, MCP integration, AI job matching, and automated evaluations.

One signed-in workspace keeps the pipeline in one place and uses AI where it saves time — without replacing thoughtful edits.

## What I shipped (build story)

| Stage | What landed | Why it matters |
|-------|-------------|----------------|
| **Core product** | Auth, applications CRUD, status pipeline, dashboard, settings | Real SaaS baseline — not a UI mock |
| **AI tools** | Gemini cover letters, OpenAI resume analyzer | Practical AI with rate limits and safe client errors |
| **AI agent** | Gemini tool-calling assistant (search jobs, pipeline, save/update apps) | Agents that *do* something in the user’s data |
| **MCP** | Stdio MCP server reusing the same capability handlers | Same business logic for UI agent and local MCP hosts |
| **Evals** | Deterministic eval suite + live MCP smoke | Regressions caught without manual clicking |
| **Job Match** | On-demand 0–100% resume ↔ JD score on application detail | Zod-validated Gemini JSON; no hallucinated “you lack X” certainty |
| **Hardening** | Build env precedence, production E2E for Job Match UI | Portfolio demo stays trustworthy |

Git history intentionally reads in that order — useful for anyone reviewing the repo.

## Architecture decisions worth calling out

1. **Shared capabilities layer** — Agent tools and MCP tools call the same handlers (`src/lib/capabilities/`). No duplicated Prisma or Gemini logic.
2. **Ownership everywhere** — DB access is scoped by `userId`; MCP identity comes from local env (`MCP_USER_EMAIL` / `MCP_USER_ID`), never from tool arguments.
3. **Validated AI output** — Job Match (and similar flows) parse model JSON through Zod; scores are clamped to 0–100; recommendation bands are derived from the score.
4. **Sanitized errors** — Capability failures strip secrets and connection strings before they reach the UI or MCP client.
5. **Production honesty** — Resumes use Vercel Blob in prod (not local disk); CI builds and Playwright smoke the live demo.

```text
User → Next.js → AI agent → shared capabilities → services → Prisma → PostgreSQL

External AI client → MCP server → shared capabilities → existing services → Prisma → PostgreSQL

Also: Gemini (cover letters, agent, job match) · OpenAI (resume) · Jobicy (remote jobs)
```

## Stack

Next.js 15 · TypeScript · Tailwind · Prisma · PostgreSQL (Neon) · Auth.js · Zod · Gemini · OpenAI · MCP SDK · Vitest · Playwright · Vercel

## How to evaluate the demo (2–3 minutes)

1. Sign in with the demo account (or register).
2. Open **Applications** → a role → confirm timeline + **AI Job Match** section.
3. Try **Cover letters** (needs Gemini configured — production health check confirms this).
4. Open **Assistant** and ask for remote jobs or pipeline stats.
5. Optional locally: `npm run verify:mcp` and `npm run eval`.

## Trade-offs / what’s intentionally out of scope

- Job Match scores are **not** persisted (recompute on demand).
- MCP is **local trusted stdio**, not multi-tenant remote OAuth.
- Job Match is **not** exposed as an agent/MCP tool (kept on the application detail page).
- Resume analyzer quality depends on extract quality and OpenAI quota.

## Copy for LinkedIn / CV

**One-liner**

> JobTracker AI — full-stack job search SaaS (Next.js, Prisma, Auth.js) with a Gemini tool-calling agent, MCP server, evals, and AI job-match scoring. [Demo](https://jobtracker-ai-tau.vercel.app) · [GitHub](https://github.com/ahmedmustaf103-dot/jobtracker-ai)

**Bullet**

> Built JobTracker AI end-to-end: Auth.js + Prisma pipeline, Gemini cover letters & agent tools, shared MCP capabilities, deterministic evals, and Zod-validated resume↔JD match scores — deployed on Vercel/Neon with production smoke tests.

**Short post angle**

> I didn’t stop at “AI chat.” I wired tools into real user data, shared that logic with an MCP server, added evals so it doesn’t silently break, then shipped a match score with validated JSON — same product, rising bar.
