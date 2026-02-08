import { test, expect } from "@playwright/test";
import { login, signup, testUser } from "./helpers";

test.describe("Auth Flow", () => {
  test("signup with email/password creates account", async ({ page }) => {
    const user = testUser("signup");
    await page.goto("/auth/signup");
    await page.locator("#signup-email").waitFor({ state: "visible", timeout: 15_000 });

    await signup(page, user.email, user.password, user.name);

    // Should redirect away from auth page on success
    await page.waitForURL((url) => !url.pathname.includes("/auth/"), {
      timeout: 15_000,
    });
  });

  test("login with valid credentials succeeds", async ({ page }) => {
    // First create an account
    const user = testUser("login");
    await page.goto("/auth/signup");
    await page.locator("#signup-email").waitFor({ state: "visible", timeout: 15_000 });
    await signup(page, user.email, user.password, user.name);
    await page.waitForURL((url) => !url.pathname.includes("/auth/"), {
      timeout: 15_000,
    });

    // Sign out first — go to home and click Sign Out
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const signOutBtn = page.getByRole("button", { name: /sign out/i }).first();
    await expect(signOutBtn).toBeVisible({ timeout: 10_000 });
    await signOutBtn.click();

    // Wait for sign out to complete — "Sign In" link should reappear
    await expect(
      page.getByRole("link", { name: "Sign In" }).first()
    ).toBeVisible({ timeout: 10_000 });

    // Now navigate to login page
    await page.goto("/auth/login");
    await page.locator("#login-email").waitFor({ state: "visible", timeout: 15_000 });

    // Log in with same credentials
    await login(page, user.email, user.password);

    // Should redirect away from auth page
    await page.waitForURL((url) => !url.pathname.includes("/auth/"), {
      timeout: 15_000,
    });
  });

  test("login with wrong password shows error", async ({ page }) => {
    await page.goto("/auth/login");
    await page.locator("#login-email").waitFor({ state: "visible", timeout: 15_000 });

    await login(page, "nonexistent@test.scopeai.com.au", "WrongPass123!");

    // Should show an error message
    await expect(
      page.getByText(/invalid email or password|something went wrong/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  test("protected route /account redirects to login", async ({ page }) => {
    await page.goto("/account");

    // Middleware should redirect to /auth/login
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("protected route /scope/* redirects to login", async ({ page }) => {
    await page.goto("/scope/some-fake-id");

    // Middleware should redirect to /auth/login
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("header shows user state after login", async ({ page }) => {
    // Create account and log in
    const user = testUser("header");
    await page.goto("/auth/signup");
    await page.locator("#signup-email").waitFor({ state: "visible", timeout: 15_000 });
    await signup(page, user.email, user.password, user.name);
    await page.waitForURL((url) => !url.pathname.includes("/auth/"), {
      timeout: 15_000,
    });

    // Navigate to home to see header
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Should show "Account" link and "Sign Out" button
    await expect(
      page.getByRole("link", { name: "Account" }).first()
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByRole("button", { name: /sign out/i }).first()
    ).toBeVisible();

    // Should NOT show "Sign In" link
    await expect(
      page.getByRole("link", { name: "Sign In" })
    ).toHaveCount(0);
  });

  test("logout works and redirects to home", async ({ page }) => {
    // Create account and log in
    const user = testUser("logout");
    await page.goto("/auth/signup");
    await page.locator("#signup-email").waitFor({ state: "visible", timeout: 15_000 });
    await signup(page, user.email, user.password, user.name);
    await page.waitForURL((url) => !url.pathname.includes("/auth/"), {
      timeout: 15_000,
    });

    // Navigate to home
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Wait for auth state to load and Sign Out to appear
    const signOutBtn = page.getByRole("button", { name: /sign out/i }).first();
    await expect(signOutBtn).toBeVisible({ timeout: 10_000 });

    // Click Sign Out
    await signOutBtn.click();

    // After logout, "Sign In" should reappear
    await expect(
      page.getByRole("link", { name: "Sign In" }).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});
