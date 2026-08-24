/**
 * Production build with safe local env precedence.
 *
 * - Loads `.env` first without overriding existing process env (Vercel/CI win).
 * - Then loads `.env.local` with override when the file exists (local Neon URL wins
 *   over a stale `.env` DATABASE_URL).
 * - Never prints secret values.
 *
 * Usage: node scripts/run-build.mjs  (via `npm run build`)
 */

import { config as loadEnv } from "dotenv";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

loadEnv({ path: resolve(root, ".env") });

const localEnvPath = resolve(root, ".env.local");
if (existsSync(localEnvPath)) {
  loadEnv({ path: localEnvPath, override: true });
}

const steps = [
  ["npx", ["prisma", "generate"]],
  ["npx", ["prisma", "migrate", "deploy"]],
  ["npx", ["next", "build"]],
];

for (const [command, args] of steps) {
  const result = spawnSync(command, args, {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
