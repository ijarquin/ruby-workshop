"use client";

import { useState } from "react";
import Recipe from "../../../components/Recipe";
import { useFavourites } from "../../../hooks/useFavourites";

export default function Favourites() {
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const { favouriteIds, favouriteRecipes, addFavourite, removeFavourite } = useFavourites();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <main className="grow max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12 w-full">
        {/* Hero / Header Section */}
        <div className="text-center mb-16">
          <h1
            tabIndex={0}
            className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:rounded-sm"
          >
            Your Favourites <span className="text-amber-700">Recipes</span>
          </h1>
          <p
            tabIndex={0}
            className="text-lg text-stone-500 leading-relaxed mb-10 max-w-2xl mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:rounded-sm"
          >
            Save as many recipes as you like so you can quickly find them
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 grid-flow-row-dense">
          {favouriteRecipes.length > 0 ? (
            favouriteRecipes.map((recipe) => (
              <Recipe
                key={recipe.id}
                recipe={recipe}
                isExpanded={selectedRecipeId === recipe.id}
                onToggle={() =>
                  setSelectedRecipeId((prev) =>
                    prev === recipe.id ? null : recipe.id
                  )
                }
                isFavourited={favouriteIds.has(recipe.id)}
                onFavouriteToggle={
                  favouriteIds.has(recipe.id)
                    ? () => removeFavourite(recipe.id)
                    : () => addFavourite(recipe.id)
                }
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl font-serif text-stone-500">
                No saved recipes yet.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
