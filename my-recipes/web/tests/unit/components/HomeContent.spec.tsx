/**
 * Integration tests — HomeContent component
 *
 * Covers the mobile load-more accumulation logic, the desktop pagination
 * branch, loading / error / empty states, and the search-change reset.
 *
 * All external dependencies (Next.js navigation, useRecipes, useWindowSize,
 * next/image) are mocked so the tests run in jsdom without a real router or
 * network.
 */

import {
  describe,
  it,
  expect,
  vi,
  afterEach,
  beforeEach,
  type Mock,
} from 'vitest';
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import React from 'react';
import HomeContent from '@/components/HomeContent';
import type { RecipesResponse } from '@/hooks/useRecipes';

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

vi.mock('@/hooks/useRecipes', () => ({
  useRecipes: vi.fn(),
}));

vi.mock('@/hooks/useWindowSize', () => ({
  default: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Imports after mocks are registered
// ---------------------------------------------------------------------------

import { useSearchParams, useRouter } from 'next/navigation';
import { useRecipes } from '@/hooks/useRecipes';
import useWindowSize from '@/hooks/useWindowSize';

// ---------------------------------------------------------------------------
// Test data factories
// ---------------------------------------------------------------------------

const makeRecipe = (id: number) => ({
  id,
  title: `Recipe ${id}`,
  image: `https://example.com/recipe-${id}.jpg`,
  category: 'Main',
  ingredients: [{ id: 1, name: 'Salt' }],
});

const makeResponse = (
  recipes: ReturnType<typeof makeRecipe>[],
  currentPage = 1,
  totalPages = 3,
): RecipesResponse => ({ recipes, current_page: currentPage, total_pages: totalPages });

const PAGE_1_RECIPES = [makeRecipe(1), makeRecipe(2), makeRecipe(3)];
const PAGE_2_RECIPES = [makeRecipe(4), makeRecipe(5), makeRecipe(6)];
const PAGE_3_RECIPES = [makeRecipe(7)];

// ---------------------------------------------------------------------------
// Shared setup helpers
// ---------------------------------------------------------------------------

const mockRouter = { push: vi.fn(), replace: vi.fn() };

function setupSearchParams(ingredients: string[], page = '1') {
  const params = new URLSearchParams();
  ingredients.forEach((i) => params.append('ingredients', i));
  params.set('page', page);

  (useSearchParams as Mock).mockReturnValue({
    getAll: (key: string) => (key === 'ingredients' ? ingredients : []),
    get: (key: string) => (key === 'page' ? page : null),
    toString: () => params.toString(),
  });
}

function setupWindowSize(width: number) {
  (useWindowSize as Mock).mockReturnValue({ width, height: 800 });
}

function setupRecipes(response: RecipesResponse) {
  (useRecipes as Mock).mockReturnValue({
    data: response,
    isLoading: false,
    isError: false,
  });
}

function setupLoading() {
  (useRecipes as Mock).mockReturnValue({
    data: undefined,
    isLoading: true,
    isError: false,
  });
}

function setupError() {
  (useRecipes as Mock).mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: true,
  });
}

// ---------------------------------------------------------------------------
// Shared test setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  (useRouter as Mock).mockReturnValue(mockRouter);
  vi.clearAllMocks();
});

afterEach(cleanup);

// ===========================================================================
// 1. No ingredients — landing state
// ===========================================================================
describe('No ingredients in URL', () => {
  it('renders the KitchenTipsGrid when no ingredients are provided', () => {
    setupSearchParams([]);
    setupWindowSize(1280);
    setupRecipes(makeResponse([]));

    render(<HomeContent />);

    // KitchenTipsGrid renders tips with h3 headings such as "Season in Layers"
    expect(screen.getByRole('heading', { name: 'Season in Layers' })).toBeInTheDocument();
  });

  it('does not render recipe cards when no ingredients are provided', () => {
    setupSearchParams([]);
    setupWindowSize(1280);
    setupRecipes(makeResponse([]));

    render(<HomeContent />);

    expect(screen.queryByRole('heading', { name: /recipe \d/i })).not.toBeInTheDocument();
  });

  it('does not render the Pagination component when no ingredients are provided', () => {
    setupSearchParams([]);
    setupWindowSize(1280);
    setupRecipes(makeResponse([]));

    render(<HomeContent />);

    expect(screen.queryByText(/page \d+ of \d+/i)).not.toBeInTheDocument();
  });
});

