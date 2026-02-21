"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (ingredients: string[]) => void;
  initialIngredients?: string[];
}

export default function SearchBar({ onSearch, initialIngredients = [] }: SearchBarProps) {
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients);
  const [inputValue, setInputValue] = useState("");

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (trimmedInput && !ingredients.includes(trimmedInput)) {
      setIngredients([...ingredients, trimmedInput]);
      setInputValue("");
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter((ing) => ing !== ingredientToRemove));
  };

  const handleSearch = () => {
    onSearch(ingredients);
  };

  return (
    <div className="w-full max-w-xl flex flex-col gap-4">
      <form
        onSubmit={handleAddIngredient}
        className="grid grid-cols-3 w-full gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add an ingredient (e.g. Chicken)..."
          className="col-span-2 px-4 py-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-stone-900 placeholder:text-stone-400"
        />
        <button
          type="submit"
          className="col-span-1 px-4 py-3 bg-amber-700 text-white font-semibold rounded-md hover:bg-amber-800 transition-colors duration-200 whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>
            Add<span className="hidden sm:inline"> Ingredient</span>
          </span>
        </button>
      </form>

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium bg-stone-200 text-stone-800 border border-stone-300 flex items-center gap-2"
            >
              {ingredient}
              <button
                onClick={() => handleRemoveIngredient(ingredient)}
                className="text-stone-500 hover:text-red-600 focus:outline-none"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {ingredients.length > 0 && (
        <button
          type="button"
          onClick={handleSearch}
          className="w-full px-6 py-3 bg-amber-700 text-white font-semibold tracking-wide rounded-md hover:bg-amber-800 transition-colors duration-200 shadow-sm cursor-pointer"
        >
          Find Recipes
        </button>
      )}
    </div>
  );
}
