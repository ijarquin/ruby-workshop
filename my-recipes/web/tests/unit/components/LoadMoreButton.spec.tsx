/**
 * Unit tests — LoadMoreButton component
 *
 * Tests the isolated behaviour of the LoadMoreButton component created as part
 * of Feature 6: Mobile Load More Recipes Button.
 *
 * Scenarios covered (unit level):
 *   - Scenario 1: button renders when there are more pages
 *   - Scenario 3: button does not render on the last page (including edge cases)
 *   - Scenario 4: button is disabled and shows "Loading..." label while loading
 *   - Callback behaviour
 *   - Accessibility
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import LoadMoreButton from '@/components/LoadMoreButton';

afterEach(cleanup);

// ---------------------------------------------------------------------------
// Scenario 1 — button renders when there are more pages to load
// ---------------------------------------------------------------------------
describe('Scenario 1: Load More button renders when more pages exist', () => {
  it('renders the button when currentPage is less than totalPages', () => {
    render(
      <LoadMoreButton
        currentPage={1}
        totalPages={3}
        isLoading={false}
        onLoadMore={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
  });

  it('renders the button when on the penultimate page', () => {
    render(
      <LoadMoreButton
        currentPage={2}
        totalPages={3}
        isLoading={false}
        onLoadMore={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Scenario 3 — button is not rendered on the last page
// ---------------------------------------------------------------------------
describe('Scenario 3: Load More button is hidden on the last page', () => {
  it('renders nothing when currentPage equals totalPages', () => {
    const { container } = render(
      <LoadMoreButton
        currentPage={3}
        totalPages={3}
        isLoading={false}
        onLoadMore={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <LoadMoreButton
        currentPage={1}
        totalPages={1}
        isLoading={false}
        onLoadMore={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when totalPages is 0', () => {
    const { container } = render(
      <LoadMoreButton
        currentPage={1}
        totalPages={0}
        isLoading={false}
        onLoadMore={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});

// ---------------------------------------------------------------------------
// Scenario 4 — loading state: button is disabled and label changes
// ---------------------------------------------------------------------------
describe('Scenario 4: Load More button shows a loading state while fetching', () => {
  it('is disabled when isLoading is true', () => {
    render(
      <LoadMoreButton
        currentPage={1}
        totalPages={3}
        isLoading={true}
        onLoadMore={vi.fn()}
      />
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('displays a "Loading..." label when isLoading is true', () => {
    render(
      <LoadMoreButton
        currentPage={1}
        totalPages={3}
        isLoading={true}
        onLoadMore={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument();
  });

  it('is enabled and shows "Load More" when isLoading is false', () => {
    render(
      <LoadMoreButton
        currentPage={1}
        totalPages={3}
        isLoading={false}
        onLoadMore={vi.fn()}
      />
    );

    const button = screen.getByRole('button', { name: /load more/i });
    expect(button).not.toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// Callback behaviour
// ---------------------------------------------------------------------------
describe('LoadMoreButton callback', () => {
  it('calls onLoadMore when clicked', () => {
    const onLoadMore = vi.fn();
    render(
      <LoadMoreButton
        currentPage={1}
        totalPages={3}
        isLoading={false}
        onLoadMore={onLoadMore}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /load more/i }));

    expect(onLoadMore).toHaveBeenCalledOnce();
  });

  it('does not call onLoadMore when the button is in a loading state and clicked', () => {
    const onLoadMore = vi.fn();
    render(
      <LoadMoreButton
        currentPage={1}
        totalPages={3}
        isLoading={true}
        onLoadMore={onLoadMore}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(onLoadMore).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------
describe('LoadMoreButton edge cases', () => {
  it('renders nothing when currentPage is greater than totalPages', () => {
    const { container } = render(
      <LoadMoreButton
        currentPage={5}
        totalPages={3}
        isLoading={false}
        onLoadMore={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when totalPages is negative', () => {
    const { container } = render(
      <LoadMoreButton
        currentPage={1}
        totalPages={-1}
        isLoading={false}
        onLoadMore={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the button on the very first page of a two-page result set', () => {
    render(
      <LoadMoreButton
        currentPage={1}
        totalPages={2}
        isLoading={false}
        onLoadMore={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------
describe('LoadMoreButton accessibility', () => {
  it('has an accessible name when not loading', () => {
    render(
      <LoadMoreButton
        currentPage={1}
        totalPages={3}
        isLoading={false}
        onLoadMore={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Load More' })).toBeInTheDocument();
  });

  it('has an accessible name when loading', () => {
    render(
      <LoadMoreButton
        currentPage={1}
        totalPages={3}
        isLoading={true}
        onLoadMore={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Loading...' })).toBeInTheDocument();
  });
});