// ===========================================================================
// 2. Loading state
// ===========================================================================
describe('Loading state', () => {
  it('renders skeleton cards while loading and no recipes are accumulated', () => {
    setupSearchParams(['egg']);
    setupWindowSize(1280);
    setupLoading();

    const { container } = render(<HomeContent />);

    // RecipeCardSkeletonLoading renders animate-pulse divs; there are 9 of them
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(9);
  });

  it('does not render recipe cards while loading', () => {
    setupSearchParams(['egg']);
    setupWindowSize(1280);
    setupLoading();

    render(<HomeContent />);

    expect(screen.queryByRole('heading', { name: /recipe \d/i })).not.toBeInTheDocument();
  });
});

// ===========================================================================
// 3. Error state
// ===========================================================================
describe('Error state', () => {
  it('renders an error message when the API call fails', () => {
    setupSearchParams(['egg']);
    setupWindowSize(1280);
    setupError();

    render(<HomeContent />);

    expect(screen.getByText(/error loading recipes/i)).toBeInTheDocument();
  });

  it('does not render the Pagination component on error', () => {
    setupSearchParams(['egg']);
    setupWindowSize(1280);
    setupError();

    render(<HomeContent />);

    expect(screen.queryByText(/page \d+ of \d+/i)).not.toBeInTheDocument();
  });

  it('does not render the LoadMoreButton on error', () => {
    setupSearchParams(['egg']);
    setupWindowSize(375);
    setupError();

    render(<HomeContent />);

    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
  });
});

// ===========================================================================
// 4. Empty results
// ===========================================================================
describe('Empty results', () => {
  it('renders a "No recipes found" message when results are empty', () => {
    setupSearchParams(['xyz']);
    setupWindowSize(1280);
    setupRecipes(makeResponse([], 1, 0));

    render(<HomeContent />);

    expect(screen.getByText(/no recipes found/i)).toBeInTheDocument();
  });

  it('does not render the LoadMoreButton when there are no results', () => {
    setupSearchParams(['xyz']);
    setupWindowSize(375);
    setupRecipes(makeResponse([], 1, 0));

    render(<HomeContent />);

    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
  });
});

// ===========================================================================
// 5. Desktop viewport — Pagination, not LoadMoreButton
// ===========================================================================
describe('Desktop viewport (width >= 640px)', () => {
  it('renders recipe cards on desktop', () => {
    setupSearchParams(['egg']);
    setupWindowSize(1280);
    setupRecipes(makeResponse(PAGE_1_RECIPES));

    render(<HomeContent />);

    expect(screen.getByRole('heading', { name: 'Recipe 1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Recipe 2' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Recipe 3' })).toBeInTheDocument();
  });

  it('renders the Pagination component on desktop when multiple pages exist', () => {
    setupSearchParams(['egg']);
    setupWindowSize(1280);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 3));

    render(<HomeContent />);

    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
  });

  it('does not render the LoadMoreButton on desktop', () => {
    setupSearchParams(['egg']);
    setupWindowSize(1280);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 3));

    render(<HomeContent />);

    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
  });

  it('renders the Pagination component on a tablet viewport (768px)', () => {
    setupSearchParams(['egg']);
    setupWindowSize(768);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 3));

    render(<HomeContent />);

    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
  });

  it('does not render Pagination when there is only one page', () => {
    setupSearchParams(['egg']);
    setupWindowSize(1280);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 1));

    render(<HomeContent />);

    expect(screen.queryByText(/page \d+ of \d+/i)).not.toBeInTheDocument();
  });
});

