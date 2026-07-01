import { expect, test } from "@playwright/test";

const DEMO_EMAIL = "demo@jobtracker.ai";
const DEMO_PASSWORD = "password123";
const baseURL =
  process.env.E2E_BASE_URL ?? "https://jobtracker-ai-tau.vercel.app";

test.describe("live demo smoke", () => {
  test("demo login reaches dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', DEMO_EMAIL);
    await page.fill('input[name="password"]', DEMO_PASSWORD);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Welcome back|Hi,/,
    );
  });

  test("cover letters page loads after login", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', DEMO_EMAIL);
    await page.fill('input[name="password"]', DEMO_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });

    await page.goto("/cover-letters");
    await expect(
      page.getByRole("heading", { name: "Cover letters", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Generate cover letter" }),
    ).toBeVisible();
  });

  test("application detail page shows activity timeline", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', DEMO_EMAIL);
    await page.fill('input[name="password"]', DEMO_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });

    await page.goto("/applications");
    await page.getByRole("link", { name: "Senior Frontend Engineer" }).first().click();
    await expect(page).toHaveURL(/\/applications\/.+/);
    await expect(page.getByRole("heading", { name: "Activity timeline" })).toBeVisible();
  });

  test("gemini is configured on production", async ({ request }) => {
    test.skip(
      !baseURL.includes("vercel.app"),
      "Only runs when E2E_BASE_URL targets production",
    );

    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();

    const body = (await response.json()) as {
      ok: boolean;
      gemini: { configured: boolean; formatValid: boolean };
    };

    expect(body.ok).toBe(true);
    expect(body.gemini.configured).toBe(true);
    expect(body.gemini.formatValid).toBe(true);
  });
});
