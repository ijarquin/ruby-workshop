import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 375, height: 667 } });

test.beforeEach(async ({ page }) => {
  await page.goto("/recipes");
});

test.describe("Hamburger menu (mobile)", () => {
  test("displays the hamburger button on mobile", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Open menu" }),
    ).toBeVisible();
  });

  test("does not display the desktop nav links on mobile", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Home" })).not.toBeVisible();
    await expect(
      page.getByRole("link", { name: "Saved Recipes" }),
    ).not.toBeVisible();
    await expect(page.getByRole("link", { name: "About" })).not.toBeVisible();
  });

  test("opens the menu overlay when the hamburger button is clicked", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Open menu" }).click();

    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Saved Recipes" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "About" })).toBeVisible();
  });

  test("closes the menu when the close button is clicked", async ({ page }) => {
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();

    await page.getByRole("button", { name: "Close menu" }).click();

    await expect(page.getByRole("link", { name: "Home" })).not.toBeVisible();
  });

  test("closes the menu and navigates when a link is clicked", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("link", { name: "Saved Recipes" }).click();

    await expect(page).toHaveURL("/recipes/favourites");
    await expect(
      page.getByRole("button", { name: "Open menu" }),
    ).toBeVisible();
  });
});
