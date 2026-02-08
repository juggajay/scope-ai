import { test, expect } from "@playwright/test";

test.describe("Error States", () => {
  test("nonexistent page shows custom 404", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");

    await expect(page.getByText("404")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Page not found" })
    ).toBeVisible();
    await expect(
      page.getByText(/doesn't exist or has been moved/i)
    ).toBeVisible();
  });

  test('404 "Go Home" link navigates to /', async ({ page }) => {
    await page.goto("/this-page-does-not-exist");

    await page.getByRole("link", { name: "Go Home" }).click();
    await expect(page).toHaveURL("/");
  });

  test('404 "Start a Scope" link navigates to /create', async ({ page }) => {
    await page.goto("/this-page-does-not-exist");

    await page.getByRole("link", { name: "Start a Scope" }).click();
    await expect(page).toHaveURL(/\/create/);
  });
});
