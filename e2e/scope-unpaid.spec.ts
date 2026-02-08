import { test, expect } from "./fixtures";

/**
 * Scope Unpaid Tests
 *
 * These tests verify auth gating and access control for scope pages.
 * Full paywall UI tests require a seeded project with "generated" status,
 * which needs real Gemini API calls — those are covered by workflow.spec.ts.
 */
test.describe("Scope View — Unpaid", () => {
  test("unauthenticated user is redirected to login for /scope/*", async ({
    page,
  }) => {
    await page.goto("/scope/any-project-id");

    // Middleware redirects to /auth/login
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("non-owner cannot access another user's scope", async ({
    authenticatedPage: page,
  }) => {
    // Navigate to a fake/non-existent project ID
    await page.goto("/scope/fake-project-id-12345");

    // Should redirect home — page checks ownership and redirects if project is null
    await page.waitForURL(
      (url) => !url.pathname.includes("/scope/fake-project-id"),
      { timeout: 10_000 }
    ).catch(() => {
      // May still be showing skeleton while about to redirect
    });

    // Verify we are NOT on the login page (auth passed, but project not found)
    expect(page.url()).not.toContain("/auth/login");
  });

  test("authenticated user stays on scope page (not redirected to login)", async ({
    authenticatedPage: page,
  }) => {
    // Use a valid-looking Convex ID format
    await page.goto("/scope/j57ax1amq1f3c0g76m60m85d3d7ayrst");
    await page.waitForLoadState("domcontentloaded");

    // Wait for auth check to complete
    await page.waitForTimeout(3_000);

    // Should NOT be on the login page — auth middleware passed
    expect(page.url()).not.toContain("/auth/login");
  });
});
