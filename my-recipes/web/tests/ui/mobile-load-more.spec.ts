/**
 * Acceptance tests — Feature 6: Mobile Load More Recipes Button
 *
 * These are UI-level (Playwright) tests that run against the real Next.js app.
 * They are written in BDD style and correspond 1-to-1 with the six acceptance
 * scenarios defined in:
 *   documentation/specs/features/6-mobile-load-more-feature.md
 *
 * All tests use a 375 x 667 viewport (iPhone SE) for the mobile scenarios and
 * a 1280 x 800 viewport for the desktop/tablet scenario.
 *
 * These tests WILL FAIL until the feature is implemented.
 */

import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Perform an ingredient search and wait for results to appear. */
async function searchForRecipes(page: import('@playwright/test').Page, ingredients: string[]) {
  const input = page.getByPlaceholder('Add an ingredient (e.g. Chicken)...');
  // The button is the only type="submit" in the ingredient form.
  // Its visible label is "Add" on mobile (the " Ingredient" span is display:none
  // below sm breakpoint), so we target it by its role in the form instead.
  const addButton = page.locator('form button[type="submit"]');
  for (const ingredient of ingredients) {
    // pressSequentially types character-by-character, reliably firing onChange
    // on all browsers including WebKit where fill() can miss React state updates.
    await input.pressSequentially(ingredient);
    await addButton.click();
  }
  await page.getByRole('button', { name: /find recipes/i }).click();
}

