import { useEffect, useRef, useState } from "react";
import { Recipe } from "../hooks/useRecipes";

interface RecipeDetailPanelProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeDetailPanel({
  recipe,
  onClose,
}: RecipeDetailPanelProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isFavourited, setIsFavourited] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    titleRef.current?.focus();
    return () => {
      trigger?.focus();
    };
  }, []);

  const handleFavourite = () => {
    const next = !isFavourited;
    setIsFavourited(next);
    setNotification(
      next
        ? "Your recipe has been saved to your favourites."
        : "This recipe has been removed from your list of favourites."
    );
  };

  // Split ingredients into two columns approximately
  const half = Math.ceil(recipe.ingredients.length / 2);
  const firstColIngredients = recipe.ingredients.slice(0, half);
  const secondColIngredients = recipe.ingredients.slice(half);

  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-stone-50 border border-amber-700 rounded-md shadow-sm p-8 mt-6 mb-10 relative animate-in fade-in zoom-in-95 duration-300">
      {notification && (
        <div
          role="status"
          className="-mx-8 -mt-8 mb-3 px-4 py-[13px] bg-amber-50 border-b border-amber-300 rounded-t-md text-amber-800 text-sm flex items-center justify-between"
        >
          <span className="flex-1 text-center">{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-4 text-amber-600 hover:text-amber-900 focus:outline-none cursor-pointer flex-shrink-0"
            aria-label="Close notification"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <button
        onClick={onClose}
        className={`absolute top-4 right-4 text-stone-400 hover:text-stone-700 focus:outline-none cursor-pointer ${notification ? "invisible" : ""}`}
        aria-label="Close details"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Column 1: Recipe Details */}
        <div className="md:col-span-1 space-y-4">
          <div>
            <h3
              ref={titleRef}
              tabIndex={0}
              className="text-2xl font-serif font-bold text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:rounded-sm"
            >
              {recipe.title}
            </h3>
            {recipe.author && (
              <p className="text-stone-500 text-sm italic">
                By {recipe.author}
              </p>
            )}
          </div>

          <div tabIndex={0} className="space-y-2 text-sm text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:rounded-sm">
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="font-semibold">Category:</span>
              <span>{recipe.category || recipe.cuisine || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="font-semibold">Cook Time:</span>
              <span>
                {recipe.cook_time ? `${recipe.cook_time} mins` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="font-semibold">Prep Time:</span>
              <span>
                {recipe.prep_time ? `${recipe.prep_time} mins` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="font-semibold">Rating:</span>
              <span className="flex items-center text-amber-600">
                {recipe.ratings ? (
                  <>
                    <span className="mr-1">{recipe.ratings}</span>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </>
                ) : (
                  "N/A"
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Ingredients */}
        <div tabIndex={0} className="md:col-span-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:rounded-sm">
          <h4 className="text-lg font-serif font-bold text-stone-900 mb-4 border-b border-stone-200 pb-2">
            Ingredients
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ingredients Col 1 */}
            <ul className="space-y-2">
              {firstColIngredients.map((ingredient) => (
                <li
                  key={ingredient.id}
                  className="flex items-start text-stone-700"
                >
                  <span className="inline-block w-2 h-2 mt-1.5 mr-3 bg-amber-600 rounded-full flex-shrink-0"></span>
                  <span>{ingredient.name}</span>
                </li>
              ))}
            </ul>

            {/* Ingredients Col 2 */}
            <ul className="space-y-2">
              {secondColIngredients.map((ingredient) => (
                <li
                  key={ingredient.id}
                  className="flex items-start text-stone-700"
                >
                  <span className="inline-block w-2 h-2 mt-1.5 mr-3 bg-amber-600 rounded-full flex-shrink-0"></span>
                  <span>{ingredient.name}</span>
                </li>
              ))}
            </ul>
            {recipe.ingredients.length === 0 && (
              <p className="text-stone-500 italic col-span-full">
                No ingredients listed.
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleFavourite}
        className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg border border-stone-300 bg-white hover:border-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 cursor-pointer transition-colors"
        aria-label={isFavourited ? "Remove from favourites" : "Save to favourites"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-colors ${isFavourited ? "fill-red-500 stroke-red-500" : "fill-none stroke-stone-400"}`}
          viewBox="0 0 24 24"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </div>
  );
}
