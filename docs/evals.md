# Phase 4 — Evals & robust error handling

## Goals

1. Catch agent/MCP regressions with an automated eval suite.
2. Keep tool failures user-safe (validation + sanitized errors).
3. Avoid rewriting the app — evals exercise existing handlers.

## Error handling additions

- `src/lib/capabilities/errors.ts` — `sanitizeCapabilityError` strips secrets / connection strings / noisy Prisma internals before returning capability errors.
- Capability handlers use that helper for unexpected failures (job search, etc.).
- Cover letters continue to use `getGeminiErrorMessage`.
- MCP responses use `fromCapabilityResult` → `{ error }` with `isError: true`.

## Eval layout

See [evals/README.md](../evals/README.md).

## Latest local run

| Check | Command | Result |
|-------|---------|--------|
| Deterministic evals | `npm run eval` | **31/31 passed** |
| Unit + evals | `npm test` | **119/119 passed** |
| Live MCP smoke | `npm run eval:mcp` / `verify:mcp` | **19/19 passed** |
| Production E2E | `npm run test:e2e` | **5/5 passed** |
| Production build | `npm run build` | **Passing** |

## Out of scope

- LLM-as-judge routing evals against live Gemini (optional later)
- Remote multi-tenant MCP OAuth
