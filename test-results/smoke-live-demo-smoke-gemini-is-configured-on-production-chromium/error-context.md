# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> live demo smoke >> gemini is configured on production
- Location: e2e/smoke.spec.ts:37:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | const DEMO_EMAIL = "demo@jobtracker.ai";
  4  | const DEMO_PASSWORD = "password123";
  5  | const baseURL =
  6  |   process.env.E2E_BASE_URL ?? "https://jobtracker-ai-tau.vercel.app";
  7  | 
  8  | test.describe("live demo smoke", () => {
  9  |   test("demo login reaches dashboard", async ({ page }) => {
  10 |     await page.goto("/login");
  11 |     await page.fill('input[name="email"]', DEMO_EMAIL);
  12 |     await page.fill('input[name="password"]', DEMO_PASSWORD);
  13 |     await page.click('button[type="submit"]');
  14 | 
  15 |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
  16 |     await expect(page.getByRole("heading", { level: 1 })).toContainText(
  17 |       /Welcome back|Hi,/,
  18 |     );
  19 |   });
  20 | 
  21 |   test("cover letters page loads after login", async ({ page }) => {
  22 |     await page.goto("/login");
  23 |     await page.fill('input[name="email"]', DEMO_EMAIL);
  24 |     await page.fill('input[name="password"]', DEMO_PASSWORD);
  25 |     await page.click('button[type="submit"]');
  26 |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
  27 | 
  28 |     await page.goto("/cover-letters");
  29 |     await expect(
  30 |       page.getByRole("heading", { name: "Cover letters", exact: true }),
  31 |     ).toBeVisible();
  32 |     await expect(
  33 |       page.getByRole("button", { name: "Generate cover letter" }),
  34 |     ).toBeVisible();
  35 |   });
  36 | 
  37 |   test("gemini is configured on production", async ({ request }) => {
  38 |     test.skip(
  39 |       !baseURL.includes("vercel.app"),
  40 |       "Only runs when E2E_BASE_URL targets production",
  41 |     );
  42 | 
  43 |     const response = await request.get("/api/health");
> 44 |     expect(response.ok()).toBeTruthy();
     |                           ^ Error: expect(received).toBeTruthy()
  45 | 
  46 |     const body = (await response.json()) as {
  47 |       ok: boolean;
  48 |       gemini: { configured: boolean; formatValid: boolean };
  49 |     };
  50 | 
  51 |     expect(body.ok).toBe(true);
  52 |     expect(body.gemini.configured).toBe(true);
  53 |     expect(body.gemini.formatValid).toBe(true);
  54 |   });
  55 | });
  56 | 
```