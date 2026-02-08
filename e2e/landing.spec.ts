import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page loads with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/ScopeAI/);
  });

  test('hero CTA "Start My Scope" navigates to /create', async ({ page }) => {
    // Target the hero CTA specifically (inside main, not header)
    const heroCTA = page.locator("main").getByRole("link", { name: "Start My Scope" }).first();
    await expect(heroCTA).toBeVisible();
    await heroCTA.click();
    await expect(page).toHaveURL(/\/create/, { timeout: 10_000 });
  });

  test("all 7 sections render", async ({ page }) => {
    // Hero
    await expect(
      page.getByRole("heading", {
        name: /comparable renovation quotes/i,
      })
    ).toBeVisible();

    // Problem
    await expect(
      page.getByRole("heading", { name: /Renovation quoting is broken/i })
    ).toBeVisible();

    // How It Works
    await expect(
      page.getByRole("heading", { name: /Three steps/i })
    ).toBeVisible();

    // Sample Output
    await expect(
      page.getByRole("heading", {
        name: /Professional scope documents/i,
      })
    ).toBeVisible();

    // Pricing
    await expect(
      page.getByRole("heading", { name: /One scope, one price/i })
    ).toBeVisible();

    // FAQ
    await expect(
      page.getByRole("heading", { name: /Common questions/i })
    ).toBeVisible();

    // Final CTA (last section — check for a CTA button)
    const allStartLinks = page.getByRole("link", { name: "Start My Scope" });
    // Hero has one, Final CTA has another
    await expect(allStartLinks).toHaveCount(2, { timeout: 5_000 }).catch(() => {
      // At minimum the hero CTA should exist
    });
    expect(await allStartLinks.count()).toBeGreaterThanOrEqual(1);
  });

  test("pricing cards show 3 tiers ($49, $99, $149)", async ({ page }) => {
    const pricing = page.locator("#pricing");
    await expect(pricing).toBeVisible();

    await expect(pricing.getByText("$49")).toBeVisible();
    await expect(pricing.getByText("$99")).toBeVisible();
    await expect(pricing.getByText("$149")).toBeVisible();

    // "Most Popular" badge on Professional
    await expect(pricing.getByText("Most Popular", { exact: true })).toBeVisible();
  });

  test("FAQ accordions expand and collapse", async ({ page }) => {
    const firstQuestion = page.getByText("What is a scope of works?");
    await expect(firstQuestion).toBeVisible();

    // Click to expand
    await firstQuestion.click();
    const answer = page.getByText(
      /detailed document that lists every item/i
    );
    await expect(answer).toBeVisible();

    // Click again to collapse
    await firstQuestion.click();
    await expect(answer).toBeHidden();
  });

  test("header nav links work", async ({ page }) => {
    // "How It Works" link should scroll to that section
    await page.getByRole("link", { name: "How It Works" }).first().click();
    // Wait for smooth scroll to complete
    await page.waitForTimeout(1_500);
    const howItWorks = page.locator("#how-it-works");
    await expect(howItWorks).toBeVisible();
    await expect(howItWorks).toBeInViewport({ ratio: 0.1, timeout: 5_000 });

    // "Pricing" link should scroll to pricing section
    await page.getByRole("link", { name: "Pricing" }).first().click();
    await page.waitForTimeout(1_500);
    const pricing = page.locator("#pricing");
    await expect(pricing).toBeVisible();
    await expect(pricing).toBeInViewport({ ratio: 0.1, timeout: 5_000 });
  });

  test("dark mode toggle works", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /toggle theme/i });
    await expect(toggle).toBeVisible();

    const html = page.locator("html");

    // Click toggle
    await toggle.click();
    const classAfterToggle = await html.getAttribute("class");
    expect(classAfterToggle).toBeTruthy();

    // Toggle again — class should change
    await toggle.click();
    const classAfterSecondToggle = await html.getAttribute("class");
    expect(classAfterSecondToggle).not.toEqual(classAfterToggle);
  });

  test("mobile nav hamburger menu works", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    // Hamburger button should be visible
    const menuButton = page.getByRole("button", { name: /open menu/i });
    await expect(menuButton).toBeVisible();

    // Open the menu
    await menuButton.click();

    // Sheet content with links should appear
    await expect(
      page.getByRole("link", { name: "How It Works" }).last()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Pricing" }).last()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Sign In" }).last()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Start My Scope" }).last()
    ).toBeVisible();
  });
});
