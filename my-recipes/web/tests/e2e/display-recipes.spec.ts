import { test, expect } from '@playwright/test';

test.describe('Display recipes', () => {
  test('displays matching recipes after searching with ingredients', async ({ page }) => {
    await page.goto('/');

    const ingredientInput = page.getByPlaceholder('Add an ingredient (e.g. Chicken)...');

    for (const ingredient of ['salt', 'banana', 'rice', 'egg']) {
      await ingredientInput.fill(ingredient);
      await ingredientInput.press('Enter');
    }

    await page.getByRole('button', { name: /find recipes/i }).click();

    await expect(page.getByText('Sugar Free Banana Bread')).toBeVisible();
    await expect(page.getByText('Gluten-Free Banana Bread')).toBeVisible();
  });

  test('opens recipe details panel when clicking on a recipe card', async ({ page }) => {
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
    await expect(page.getByRole('heading', { name: 'Ingredients' })).toBeVisible();
  });
});