// ===========================================================================
// 6. Mobile viewport — LoadMoreButton, not Pagination
// ===========================================================================
describe('Mobile viewport (width < 640px)', () => {
  it('renders recipe cards on mobile', () => {
    setupSearchParams(['egg']);
    setupWindowSize(375);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 3));

    render(<HomeContent />);

    expect(screen.getByRole('heading', { name: 'Recipe 1' })).toBeInTheDocument();
  });

  it('renders the LoadMoreButton on mobile when more pages exist', () => {
    setupSearchParams(['egg']);
    setupWindowSize(375);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 3));

    render(<HomeContent />);

    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
  });

  it('does not render the Pagination component on mobile', () => {
    setupSearchParams(['egg']);
    setupWindowSize(375);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 3));

    render(<HomeContent />);

    expect(screen.queryByText(/page \d+ of \d+/i)).not.toBeInTheDocument();
  });

  it('does not render the LoadMoreButton when totalPages equals 1', () => {
    // mobilePage starts at 1; LoadMoreButton hides when mobilePage >= totalPages
    setupSearchParams(['egg']);
    setupWindowSize(375);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 1));

    render(<HomeContent />);

    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
  });

  it('does not render the LoadMoreButton when there is only one page', () => {
    setupSearchParams(['egg']);
    setupWindowSize(375);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 1));

    render(<HomeContent />);

    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
  });
});

// ===========================================================================
// 7. Mobile — recipe accumulation across Load More taps
// ===========================================================================
describe('Mobile recipe accumulation', () => {
  it('shows first-page recipes in the list initially', async () => {
    setupSearchParams(['egg']);
    setupWindowSize(375);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 3));

    render(<HomeContent />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Recipe 1' })).toBeInTheDocument();
    });
    expect(screen.queryByRole('heading', { name: 'Recipe 4' })).not.toBeInTheDocument();
  });

  it('appends second-page recipes when Load More is tapped', async () => {
    setupSearchParams(['egg']);
    setupWindowSize(375);

    // Start with page 1
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 3));
    render(<HomeContent />);

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Recipe 1' })).toBeInTheDocument()
    );

    // Advance the mock to return page 2 when useRecipes is called again
    (useRecipes as Mock).mockReturnValue({
      data: makeResponse(PAGE_2_RECIPES, 2, 3),
      isLoading: false,
      isError: false,
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /load more/i }));
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Recipe 4' })).toBeInTheDocument();
    });
  });

  it('keeps first-page recipes visible after Load More is tapped', async () => {
    setupSearchParams(['egg']);
    setupWindowSize(375);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 3));
    render(<HomeContent />);

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Recipe 1' })).toBeInTheDocument()
    );

    (useRecipes as Mock).mockReturnValue({
      data: makeResponse(PAGE_2_RECIPES, 2, 3),
      isLoading: false,
      isError: false,
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /load more/i }));
    });

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Recipe 4' })).toBeInTheDocument()
    );

    // Page-1 recipe must still be in the DOM
    expect(screen.getByRole('heading', { name: 'Recipe 1' })).toBeInTheDocument();
  });

  it('hides the LoadMoreButton once the last page is appended', async () => {
    setupSearchParams(['egg']);
    setupWindowSize(375);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 2));
    render(<HomeContent />);

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument()
    );

    (useRecipes as Mock).mockReturnValue({
      data: makeResponse(PAGE_2_RECIPES, 2, 2),
      isLoading: false,
      isError: false,
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /load more/i }));
    });

    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument()
    );
  });

  it('shows a loading indicator on the button while the next page is in flight', async () => {
    setupSearchParams(['egg']);
    setupWindowSize(375);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 3));
    render(<HomeContent />);

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument()
    );

    // Simulate the in-flight state: new page has been requested but not yet
    // resolved. data is undefined; totalPages is persisted in component state
    // from the prior successful fetch, so the button stays visible.
    (useRecipes as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /load more/i }));
    });

    // The button should now show "Loading..." and be disabled
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument()
    );
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
  });

  it('does not show the skeleton while loading more (already has recipes)', async () => {
    setupSearchParams(['egg']);
    setupWindowSize(375);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 3));

    const { container } = render(<HomeContent />);

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Recipe 1' })).toBeInTheDocument()
    );

    // Trigger a load-more; mock goes into loading state (data undefined
    // while next page is in flight; totalPages persisted from prior render)
    (useRecipes as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /load more/i }));
    });

    // Skeletons must NOT appear — existing cards should stay visible
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(0);
    // Use getAllByRole since there could be exactly one Recipe 1 heading
    expect(screen.getAllByRole('heading', { name: 'Recipe 1' })).toHaveLength(1);
  });
});

