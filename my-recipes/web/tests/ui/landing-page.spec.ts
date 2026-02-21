import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Header', () => {
  test('displays the logo', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'MyRecipes' })).toBeVisible();
  });

  test('displays the three navigation links', async ({ page }) => {
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Saved Recipes' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
  });
});

test.describe('Main content', () => {
  test('displays the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Discover Delicious Recipes');
  });

  test('displays the page description', async ({ page }) => {
    await expect(page.getByText('Find and share the best recipes from around the world')).toBeVisible();
  });
});

test.describe('Ingredient search', () => {
  test('displays the ingredient input', async ({ page }) => {
    await expect(page.getByPlaceholder('Add an ingredient (e.g. Chicken)...')).toBeVisible();
  });

  test('displays the add ingredient button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /add ingredient/i })).toBeVisible();
  });
});

test.describe('Footer', () => {
  test('displays the footer', async ({ page }) => {
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });
});

test.describe('Recipe details panel', () => {
  test('adapts from 3-column to 1-column layout when switching to mobile', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const ingredientInput = page.getByPlaceholder('Add an ingredient (e.g. Chicken)...');
    for (const ingredient of ['salt', 'banana', 'rice', 'egg']) {
      await ingredientInput.fill(ingredient);
      await ingredientInput.press('Enter');
    }
    await page.getByRole('button', { name: /find recipes/i }).click();
    await expect(page.getByText('Sugar Free Banana Bread')).toBeVisible();
    await page.getByRole('heading', { name: 'Sugar Free Banana Bread' }).first().click();
    await expect(page.getByRole('button', { name: 'Close details' })).toBeVisible();

    const getGridColumnCount = () =>
      page.evaluate(() => {
        const heading = Array.from(document.querySelectorAll('h4')).find(
          (h) => h.textContent?.trim() === 'Ingredients'
        );
        const grid = heading?.closest('.grid');
        if (!grid) return null;
        return window.getComputedStyle(grid).gridTemplateColumns.split(' ').length;
      });

    expect(await getGridColumnCount()).toBe(3);

    await page.setViewportSize({ width: 375, height: 667 });

    expect(await getGridColumnCount()).toBe(1);
  });
});