// ---------------------------------------------------------------------------
// Scenario 1
// Load More button is shown on mobile when more pages exist
// ---------------------------------------------------------------------------
test.describe('Scenario 1: Load More button is shown on mobile when more pages exist', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('displays a Load More button below the recipe list on mobile when multiple pages exist', async ({ page }) => {
    await page.goto('/');
    // A broad search that is likely to return more than one page of results
    await searchForRecipes(page, ['egg']);

    const loadMoreButton = page.getByRole('button', { name: /load more/i });
    await expect(loadMoreButton).toBeVisible();
  });

  test('does not render the Pagination component on mobile', async ({ page }) => {
    await page.goto('/');
    await searchForRecipes(page, ['egg']);

    // The Pagination component renders "Page X of Y" text — it must not appear
    await expect(page.getByText(/page \d+ of \d+/i)).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Scenario 2
// Tapping Load More appends the next page of recipes
// ---------------------------------------------------------------------------
test.describe('Scenario 2: Tapping Load More appends the next page of recipes', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('appends new recipes below existing ones when Load More is tapped', async ({ page }) => {
    await page.goto('/');
    await searchForRecipes(page, ['egg']);

    // Wait for Load More to confirm first page is fully loaded
    await expect(page.getByRole('button', { name: /load more/i })).toBeVisible();

    // Count cards on the first page
    const cards = page.getByRole('heading', { level: 3 });
    const countBefore = await cards.count();
    expect(countBefore).toBeGreaterThan(0);

    await page.getByRole('button', { name: /load more/i }).click();

    // Wait for new cards to appear before asserting
    await expect(cards).not.toHaveCount(countBefore);

    // After tapping, total card count must be strictly greater (new cards appended)
    const countAfter = await cards.count();
    expect(countAfter).toBeGreaterThan(countBefore);
  });

  test('previously visible recipe cards remain on screen after Load More is tapped', async ({ page }) => {
    await page.goto('/');
    await searchForRecipes(page, ['egg']);

    // Wait for Load More to confirm recipe results are fully loaded
    await expect(page.getByRole('button', { name: /load more/i })).toBeVisible();

    // Capture the title of the very first recipe card rendered
    const firstCard = page.getByRole('heading', { level: 3 }).first();
    const firstTitle = await firstCard.innerText();

    await page.getByRole('button', { name: /load more/i }).click();

    // The first card must still exist in the DOM after appending
    await expect(page.getByRole('heading', { name: firstTitle })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Scenario 3
// Load More button is hidden after the last page is loaded
// ---------------------------------------------------------------------------
test.describe('Scenario 3: Load More button is hidden after the last page is loaded', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('hides the Load More button once all pages have been loaded', async ({ page }) => {
    await page.goto('/');
    // Use a specific search likely to return only a small, finite set of pages
    await searchForRecipes(page, ['salt', 'banana', 'rice', 'egg']);

    const loadMoreButton = page.getByRole('button', { name: /load more/i });

    // Exhaust all pages
    while (await loadMoreButton.isVisible()) {
      await loadMoreButton.click();
      // Wait for the button to either update or disappear
      await page.waitForTimeout(500);
    }

    await expect(loadMoreButton).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Scenario 4
// Load More button shows a loading state while fetching
// ---------------------------------------------------------------------------
test.describe('Scenario 4: Load More button shows a loading state while fetching', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('disables the Load More button and shows a loading label while the request is in flight', async ({ page }) => {
    await page.goto('/');
    await searchForRecipes(page, ['egg']);

    const loadMoreButton = page.getByRole('button', { name: /load more/i });
    await expect(loadMoreButton).toBeVisible();

    // Click and immediately assert the disabled / loading state before the
    // response arrives. We slow down the network to make the window observable.
    await page.route('**/api/v1/recipes**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.continue();
    });

    await loadMoreButton.click();

    // While in-flight the button label changes to "Loading..." — locate by the
    // new accessible name to avoid a stale-locator mismatch.
    const loadingButton = page.getByRole('button', { name: /loading/i });
    await expect(loadingButton).toBeVisible();
    await expect(loadingButton).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// Scenario 5
// Desktop and tablet viewports render the Pagination component
// ---------------------------------------------------------------------------
test.describe('Scenario 5: Desktop and tablet viewports render the Pagination component', () => {
  test('renders the Pagination component and no Load More button on a desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await searchForRecipes(page, ['egg']);

    await expect(page.getByText(/page \d+ of \d+/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /load more/i })).not.toBeVisible();
  });

  test('renders the Pagination component and no Load More button on a tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await searchForRecipes(page, ['egg']);

    await expect(page.getByText(/page \d+ of \d+/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /load more/i })).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Scenario 6
// Accumulated list resets when search parameters change
// ---------------------------------------------------------------------------
test.describe('Scenario 6: Accumulated list resets when search parameters change', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('clears accumulated recipes and shows only the first page when a new search is submitted', async ({ page }) => {
    await page.goto('/');
    await searchForRecipes(page, ['egg']);

    // Load a second page to build up an accumulated list
    const loadMoreButton = page.getByRole('button', { name: /load more/i });
    if (await loadMoreButton.isVisible()) {
      await loadMoreButton.click();
      await page.waitForTimeout(500);
    }

    const countAfterLoadMore = await page.getByRole('heading', { level: 3 }).count();
    expect(countAfterLoadMore).toBeGreaterThan(0);

    // Submit a completely different search
    const input = page.getByPlaceholder('Add an ingredient (e.g. Chicken)...');
    await input.fill('chicken');
    await input.press('Enter');
    await page.getByRole('button', { name: /find recipes/i }).click();

    // Wait for new results to appear
    await expect(page.getByRole('heading', { level: 3 }).first()).toBeVisible();

    // The card count must have reset to a single page's worth
    const countAfterNewSearch = await page.getByRole('heading', { level: 3 }).count();
    expect(countAfterNewSearch).toBeLessThanOrEqual(countAfterLoadMore);
  });

  test('shows the Load More button again after a new search if more pages exist', async ({ page }) => {
    await page.goto('/');
    await searchForRecipes(page, ['egg']);

    // Exhaust pages from the first search
    const loadMoreButton = page.getByRole('button', { name: /load more/i });
    while (await loadMoreButton.isVisible()) {
      await loadMoreButton.click();
      await page.waitForTimeout(500);
    }

    // Submit a new search that also has multiple pages
    const input = page.getByPlaceholder('Add an ingredient (e.g. Chicken)...');
    await input.fill('salt');
    await input.press('Enter');
    await page.getByRole('button', { name: /find recipes/i }).click();

    // The Load More button should reappear for the new multi-page result set
    await expect(page.getByRole('button', { name: /load more/i })).toBeVisible();
  });
});
