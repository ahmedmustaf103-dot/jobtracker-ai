/**
 * Print steps to connect Vercel Blob to this project.
 * Vercel auto-injects BLOB_READ_WRITE_TOKEN when a store is linked.
 *
 * Usage: npm run vercel:setup-blob
 */
console.log(`
Vercel Blob setup
=================

1. Open https://vercel.com/mustafs-projects-7285ebc1/jobtracker-ai/stores
2. Create a Blob store (e.g. "jobtracker-resumes") and link it to this project
3. Redeploy production — Vercel adds BLOB_READ_WRITE_TOKEN automatically
4. Confirm: curl https://jobtracker-ai-tau.vercel.app/api/health
   → "resume": { "enabled": true, "storage": "blob", "blobConfigured": true }

Resume uploads will use Vercel Blob in production and local disk in development.
OpenAI API key is still required for resume analysis scoring.
`);
