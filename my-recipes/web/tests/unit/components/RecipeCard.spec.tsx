import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import RecipeCard from '@/components/RecipeCard';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

afterEach(cleanup);

const defaultProps = {
  title: 'Sugar Free Banana Bread',
  imageURL: 'https://example.com/banana-bread.jpg',
  category: 'Dessert',
};

describe('RecipeCard', () => {
  it('displays the recipe title', () => {
    render(<RecipeCard {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Sugar Free Banana Bread' })).toBeInTheDocument();
  });

  it('displays the recipe image with the title as alt text', () => {
    render(<RecipeCard {...defaultProps} />);

    expect(screen.getByAltText('Sugar Free Banana Bread')).toBeInTheDocument();
  });

  it('displays the category badge', () => {
    render(<RecipeCard {...defaultProps} />);

    expect(screen.getByText('Dessert')).toBeInTheDocument();
  });

  it('displays an overlay message when hovering over the card', () => {
    render(<RecipeCard {...defaultProps} />);

    fireEvent.mouseEnter(screen.getByRole('heading', { name: 'Sugar Free Banana Bread' }).closest('div')!);

    expect(screen.getByText('Click to show recipe preparation details')).toBeInTheDocument();
  });
});
