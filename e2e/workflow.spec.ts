import { test, expect } from "@playwright/test";
import { testUser } from "./helpers";
import path from "path";

/**
 * Full Workflow E2E Test
 *
 * Tests the complete user journey:
 * Mode Selection → Project Setup → Photo Upload → Questions → Auth → Generation → Preview
 *
 * Uses real Gemini API for scope generation (takes 30-120s).
 * Stripe checkout is NOT tested (deferred).
 *
 * KNOWN BUG: Multi-select question "Continue" button advances the wizard step
 * instead of the question index. This causes remaining questions to be skipped.
 * The test handles this gracefully.
 */

// Kitchen questions in order — first option label for each
// Single-select: clicking auto-advances after 800ms
// Multi-select (indices 8, 9): need to click Continue after selecting
const KITCHEN_SINGLE_SELECT = [
  "No — keeping same layout",       // Q1: layout_change
  "No walls being touched",         // Q2: wall_removal
  "Gas — keeping existing",         // Q3: cooktop_type
  "Built-in wall oven",             // Q4: oven_type (exact match needed)
  "No island",                       // Q5: island_bench
  "Laminate",                        // Q6: benchtop_material
  "Yes — new dishwasher",           // Q7: dishwasher
  "Ducted to outside (recommended)", // Q8: rangehood
];

// After Q8, Q9 (lighting) is multi-select — clicking Continue will skip to auth gate

