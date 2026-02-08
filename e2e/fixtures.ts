import { test as base, type Page } from "@playwright/test";
import { signup, testUser, waitForIdle } from "./helpers";

type TestFixtures = {
  /** A page already signed in as a fresh test user */
  authenticatedPage: Page;
  /** Credentials of the authenticated test user */
  testCredentials: { email: string; password: string; name: string };
};

/**
 * Extended test with custom fixtures.
 * `authenticatedPage` creates a new user, signs them up via the UI,
 * and returns a page that's already authenticated.
 */
export const test = base.extend<TestFixtures>({
  testCredentials: async ({}, use) => {
    const creds = testUser();
    await use(creds);
  },

  authenticatedPage: async ({ page, testCredentials }, use) => {
    // Navigate to signup page
    await page.goto("/auth/signup");
    await page.waitForLoadState("domcontentloaded");

    // Wait for the form to be visible (Convex auth loading state may show spinner first)
    await page.locator("#signup-email").waitFor({ state: "visible", timeout: 15_000 });

    // Fill signup form and submit
    await signup(
      page,
      testCredentials.email,
      testCredentials.password,
      testCredentials.name
    );

    // Wait for successful redirect (auth completes → redirected to home or returnTo)
    await page.waitForURL((url) => !url.pathname.includes("/auth/"), {
      timeout: 15_000,
    });

    await waitForIdle(page);

    // Provide the authenticated page to the test
    await use(page);
  },
});

export { expect } from "@playwright/test";
