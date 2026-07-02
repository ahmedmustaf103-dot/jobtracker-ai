/**
 * Create and link a Vercel Blob store for production resume uploads.
 * Usage: npm run vercel:setup-blob
 */
import { spawnSync } from "node:child_process";

console.log("Creating Vercel Blob store (public) and linking to jobtracker-ai…\n");

const result = spawnSync(
  "npx",
  ["vercel", "blob", "create-store", "jobtracker-resumes", "--access", "public", "--yes"],
  { stdio: "inherit" },
);

if (result.status !== 0) {
  console.error("\nIf the store already exists, link it in the Vercel dashboard → Storage.");
  process.exit(result.status ?? 1);
}

console.log(`
Next steps:
1. Redeploy production: npx vercel deploy --prod
2. Confirm: curl https://jobtracker-ai-tau.vercel.app/api/health
   → "resume": { "enabled": true, "storage": "blob" }
`);
