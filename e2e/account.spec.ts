import { test, expect } from "./fixtures";

test.describe("Account Dashboard", () => {
  test("shows empty state with New Scope CTA when no projects", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/account");
    await page.waitForLoadState("domcontentloaded");

    // Should show "Your Projects" heading
    await expect(
      page.getByRole("heading", { name: "Your Projects" })
    ).toBeVisible({ timeout: 10_000 });

    // Fresh test user has no projects — empty state should show
    await expect(page.getByText("No projects yet")).toBeVisible({
      timeout: 10_000,
    });
    await expect(
      page.getByRole("link", { name: "Start Your First Scope" })
    ).toBeVisible();
  });

  test("Settings link navigates to /account/settings", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/account");
    await page.waitForLoadState("domcontentloaded");

    await expect(
      page.getByRole("heading", { name: "Your Projects" })
    ).toBeVisible({ timeout: 10_000 });

    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page).toHaveURL(/\/account\/settings/);
  });

  test("New Scope button navigates to /create", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/account");
    await page.waitForLoadState("domcontentloaded");

    await expect(
      page.getByRole("heading", { name: "Your Projects" })
    ).toBeVisible({ timeout: 10_000 });

    await page.getByRole("link", { name: "New Scope" }).click();
    await expect(page).toHaveURL(/\/create/);
  });

  test("settings page loads profile form", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/account/settings");
    await page.waitForLoadState("domcontentloaded");

    // Wait for heading
    await expect(
      page.getByRole("heading", { name: "Settings" })
    ).toBeVisible({ timeout: 10_000 });

    // Profile section visible
    await expect(page.getByText("Profile")).toBeVisible();

    // Name input present
    await expect(page.locator("#fullName")).toBeVisible({ timeout: 10_000 });

    // Email input present and disabled
    const emailInput = page.locator("#email");
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeDisabled();
  });

  test("profile name can be edited", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/account/settings");
    await page.waitForLoadState("domcontentloaded");

    // Wait for form to load
    await expect(page.locator("#fullName")).toBeVisible({ timeout: 10_000 });

    // Edit the name
    await page.locator("#fullName").fill("Updated Name");

    // Save button should become enabled
    const saveBtn = page.getByRole("button", { name: "Save Changes" });
    await expect(saveBtn).toBeEnabled();
  });

  test("delete account shows confirmation dialog", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/account/settings");
    await page.waitForLoadState("domcontentloaded");

    // Wait for page to load
    await expect(
      page.getByRole("heading", { name: "Settings" })
    ).toBeVisible({ timeout: 10_000 });

    // Scroll to danger zone and click delete button
    const deleteBtn = page.getByRole("button", { name: "Delete Account" });
    await deleteBtn.scrollIntoViewIfNeeded();
    await deleteBtn.click();

    // Confirmation dialog should appear
    await expect(page.getByText("Delete your account?")).toBeVisible();
    await expect(
      page.getByText("This will permanently delete")
    ).toBeVisible();

    // Cancel and confirm buttons
    await expect(
      page.getByRole("button", { name: "Cancel" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Yes, delete everything" })
    ).toBeVisible();

    // Click cancel to close dialog
    await page.getByRole("button", { name: "Cancel" }).click();
  });

  test("back to projects link works on settings page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/account/settings");
    await page.waitForLoadState("domcontentloaded");

    await expect(
      page.getByRole("heading", { name: "Settings" })
    ).toBeVisible({ timeout: 10_000 });

    await page.getByRole("link", { name: /Back to projects/i }).click();
    await expect(page).toHaveURL(/\/account$/);
  });
});
