# JobTracker AI — Phase 4 evals

Automated checks for agent tools, shared capabilities, MCP formatting, ownership, and validation.

## What we evaluate

| Suite | Focus |
|-------|--------|
| `tool-routing` | Agent `executeAgentTool` routes known tools / rejects unknown |
| `ownership` | Application reads/writes stay user-scoped |
| `invalid-input` | Zod validation rejects bad tool args |
| `job-search` | Empty results, operational errors, secret scrubbing |
| `job-search-relevance` | Relevance scoring prefers real matches |
| `cover-letter` | Validate → generate → save; Gemini errors stay safe |
| `job-match` | Strong/partial/weak fixtures, missing resume/JD, ownership, malformed JSON |
| `mcp/src/format.test.ts` | MCP success/error JSON contract |

These are **deterministic** (mocked services). Live MCP smoke remains:

```bash
npm run verify:mcp
```

## Run

```bash
npm run eval          # vitest eval suites + MCP format tests
npm test              # full unit suite (includes evals via vitest include)
npm run eval:mcp      # live MCP stdio smoke (needs DB + MCP_USER_*)
```

## Design rules

1. Call **capability handlers** / `executeAgentTool` — do not reimplement business logic in evals.
2. Assert **user-safe errors** (no secrets in messages).
3. Keep Gemini/Jobicy live calls out of the default eval suite.
