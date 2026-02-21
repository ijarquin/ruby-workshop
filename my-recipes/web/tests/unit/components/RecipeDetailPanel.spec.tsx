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

describe('RecipeDetailPanel', () => {
  it('displays the recipe title', () => {
    render(<RecipeDetailPanel recipe={mockRecipe} onClose={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Sugar Free Banana Bread' })).toBeInTheDocument();
  });

  it('displays the author', () => {
    render(<RecipeDetailPanel recipe={mockRecipe} onClose={vi.fn()} />);

    expect(screen.getByText('By Jane Doe')).toBeInTheDocument();
  });

  it('displays all ingredients', () => {
    render(<RecipeDetailPanel recipe={mockRecipe} onClose={vi.fn()} />);

    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Egg')).toBeInTheDocument();
    expect(screen.getByText('Salt')).toBeInTheDocument();
    expect(screen.getByText('Rice flour')).toBeInTheDocument();
  });

  it('displays the category', () => {
    render(<RecipeDetailPanel recipe={mockRecipe} onClose={vi.fn()} />);

    expect(screen.getByText('Dessert')).toBeInTheDocument();
  });

  it('displays the cook time', () => {
    render(<RecipeDetailPanel recipe={mockRecipe} onClose={vi.fn()} />);

    expect(screen.getByText('60 mins')).toBeInTheDocument();
  });

  it('displays the prep time', () => {
    render(<RecipeDetailPanel recipe={mockRecipe} onClose={vi.fn()} />);

    expect(screen.getByText('15 mins')).toBeInTheDocument();
  });

  it('displays the rating', () => {
    render(<RecipeDetailPanel recipe={mockRecipe} onClose={vi.fn()} />);

    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<RecipeDetailPanel recipe={mockRecipe} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close details' }));

    expect(onClose).toHaveBeenCalledOnce();
  });
});
