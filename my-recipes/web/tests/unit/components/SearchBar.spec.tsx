import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';

afterEach(cleanup);

const addIngredient = (name: string) => {
  fireEvent.change(
    screen.getByPlaceholderText('Add an ingredient (e.g. Chicken)...'),
    { target: { value: name } }
  );
  fireEvent.submit(
    screen.getByPlaceholderText('Add an ingredient (e.g. Chicken)...').closest('form')!
  );
};

describe('SearchBar', () => {
  describe('Input behaviour', () => {
    it('clears the input field after a successful add', () => {
      render(<SearchBar onSearch={vi.fn()} />);

      addIngredient('Chicken');

      expect(screen.getByPlaceholderText('Add an ingredient (e.g. Chicken)...')).toHaveValue('');
    });

    it('does not add an ingredient when the input is empty', () => {
      render(<SearchBar onSearch={vi.fn()} />);

      addIngredient('');

      expect(screen.queryByRole('button', { name: /find recipes/i })).not.toBeInTheDocument();
    });

    it('does not add an ingredient when the input contains only whitespace', () => {
      render(<SearchBar onSearch={vi.fn()} />);

      addIngredient('   ');

      expect(screen.queryByRole('button', { name: /find recipes/i })).not.toBeInTheDocument();
    });

    it('does not add a duplicate ingredient', () => {
      render(<SearchBar onSearch={vi.fn()} />);

      addIngredient('Chicken');
      addIngredient('Chicken');

      expect(screen.getAllByText('Chicken')).toHaveLength(1);
    });
  });

  it('displays the ingredient in the list and shows the Find Recipes button after adding an ingredient', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    addIngredient('Chicken');

    expect(screen.getByText('Chicken')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /find recipes/i })).toBeInTheDocument();
  });

  it('removes the ingredient from the list when its remove button is clicked', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    addIngredient('Chicken');
    fireEvent.click(screen.getByRole('button', { name: '×' }));

    expect(screen.queryByText('Chicken')).not.toBeInTheDocument();
  });

  it('hides the Find Recipes button when the last ingredient is removed', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    addIngredient('Chicken');
    fireEvent.click(screen.getByRole('button', { name: '×' }));

    expect(screen.queryByRole('button', { name: /find recipes/i })).not.toBeInTheDocument();
  });

  describe('Find Recipes button', () => {
    it('calls onSearch with the current list of ingredients when clicked', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);

      addIngredient('Chicken');
      addIngredient('Garlic');
      fireEvent.click(screen.getByRole('button', { name: /find recipes/i }));

      expect(onSearch).toHaveBeenCalledOnce();
      expect(onSearch).toHaveBeenCalledWith(['Chicken', 'Garlic']);
    });
  });
});