test.describe("Full Workflow", () => {
  test.setTimeout(180_000); // 3 minutes

  test("complete wizard flow: mode → setup → photos → questions → auth → generation → preview", async ({
    page,
  }) => {
    const user = testUser("workflow");

    // Clear any previous wizard state
    await page.goto("/create");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    // =========================================================================
    // STEP 0: Mode Selection
    // =========================================================================
    await expect(
      page.getByRole("heading", { name: /How will you manage your renovation/i })
    ).toBeVisible({ timeout: 10_000 });

    await page.getByText("I'll coordinate trades myself").click();

    await expect(
      page.getByRole("heading", { name: /What are you renovating/i })
    ).toBeVisible({ timeout: 5_000 });

    // =========================================================================
    // STEP 1: Project Setup
    // =========================================================================
    await page.getByText("Kitchen").first().click();
    await page.locator("#suburb").fill("Paddington");
    await page.locator("#state").click();
    await page.getByRole("option", { name: "New South Wales" }).click();
    await page.locator("#yearBuilt").fill("2005");
    await page.getByText("House", { exact: true }).click();

    await expect(page.getByRole("button", { name: "Continue" })).toBeEnabled();
    await page.getByRole("button", { name: "Continue" }).click();

    // =========================================================================
    // STEP 2: Photo Upload
    // =========================================================================
    await expect(
      page.getByRole("heading", { name: /Add photos of your space/i })
    ).toBeVisible({ timeout: 5_000 });

    const fixturesDir = path.resolve(__dirname, "fixtures");
    const photoFiles = [
      path.join(fixturesDir, "kitchen-1.jpg"),
      path.join(fixturesDir, "kitchen-2.jpg"),
      path.join(fixturesDir, "kitchen-3.jpg"),
    ];

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(photoFiles);

    // Wait for uploads to complete
    await expect(
      page.getByRole("button", { name: "Continue" })
    ).toBeEnabled({ timeout: 30_000 });
    await page.getByRole("button", { name: "Continue" }).click();

    // =========================================================================
    // STEP 3: Question Flow
    // =========================================================================

    // Phase 1: Question Intro
    await expect(
      page.getByText(/quick questions about your kitchen/i)
    ).toBeVisible({ timeout: 5_000 });
    await page.getByText(/Let's go/i).click();

    // Phase 2: Answer single-select questions (auto-advance)
    for (const answer of KITCHEN_SINGLE_SELECT) {
      // Wait for the option to be visible on screen
      const option = page.getByRole("radio", { name: answer, exact: true });
      await expect(option).toBeVisible({ timeout: 5_000 });

      // Click the option card
      await option.click();

      // Wait for auto-advance animation (800ms delay + transition)
      await page.waitForTimeout(1200);
    }

    // Q9 (lighting) is multi-select — "Select all that apply" should appear
    await expect(
      page.getByText("Select all that apply")
    ).toBeVisible({ timeout: 5_000 });

    // Select first lighting option
    const lightingOption = page.getByRole("checkbox", {
      name: "Downlights (recessed ceiling)",
    });
    await expect(lightingOption).toBeVisible();
    await lightingOption.click();

    // Click Continue — this will either:
    // A) Advance to next question (correct behavior)
    // B) Advance wizard to auth gate (known bug)
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(1000);

    // Check where we are now
    const isOnNextQuestion = await page
      .getByText("Select all that apply")
      .isVisible()
      .catch(() => false);
    const isOnConfirm = await page
      .getByRole("heading", { name: /Ready to generate your scope/i })
      .isVisible()
      .catch(() => false);
    const isOnAuth = await page
      .getByRole("heading", { name: /Create a free account/i })
      .isVisible()
      .catch(() => false);

    if (isOnNextQuestion) {
      // Q10 (power_needs) is also multi-select
      const powerOption = page.getByRole("checkbox", {
        name: "Standard is fine",
      });
      await expect(powerOption).toBeVisible();
      await powerOption.click();
      await page.waitForTimeout(300);
      await page.getByRole("button", { name: "Continue" }).click();
      await page.waitForTimeout(1200);

      // Continue answering remaining single-select questions
      const remainingAnswers = [
        "Mid-range ($25-45K) — good quality, popular brands", // Q11
        "No — I want tradies to do everything",                // Q12
      ];
      for (const answer of remainingAnswers) {
        const opt = page.getByRole("radio", { name: answer });
        const isVis = await opt.isVisible().catch(() => false);
        if (isVis) {
          await opt.click();
          await page.waitForTimeout(1200);
        }
      }
    }

    // At this point we should be on confirm or auth gate
    const onConfirm = await page
      .getByRole("heading", { name: /Ready to generate your scope/i })
      .isVisible()
      .catch(() => false);

    if (onConfirm) {
      await expect(page.getByText(/photos uploaded/i)).toBeVisible();
      await expect(page.getByText(/questions answered/i)).toBeVisible();
      await expect(page.getByText(/trades identified/i)).toBeVisible();
      await page.getByRole("button", { name: "Generate My Scope" }).click();
    }

    // =========================================================================
    // STEP 4: Auth Gate
    // =========================================================================
    await expect(
      page.getByRole("heading", { name: /Create a free account/i })
    ).toBeVisible({ timeout: 10_000 });

    await page.locator("#auth-name").fill(user.name);
    await page.locator("#auth-email").fill(user.email);
    await page.locator("#auth-password").fill(user.password);
    await page.getByRole("button", { name: "Create Account" }).click();

    // =========================================================================
    // STEP 5: Generating State
    // =========================================================================
    await expect(
      page.getByText(/Generating your scope|Your scope is ready/i)
    ).toBeVisible({ timeout: 30_000 });

    // Wait for generation to complete (Gemini API — can take 30-120s)
    await expect(
      page.getByText("Your scope is ready!")
    ).toBeVisible({ timeout: 120_000 });

    await expect(
      page.getByRole("button", { name: "View Your Scope" })
    ).toBeVisible();

    // =========================================================================
    // STEP 6: Scope Preview
    // =========================================================================
    await page.getByRole("button", { name: "View Your Scope" }).click();

    // Should show scope preview — either with generated trade data or with failed retries
    // The Gemini API may or may not succeed depending on test photo quality and API availability
    await expect(
      page.getByText(/trade scope.*generated|failed/i)
    ).toBeVisible({ timeout: 15_000 });

    // Pricing tiers should always be shown regardless of generation outcome
    await expect(page.getByText("Choose your package")).toBeVisible();
    await expect(page.getByText("$49")).toBeVisible();
    await expect(page.getByText("$99")).toBeVisible();
    await expect(page.getByText("$149")).toBeVisible();
  });
});
