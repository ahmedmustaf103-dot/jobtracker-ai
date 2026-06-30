/**
 * Validate GEMINI_API_KEY format and optionally test the Google AI Studio API.
 * Usage: npm run verify:gemini
 * Loads from .env via dotenv.
 */
import "dotenv/config";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY?.trim() ?? "";
const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

if (!apiKey) {
  fail(
    "GEMINI_API_KEY is missing. Add it to .env — create one at https://aistudio.google.com/apikey",
  );
}

if (!/^AIzaSy/.test(apiKey)) {
  fail(
    `GEMINI_API_KEY must start with AIzaSy (Google AI Studio). Yours starts with "${apiKey.slice(0, 8)}…". Vertex or other key formats will not work with this app.`,
  );
}

console.log("✓ Key format looks valid (AIzaSy…)");

const client = new GoogleGenerativeAI(apiKey);
const generativeModel = client.getGenerativeModel({ model });

try {
  const result = await generativeModel.generateContent("Reply with exactly: ok");
  const text = result.response.text().trim().toLowerCase();
  if (!text.includes("ok")) {
    fail(`Gemini responded but output was unexpected: ${text.slice(0, 80)}`);
  }
  console.log(`✓ Live API test passed (model: ${model})`);
  console.log("\nNext: sync to Vercel with npm run vercel:sync-gemini\n");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  fail(`Gemini API call failed: ${message}`);
}