// ===========================================================================
// 8. Search reset — accumulated list clears on new search
// ===========================================================================
describe('Accumulated list resets on search change', () => {
  it('clears accumulated recipes when the ingredients key changes', async () => {
    // Start with 'egg' search, two pages loaded
    setupSearchParams(['egg']);
    setupWindowSize(375);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 3));

    const { rerender } = render(<HomeContent />);

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Recipe 1' })).toBeInTheDocument()
    );

    // Simulate a second-page tap
    (useRecipes as Mock).mockReturnValue({
      data: makeResponse(PAGE_2_RECIPES, 2, 3),
      isLoading: false,
      isError: false,
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /load more/i }));
    });

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Recipe 4' })).toBeInTheDocument()
    );

    // Now simulate a new search by changing the mocked searchParams
    setupSearchParams(['chicken']);
    (useRecipes as Mock).mockReturnValue({
      data: makeResponse([makeRecipe(10), makeRecipe(11)], 1, 2),
      isLoading: false,
      isError: false,
    });

    await act(async () => {
      rerender(<HomeContent />);
    });

    // Old recipes must be gone; new ones must be present
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Recipe 10' })).toBeInTheDocument()
    );

    expect(screen.queryByRole('heading', { name: 'Recipe 1' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Recipe 4' })).not.toBeInTheDocument();
  });

  it('re-shows the LoadMoreButton after a new search with multiple pages', async () => {
    setupSearchParams(['egg']);
    setupWindowSize(375);

    // First search, only 1 page — button never appears
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 1));
    const { rerender } = render(<HomeContent />);

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Recipe 1' })).toBeInTheDocument()
    );

    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();

    // New search with 3 pages
    setupSearchParams(['chicken']);
    (useRecipes as Mock).mockReturnValue({
      data: makeResponse([makeRecipe(10), makeRecipe(11)], 1, 3),
      isLoading: false,
      isError: false,
    });

    await act(async () => {
      rerender(<HomeContent />);
    });

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument()
    );
  });
});

// ===========================================================================
// 9. Page header and navigation chrome
// ===========================================================================
describe('Page chrome', () => {
  it('renders the main heading', () => {
    setupSearchParams([]);
    setupWindowSize(1280);
    setupRecipes(makeResponse([]));

    render(<HomeContent />);

    expect(
      screen.getByRole('heading', { name: /discover delicious recipes/i })
    ).toBeInTheDocument();
  });
});

// ===========================================================================
// 10. Desktop pagination — page-change callback
// ===========================================================================
describe('Desktop pagination interaction', () => {
  it('calls router.replace with the next page when the Next button is clicked', () => {
    setupSearchParams(['egg'], '1');
    setupWindowSize(1280);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 3));

    render(<HomeContent />);

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(mockRouter.replace).toHaveBeenCalledWith(expect.stringContaining('page=2'));
  });

  it('calls router.replace with the previous page when the Prev button is clicked', () => {
    setupSearchParams(['egg'], '2');
    setupWindowSize(1280);
    setupRecipes(makeResponse(PAGE_2_RECIPES, 2, 3));

    render(<HomeContent />);

    fireEvent.click(screen.getByRole('button', { name: /prev/i }));

    expect(mockRouter.replace).toHaveBeenCalledWith(expect.stringContaining('page=1'));
  });

  it('disables the Prev button on the first page', () => {
    setupSearchParams(['egg'], '1');
    setupWindowSize(1280);
    setupRecipes(makeResponse(PAGE_1_RECIPES, 1, 3));

    render(<HomeContent />);

    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  });

  it('disables the Next button on the last page', () => {
    setupSearchParams(['egg'], '3');
    setupWindowSize(1280);
    setupRecipes(makeResponse(PAGE_3_RECIPES, 3, 3));

    render(<HomeContent />);

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });
});
