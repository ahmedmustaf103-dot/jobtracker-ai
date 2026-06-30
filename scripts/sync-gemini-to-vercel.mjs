/**
 * Push GEMINI_API_KEY from .env to all Vercel environments.
 * Requires: vercel login, valid AI Studio key in .env, npm run verify:gemini passing first.
 */
import "dotenv/config";
import { spawnSync } from "node:child_process";

const apiKey = process.env.GEMINI_API_KEY?.trim() ?? "";
const environments = ["production", "preview", "development"];

if (!/^AIzaSy|^AQ\./.test(apiKey)) {
  console.error(
    "\n✗ Invalid GEMINI_API_KEY in .env. Run npm run verify:gemini after adding an AI Studio key (AIzaSy… or AQ.…).\n",
  );
  process.exit(1);
}

function run(args, input) {
  const result = spawnSync("npx", ["vercel", ...args], {
    input,
    encoding: "utf8",
    stdio: ["pipe", "inherit", "inherit"],
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("Syncing GEMINI_API_KEY to Vercel (all environments)…\n");

for (const env of environments) {
  console.log(`→ ${env}`);
  run(["env", "rm", "GEMINI_API_KEY", env, "--yes"], "");
  run(["env", "add", "GEMINI_API_KEY", env], `${apiKey}\n`);
}

console.log("\n✓ Done. Redeploy production:\n  npx vercel deploy --prod\n");
