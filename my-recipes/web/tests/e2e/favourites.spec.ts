import { test, expect } from "@playwright/test";

test.describe("Favourites page", () => {
  test("navigates to /recipes/favourites when clicking the Saved Recipes header link", async ({
    page,
  }) => {
    await page.goto("/recipes");

    await page.getByRole("link", { name: "Saved Recipes" }).click();

    await expect(page).toHaveURL("/recipes/favourites");
  });

  test("renders the page title on the favourites page", async ({ page }) => {
    await page.goto("/recipes/favourites");

    await expect(
      page.getByRole("heading", { name: /your favourites recipes/i }),
    ).toBeVisible();
  });

  test("highlights the Saved Recipes nav link as active on the favourites page", async ({
    page,
  }) => {
    await page.goto("/recipes/favourites");

    const savedRecipesLink = page.getByRole("link", { name: "Saved Recipes" });

    await expect(savedRecipesLink).toHaveClass(/border-amber-700/);
  });

  test("opens the recipe details panel when clicking a recipe card", async ({
    page,
  }) => {
    await page.goto("/recipes/favourites");

    await page
      .getByRole("heading", { name: "Spaghetti Carbonara" })
      .first()
      .click();

    await expect(
      page.getByRole("button", { name: "Close details" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Ingredients" }),
    ).toBeVisible();
  });
});
