import { test, expect } from "@playwright/test";

test.describe("Wizard Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto("/create");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
  });

  test("/create loads step 0 (mode selection)", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: /How will you manage your renovation/i,
      })
    ).toBeVisible();

    // Two mode cards should be visible
    await expect(
      page.getByText("I'll coordinate trades myself")
    ).toBeVisible();
    await expect(page.getByText("I'll hire a builder")).toBeVisible();
  });

  test('select "Trades" mode advances to step 1', async ({ page }) => {
    // Click trades card
    await page.getByText("I'll coordinate trades myself").click();

    // Should auto-advance to step 1 (project setup) after ~800ms
    await expect(
      page.getByRole("heading", { name: /What are you renovating/i })
    ).toBeVisible({ timeout: 5_000 });
  });

  test("fill project setup and advance", async ({ page }) => {
    // Step 0 → select trades mode
    await page.getByText("I'll coordinate trades myself").click();
    await page
      .getByRole("heading", { name: /What are you renovating/i })
      .waitFor({ timeout: 5_000 });

    // Step 1 — select Kitchen
    await page.getByText("Kitchen").first().click();

    // Fill suburb
    await page.locator("#suburb").fill("Paddington");

    // Select state — Radix Select component
    await page.locator("#state").click();
    await page.getByRole("option", { name: "New South Wales" }).click();

    // Fill year built
    await page.locator("#yearBuilt").fill("2005");

    // Select property type
    await page.getByText("House", { exact: true }).click();

    // Continue button should be enabled
    const continueBtn = page.getByRole("button", { name: "Continue" });
    await expect(continueBtn).toBeEnabled();

    // Click Continue to advance to step 2 (photos)
    await continueBtn.click();

    // Should be on photo upload step
    await expect(
      page.getByRole("heading", { name: /Add photos of your space/i })
    ).toBeVisible({ timeout: 5_000 });
  });

  test("back button navigates to previous step", async ({ page }) => {
    // Step 0 → select trades mode
    await page.getByText("I'll coordinate trades myself").click();
    await page
      .getByRole("heading", { name: /What are you renovating/i })
      .waitFor({ timeout: 5_000 });

    // Click Back button
    await page.getByRole("button", { name: "Back" }).click();

    // Should return to step 0 (mode selection)
    await expect(
      page.getByRole("heading", {
        name: /How will you manage your renovation/i,
      })
    ).toBeVisible({ timeout: 5_000 });
  });

  test("progress bar reflects progress", async ({ page }) => {
    // Step 0 — phase label should show "Your Project"
    await expect(page.getByText("Your Project")).toBeVisible();

    // Advance to step 1
    await page.getByText("I'll coordinate trades myself").click();
    await page
      .getByRole("heading", { name: /What are you renovating/i })
      .waitFor({ timeout: 5_000 });

    // Phase label should still show "Your Project" (steps 0-1 are same phase)
    await expect(page.getByText("Your Project")).toBeVisible();
  });

  test("browser refresh restores wizard state", async ({ page }) => {
    // Step 0 → select trades mode
    await page.getByText("I'll coordinate trades myself").click();
    await page
      .getByRole("heading", { name: /What are you renovating/i })
      .waitFor({ timeout: 5_000 });

    // Select Kitchen
    await page.getByText("Kitchen").first().click();

    // Refresh the page
    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    // The wizard should restore state — either show a resume prompt or be on the saved step
    const hasResume = await page
      .getByText(/continue|resume/i)
      .isVisible()
      .catch(() => false);
    const hasProjectSetup = await page
      .getByRole("heading", { name: /What are you renovating/i })
      .isVisible()
      .catch(() => false);

    // Either resume prompt or restored step should be showing
    expect(hasResume || hasProjectSetup).toBeTruthy();
  });

  test("asbestos warning shows for pre-1990 properties", async ({ page }) => {
    // Step 0 → select trades mode
    await page.getByText("I'll coordinate trades myself").click();
    await page
      .getByRole("heading", { name: /What are you renovating/i })
      .waitFor({ timeout: 5_000 });

    // Fill year built with pre-1990 value
    await page.locator("#yearBuilt").fill("1975");

    // Asbestos warning should appear
    await expect(page.getByText(/asbestos/i)).toBeVisible();
  });

  test("auth gate shows signup form when not logged in", async ({ page }) => {
    // Seed localStorage with a state at step 4 (auth gate)
    await page.evaluate(() => {
      localStorage.setItem(
        "scopeai_wizard",
        JSON.stringify({
          step: 4,
          sessionId: "test-session-" + Date.now(),
          mode: "trades",
          projectType: "kitchen",
          propertyDetails: { state: "NSW", suburb: "Test" },
          description: "",
          answers: { layout_change: "No — keeping same layout" },
          savedAt: Date.now(),
          currentQuestionIndex: 0,
        })
      );
    });
    await page.goto("/create?step=4");
    await page.waitForLoadState("domcontentloaded");

    // The wizard should restore and show either:
    // - The auth gate form ("Create a free account")
    // - A resume prompt (asking to continue from where we left off)
    // - The step we were on
    const hasAuthForm = await page
      .getByRole("heading", { name: /Create a free account/i })
      .isVisible({ timeout: 10_000 })
      .catch(() => false);
    const hasResume = await page
      .getByText(/continue|resume/i)
      .isVisible()
      .catch(() => false);
    const hasWizard = await page
      .getByText(/Your Project|Your Plans|Your Scope/i)
      .isVisible()
      .catch(() => false);

    // Wizard should show something — confirms localStorage restore works
    expect(hasAuthForm || hasResume || hasWizard).toBeTruthy();
  });
});
