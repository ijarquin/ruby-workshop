"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import RecipeCard from "./RecipeCard";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRecipes, Recipe } from "../hooks/useRecipes";
import useWindowSize from "../hooks/useWindowSize";
import RecipeDetailPanel from "./RecipeDetailsPanel";
import Pagination from "./Pagination";
import RecipeCardSkeletonLoading from "./RecipeCardSkeletonLoading";
import KitchenTipsGrid from "./KitchenTipsGrid";

export default function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const ingredients = searchParams.getAll("ingredients");
  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

  const [expandedRecipeId, setExpandedRecipeId] = useState<number | null>(null);

  // Mobile "load more" state
  const [mobileLoadMorePage, setMobileLoadMorePage] = useState(1);
  const [accumulatedRecipes, setAccumulatedRecipes] = useState<Recipe[]>([]);
  const lastKnownTotalPages = useRef(0);

  const { width } = useWindowSize();
  const isMobile = width !== undefined && width < 640;

  const activePage = isMobile ? mobileLoadMorePage : currentPage;
  const { data, isLoading, isError, isFetching } = useRecipes(ingredients, activePage);

  // Keep track of total_pages across page loads so the button stays visible while fetching
  if (data?.total_pages !== undefined) {
    lastKnownTotalPages.current = data.total_pages;
  }
  const totalPages = data?.total_pages ?? lastKnownTotalPages.current;

  // Reset mobile state whenever the search changes
  const ingredientsKey = ingredients.join(",");
  useEffect(() => {
    setAccumulatedRecipes([]);
    setMobileLoadMorePage(1);
    lastKnownTotalPages.current = 0;
  }, [ingredientsKey]);

  // Accumulate recipes on mobile — only when the response belongs to the requested page
  useEffect(() => {
    if (isMobile && data?.recipes && data.current_page === mobileLoadMorePage) {
      setAccumulatedRecipes((prev) => {
        if (mobileLoadMorePage === 1) return data.recipes;
        const existingIds = new Set(prev.map((r) => r.id));
        return [...prev, ...data.recipes.filter((r) => !existingIds.has(r.id))];
      });
    }
  }, [data, isMobile, mobileLoadMorePage]);

  const displayedRecipes = isMobile
    ? accumulatedRecipes
    : (data?.recipes ?? []);

  const hasMore = mobileLoadMorePage < totalPages;

  const handleSearch = (newIngredients: string[]) => {
    if (newIngredients.length === 0) {
      router.push("/");
      return;
    }
    const params = new URLSearchParams();
    newIngredients.forEach((ing) => params.append("ingredients", ing));
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`/?${params.toString()}`);
    setExpandedRecipeId(null);
  };

  const handleLoadMore = () => {
    setMobileLoadMorePage((prev) => prev + 1);
  };

  const handleRecipeClick = (id: number) => {
    setExpandedRecipeId(expandedRecipeId === id ? null : id);
  };

  // Calculate insertion index for the details panel
  const numColumns = width ? (width >= 1024 ? 3 : width >= 640 ? 2 : 1) : 3;
  const expandedIndex = displayedRecipes.findIndex(
    (r) => r.id === expandedRecipeId,
  );
  let insertionIndex = -1;
  if (expandedIndex !== -1) {
    const rowStartIndex = Math.floor(expandedIndex / numColumns) * numColumns;
    insertionIndex = Math.min(
      rowStartIndex + numColumns - 1,
      displayedRecipes.length - 1,
    );
  }

  const expandedRecipe = displayedRecipes.find(
    (r) => r.id === expandedRecipeId,
  );

  // Show skeleton only when there are no recipes yet and we're loading
  const showSkeleton = isLoading && displayedRecipes.length === 0;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header>
        <nav className="bg-white border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex justify-between h-20">
              <div className="shrink-0 flex items-center">
                <Link
                  href="/"
                  className="text-2xl font-serif font-bold text-amber-800 tracking-wide italic"
                >
                  MyRecipes
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/"
                  className="border-amber-700 text-stone-900 tracking-wide uppercase inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  href="#"
                  className="border-transparent text-stone-500 hover:border-amber-300 hover:text-stone-800 tracking-wide uppercase inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Saved Recipes
                </Link>
                <Link
                  href="#"
                  className="border-transparent text-stone-500 hover:border-amber-300 hover:text-stone-800 tracking-wide uppercase inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  About
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="grow max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12 w-full">
        {/* Hero / Header Section */}
        <div className="text-center mb-16">
          <h1 tabIndex={0} className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:rounded-sm">
            Discover Delicious <span className="text-amber-700">Recipes</span>
          </h1>
          <p tabIndex={0} className="text-lg text-stone-500 leading-relaxed mb-10 max-w-2xl mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:rounded-sm">
            Find and share the best recipes from around the world. From comfort
            food to healthy bites, we have it all.
          </p>

          <div className="flex justify-center mb-8">
            <SearchBar
              key={ingredients.join(",")}
              initialIngredients={ingredients}
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {ingredients.length === 0 ? (
            <KitchenTipsGrid />
          ) : showSkeleton ? (
            [...Array(9)].map((_, index) => (
              <RecipeCardSkeletonLoading key={index} />
            ))
          ) : isError ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl font-serif text-red-500">
                Error loading recipes. Please try again later.
              </p>
            </div>
          ) : displayedRecipes.length > 0 ? (
            displayedRecipes.map((recipe, index) => (
              <React.Fragment key={recipe.id}>
                <RecipeCard
                  title={recipe.title}
                  imageURL={recipe.image}
                  category={recipe.category || recipe.cuisine || "Unknown"}
                  onClick={() => handleRecipeClick(recipe.id)}
                  isSelected={expandedRecipeId === recipe.id}
                />
                {index === insertionIndex && expandedRecipe && (
                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 w-full">
                    <RecipeDetailPanel
                      recipe={expandedRecipe}
                      onClose={() => setExpandedRecipeId(null)}
                    />
                  </div>
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl font-serif text-stone-500">
                No recipes found matching your criteria.
              </p>
            </div>
          )}
        </div>

        {/* Mobile: Load More button */}
        {isMobile && !isError && ingredients.length > 0 && (displayedRecipes.length > 0 || showSkeleton) && hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={isFetching}
              className={`px-6 py-3 rounded-md text-sm font-medium tracking-wide transition-colors border ${
                isFetching
                  ? "border-stone-200 text-stone-400 bg-stone-100 cursor-not-allowed"
                  : "border-amber-700 text-amber-800 bg-white hover:bg-amber-50 cursor-pointer"
              }`}
            >
              {isFetching ? "Loading..." : "Load More Recipes"}
            </button>
          </div>
        )}

        {/* Desktop: standard paginator */}
        {!isMobile && !isLoading && !isError && displayedRecipes.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      <footer className="bg-stone-100 border-t border-stone-200 py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center text-stone-500">
          <p>&copy; 2026 MyRecipes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
