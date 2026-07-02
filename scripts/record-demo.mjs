/**
 * Record a ~60s demo walkthrough for the README.
 * Usage: npm run record:demo
 */
import { mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../docs/videos");
const BASE_URL =
  process.env.DEMO_BASE_URL ?? "https://jobtracker-ai-tau.vercel.app";
const VIEWPORT = { width: 1280, height: 720 };

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true, channel: "chrome" });
  } catch {
    return chromium.launch({ headless: true });
  }
}

async function pause(page, ms) {
  await page.waitForTimeout(ms);
}

const browser = await launchBrowser();
const context = await browser.newContext({
  viewport: VIEWPORT,
  recordVideo: {
    dir: OUT_DIR,
    size: VIEWPORT,
  },
});
const page = await context.newPage();

try {
  await mkdir(OUT_DIR, { recursive: true });

  await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 60_000 });
  await pause(page, 2500);

  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
  await page.fill('input[name="email"]', "demo@jobtracker.ai");
  await page.fill('input[name="password"]', "password123");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard**", { timeout: 30_000 });
  await pause(page, 2500);

  await page.goto(`${BASE_URL}/applications`, { waitUntil: "networkidle" });
  await pause(page, 2000);

  await page.getByRole("link", { name: "Senior Frontend Engineer" }).first().click();
  await page.waitForURL("**/applications/**");
  await pause(page, 3500);

  await page.goto(`${BASE_URL}/cover-letters`, { waitUntil: "networkidle" });
  await pause(page, 3500);

  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await pause(page, 2000);
} finally {
  const video = page.video();
  await context.close();
  await browser.close();

  if (video) {
    const tempPath = await video.path();
    const finalPath = path.join(OUT_DIR, "demo-walkthrough.webm");
    await rename(tempPath, finalPath);
    console.log(`Saved ${finalPath}`);
  }
}

console.log("Done.");
