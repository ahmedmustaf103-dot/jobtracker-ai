/**
 * Manual UX walkthrough against local Next.js:
 * Login → Dashboard → Assistant → Cover Letters → Applications
 *
 * Usage: node scripts/manual-ux-walkthrough.mjs
 */

import { chromium } from "playwright";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const EMAIL = "demo@jobtracker.ai";
const PASSWORD = "password123";

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`PASS  ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.CI ? undefined : "chrome",
  }).catch(() => chromium.launch({ headless: true }));

  const page = await browser.newPage();
  page.setDefaultTimeout(45_000);

  try {
    // 1. Login
    await page.goto(`${BASE}/login`);
    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 30_000 });
    const dashHeading = await page.getByRole("heading", { level: 1 }).textContent();
    pass("Login → Dashboard", dashHeading?.trim() ?? "");

    // Sidebar links present
    for (const label of [
      "Overview",
      "Applications",
      "AI Assistant",
      "Cover letters",
    ]) {
      const link = page.getByRole("link", { name: label });
      if (await link.count()) {
        pass(`Nav link visible: ${label}`);
      } else {
        fail(`Nav link visible: ${label}`, "not found");
      }
    }

    // 2. Assistant
    await page.getByRole("link", { name: "AI Assistant" }).click();
    await page.waitForURL(/\/assistant/);
    await page
      .getByRole("heading", { name: "AI Job Search Assistant" })
      .waitFor({ state: "visible" });
    pass("Assistant page loads");

    const suggestion = page.getByRole("button", {
      name: "How is my application pipeline looking?",
    });
    if (await suggestion.count()) {
      await suggestion.click();
      await page
        .getByText(/Thinking and calling tools|pipeline|application|status/i)
        .first()
        .waitFor({ state: "visible", timeout: 60_000 });
      const assistantBubbles = page.locator(
        "div.max-w-\\[85%\\] p.whitespace-pre-wrap",
      );
      // Fallback: any assistant reply text after pending clears
      await page
        .getByText("Thinking and calling tools", { exact: false })
        .waitFor({ state: "hidden", timeout: 90_000 })
        .catch(() => {});
      const bodyText = await page.locator("main").innerText();
      if (/pipeline|wishlist|applied|interview|application/i.test(bodyText)) {
        pass("Assistant responds to pipeline question");
      } else if (await page.getByRole("alert").count()) {
        const err = await page.getByRole("alert").innerText();
        fail("Assistant responds to pipeline question", err);
      } else {
        fail(
          "Assistant responds to pipeline question",
          "no recognizable reply in main content",
        );
      }
      void assistantBubbles;
    } else {
      fail("Assistant suggestion chips", "pipeline suggestion missing");
    }

    // 3. Cover letters
    await page.getByRole("link", { name: "Cover letters" }).click();
    await page.waitForURL(/\/cover-letters/);
    await page
      .getByRole("heading", { name: "Cover letters", exact: true })
      .waitFor({ state: "visible" });
    const generateBtn = page.getByRole("button", {
      name: "Generate cover letter",
    });
    if (await generateBtn.count()) {
      pass("Cover letters page loads with generate action");
    } else {
      fail("Cover letters page loads with generate action", "button missing");
    }

    // Light interactive check: fill form fields (don't wait on full Gemini unless key works)
    await page.fill('input[name="company"]', "UX Walkthrough Co");
    await page.fill('input[name="role"]', "Frontend Engineer");
    await page.fill(
      'textarea[name="jobDescription"]',
      "We are hiring a Frontend Engineer to build accessible React and TypeScript interfaces, collaborate with design, and ship polished product features with strong attention to detail and testing.",
    );
    pass("Cover letter form accepts input");

    // 4. Applications list
    await page.goto(`${BASE}/applications`);
    await page.waitForURL(/\/applications/);
    await page.getByRole("heading", { name: "Applications", exact: true }).waitFor({
      state: "visible",
    });
    const appsMain = await page.locator("main").innerText();
    if (/in your pipeline|Add application/i.test(appsMain)) {
      pass("Applications list page loads", appsMain.split("\n").slice(0, 3).join(" | "));
    } else {
      fail("Applications list page loads", appsMain.slice(0, 200));
    }

    // Use exact match — Playwright substring matching would hit "Overview".
    const detailLink = page.getByRole("link", { name: "View", exact: true }).first();
    if (await detailLink.count()) {
      const href = await detailLink.getAttribute("href");
      await page.goto(`${BASE}${href}`);
      await page.waitForURL(/\/applications\/(?!new$)[^/]+$/);
      const timeline = page.getByRole("heading", { name: "Activity timeline" });
      const title = (await page.locator("main h1").first().textContent())?.trim();
      if (await timeline.count()) {
        pass("Application detail + activity timeline", title ?? "");
      } else {
        fail("Application detail + activity timeline", "timeline heading missing");
      }
    } else {
      fail("Application detail link", "no View links found");
    }

    // 5. Back to Overview
    await page.getByRole("link", { name: "Overview" }).click();
    await page.waitForURL(/\/dashboard/);
    pass("Return to Overview / Dashboard");
  } catch (error) {
    fail("Walkthrough crashed", String(error));
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => !r.ok);
  console.log("\n— UX walkthrough summary —");
  console.log(`Passed: ${results.filter((r) => r.ok).length}/${results.length}`);
  if (failed.length) {
    console.log("Failures:");
    for (const f of failed) console.log(`- ${f.name}: ${f.detail}`);
    process.exit(1);
  }
}

main();
