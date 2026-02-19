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

test.describe('Footer', () => {
  test('displays the footer', async ({ page }) => {
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });
});
