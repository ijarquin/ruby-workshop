"use client";

import { useState } from "react";
import type { Recipe as RecipeType } from "../hooks/useRecipes";
import RecipeCard from "./RecipeCard";
import RecipeDetailPanel from "./RecipeDetailsPanel";

interface RecipeProps {
  recipe: RecipeType;
}

export default function Recipe({ recipe }: RecipeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <RecipeCard
        title={recipe.title}
        imageURL={recipe.image}
        category={recipe.category || recipe.cuisine || "Unknown"}
        onClick={() => setIsExpanded((prev) => !prev)}
        isSelected={isExpanded}
      />
      {isExpanded && (
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 w-full">
          <RecipeDetailPanel
            recipe={recipe}
            onClose={() => setIsExpanded(false)}
          />
        </div>
      )}
    </>
  );
}
