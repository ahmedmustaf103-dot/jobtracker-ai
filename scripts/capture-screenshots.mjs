/**
 * Capture README screenshots from the live demo (or local dev).
 * Usage: npm run screenshots
 * Override base URL: SCREENSHOT_BASE_URL=http://localhost:3000 npm run screenshots
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../docs/screenshots");
const BASE_URL =
  process.env.SCREENSHOT_BASE_URL ?? "https://jobtracker-ai-tau.vercel.app";
const VIEWPORT = { width: 1280, height: 800 };

async function launchBrowser() {
  const launchOptions = { headless: true };

  try {
    return await chromium.launch({ ...launchOptions, channel: "chrome" });
  } catch {
    console.warn("System Chrome not found — using Playwright Chromium.");
    return chromium.launch(launchOptions);
  }
}

async function capture(page, fileName) {
  const filePath = path.join(OUT_DIR, fileName);
  await page.screenshot({ path: filePath, fullPage: false });
  console.log(`Saved ${filePath}`);
}

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: VIEWPORT });

try {
  await mkdir(OUT_DIR, { recursive: true });

  await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(1500);
  await capture(page, "landing.png");

  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle", timeout: 60_000 });
  await page.fill('input[name="email"]', "demo@jobtracker.ai");
  await page.fill('input[name="password"]', "password123");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard**", { timeout: 30_000 });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  await capture(page, "dashboard.png");

  await page.goto(`${BASE_URL}/cover-letters`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  await page.waitForTimeout(1500);
  await capture(page, "cover-letters.png");
} finally {
  await browser.close();
}

console.log("Done.");
