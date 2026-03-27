"use client";

import type { Recipe as RecipeType } from "../hooks/useRecipes";
import RecipeCard from "./RecipeCard";
import RecipeDetailPanel from "./RecipeDetailsPanel";

interface RecipeProps {
  recipe: RecipeType;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function Recipe({ recipe, isExpanded, onToggle }: RecipeProps) {
  return (
    <>
      <RecipeCard
        title={recipe.title}
        imageURL={recipe.image}
        category={recipe.category || recipe.cuisine || "Unknown"}
        onClick={onToggle}
        isSelected={isExpanded}
      />
      {isExpanded && (
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 w-full">
          <RecipeDetailPanel
            recipe={recipe}
            onClose={onToggle}
          />
        </div>
      )}
    </>
  );
}
