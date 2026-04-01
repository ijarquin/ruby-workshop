import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import RecipeDetailPanel from '@/components/RecipeDetailsPanel';
import { Recipe } from '@/hooks/useRecipes';

afterEach(cleanup);

const mockRecipe: Recipe = {
  id: 1,
  title: 'Sugar Free Banana Bread',
  image: 'https://example.com/banana-bread.jpg',
  category: 'Dessert',
  cook_time: 60,
  prep_time: 15,
  ratings: 4.5,
  author: 'Jane Doe',
  ingredients: [
    { id: 1, name: 'Banana' },
    { id: 2, name: 'Egg' },
    { id: 3, name: 'Salt' },
    { id: 4, name: 'Rice flour' },
  ],
};

const renderPanel = (overrides: { isFavourited?: boolean; onFavouriteToggle?: () => void; onClose?: () => void } = {}) =>
  render(
    <RecipeDetailPanel
      recipe={mockRecipe}
      onClose={overrides.onClose ?? vi.fn()}
      isFavourited={overrides.isFavourited ?? false}
      onFavouriteToggle={overrides.onFavouriteToggle ?? vi.fn()}
    />
  );

describe('RecipeDetailPanel', () => {
  it('displays the recipe title', () => {
    renderPanel();

    expect(screen.getByRole('heading', { name: 'Sugar Free Banana Bread' })).toBeInTheDocument();
  });

  it('displays the author', () => {
    renderPanel();

    expect(screen.getByText('By Jane Doe')).toBeInTheDocument();
  });

  it('displays all ingredients', () => {
    renderPanel();

    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Egg')).toBeInTheDocument();
    expect(screen.getByText('Salt')).toBeInTheDocument();
    expect(screen.getByText('Rice flour')).toBeInTheDocument();
  });

  it('displays the category', () => {
    renderPanel();

    expect(screen.getByText('Dessert')).toBeInTheDocument();
  });

  it('displays the cook time', () => {
    renderPanel();

    expect(screen.getByText('60 mins')).toBeInTheDocument();
  });

  it('displays the prep time', () => {
    renderPanel();

    expect(screen.getByText('15 mins')).toBeInTheDocument();
  });

  it('displays the rating', () => {
    renderPanel();

    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    renderPanel({ onClose });

    fireEvent.click(screen.getByRole('button', { name: 'Close details' }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('shows the save to favourites button when not favourited', () => {
    renderPanel({ isFavourited: false });

    expect(screen.getByRole('button', { name: 'Save to favourites' })).toBeInTheDocument();
  });

  it('shows the remove from favourites button when already favourited', () => {
    renderPanel({ isFavourited: true });

    expect(screen.getByRole('button', { name: 'Remove from favourites' })).toBeInTheDocument();
  });

  it('calls onFavouriteToggle when the favourite button is clicked', () => {
    const onFavouriteToggle = vi.fn();
    renderPanel({ onFavouriteToggle });

    fireEvent.click(screen.getByRole('button', { name: 'Save to favourites' }));

    expect(onFavouriteToggle).toHaveBeenCalledOnce();
  });

  it('shows a saved notification when adding to favourites', () => {
    renderPanel({ isFavourited: false });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Save to favourites' }));

    expect(screen.getByRole('status')).toHaveTextContent('Your recipe has been saved to your favourites.');
  });

  it('shows a removed notification when removing from favourites', () => {
    renderPanel({ isFavourited: true });

    fireEvent.click(screen.getByRole('button', { name: 'Remove from favourites' }));

    expect(screen.getByRole('status')).toHaveTextContent('This recipe has been removed from your list of favourites.');
  });

  it('dismisses the notification when the close notification button is clicked', () => {
    renderPanel({ isFavourited: false });

    fireEvent.click(screen.getByRole('button', { name: 'Save to favourites' }));
    expect(screen.getByRole('status')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close notification' }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
