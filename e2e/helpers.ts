import { type Page } from "@playwright/test";

/** Unique test user credentials — appends timestamp to avoid collisions */
export function testUser(prefix = "e2e") {
  const ts = Date.now();
  return {
    email: `${prefix}+${ts}@test.scopeai.com.au`,
    password: "Test1234!secure",
    name: `Test User ${ts}`,
  };
}

/** Fill the standalone login form and submit */
export async function login(page: Page, email: string, password: string) {
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
}

/** Fill the standalone signup form and submit */
export async function signup(
  page: Page,
  email: string,
  password: string,
  name?: string
) {
  if (name) {
    await page.locator("#signup-name").fill(name);
  }
  await page.locator("#signup-email").fill(email);
  await page.locator("#signup-password").fill(password);
  await page.getByRole("button", { name: "Create Account" }).click();
}

/** Wait for Convex to settle — no loading indicators visible */
export async function waitForConvex(page: Page) {
  // Wait for any skeleton/pulse animations to disappear
  await page.waitForFunction(
    () => {
      const pulses = document.querySelectorAll('[class*="animate-pulse"]');
      return pulses.length === 0;
    },
    { timeout: 15_000 }
  ).catch(() => {
    // Ignore timeout — may not have any loading indicators
  });
}

/** Wait for page to be fully loaded (no network activity) */
export async function waitForIdle(page: Page) {
  await page.waitForLoadState("networkidle");
}
