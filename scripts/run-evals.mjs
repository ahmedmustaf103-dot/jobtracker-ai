/**
 * Run Phase 4 deterministic evals (vitest).
 * Usage: node scripts/run-evals.mjs
 */

import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const result = spawnSync(
  "npx",
  ["vitest", "run", "evals", "mcp/src/format.test.ts"],
  {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  },
);

process.exit(result.status ?? 1);
