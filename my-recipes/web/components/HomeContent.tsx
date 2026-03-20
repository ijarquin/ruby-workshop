"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import RecipeCard from "./RecipeCard";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRecipes } from "../hooks/useRecipes";
import useWindowSize from "../hooks/useWindowSize";
import RecipeDetailPanel from "./RecipeDetailsPanel";
import Pagination from "./Pagination";
import LoadMoreButton from "./LoadMoreButton";
import RecipeCardSkeletonLoading from "./RecipeCardSkeletonLoading";
import KitchenTipsGrid from "./KitchenTipsGrid";
import type { Recipe } from "../hooks/useRecipes";

export default function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const ingredients = searchParams.getAll("ingredients");
  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

  const { width } = useWindowSize();
  const isMobile = width !== undefined && width < 640;

  // -------------------------------------------------------------------------
  // Mobile-only: accumulated recipe list and page cursor
  // -------------------------------------------------------------------------

  // The page whose results are currently being fetched for the mobile list.
  const [mobilePage, setMobilePage] = useState(1);

  // The flat list of recipes accumulated across all "Load More" taps.
  const [accumulatedRecipes, setAccumulatedRecipes] = useState<Recipe[]>([]);

  // True only while a Load More tap is in flight (not the initial page load).
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Tracks the ingredients key so we can detect when the search has changed.
  const ingredientsKey = ingredients.join(",");
  const prevIngredientsKey = useRef(ingredientsKey);

  // Reset the accumulated list and cursor whenever the search changes.
  useEffect(() => {
    if (prevIngredientsKey.current !== ingredientsKey) {
      prevIngredientsKey.current = ingredientsKey;
      appendedRef.current = null;
      setAccumulatedRecipes([]);
      setMobilePage(1);
      setIsLoadingMore(false);
    }
  }, [ingredientsKey]);

  // -------------------------------------------------------------------------
  // Data fetching
  // -------------------------------------------------------------------------

  // Desktop uses the URL page param; mobile uses the local mobilePage cursor.
  const fetchPage = isMobile ? mobilePage : currentPage;
  const { data, isLoading, isError } = useRecipes(ingredients, fetchPage);

  // Persist the last known totalPages so the LoadMoreButton is not hidden
  // while a Load More fetch is in flight (data is temporarily undefined).
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    if (data?.total_pages !== undefined) {
      setTotalPages(data.total_pages);
    }
  }, [data?.total_pages]);

  // When a new page arrives on mobile, append it to the accumulated list.
  const appendedRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isMobile || !data?.recipes) return;

    // Only append if we haven't already appended this page in this render cycle.
    if (appendedRef.current === mobilePage) return;
    appendedRef.current = mobilePage;

    if (mobilePage === 1) {
      // First page (or after a reset): replace, don't append.
      setAccumulatedRecipes(data.recipes);
    } else {
      setAccumulatedRecipes((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newRecipes = data.recipes.filter((r) => !existingIds.has(r.id));
        return [...prev, ...newRecipes];
      });
    }

    setIsLoadingMore(false);
  }, [data, isMobile, mobilePage]);

  // The recipe list shown in the grid.
  // On mobile: use the accumulated list. On desktop: use the current page directly.
  const recipes = useMemo(() => {
    if (isMobile) return accumulatedRecipes;
    return data?.recipes ?? [];
  }, [isMobile, accumulatedRecipes, data?.recipes]);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

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
    setIsLoadingMore(true);
    setMobilePage((prev) => prev + 1);
  };

  const [expandedRecipeId, setExpandedRecipeId] = useState<number | null>(null);

  const handleRecipeClick = (id: number) => {
    setExpandedRecipeId(expandedRecipeId === id ? null : id);
  };

  // -------------------------------------------------------------------------
  // Detail panel insertion logic
  // -------------------------------------------------------------------------

  const numColumns = width ? (width >= 1024 ? 3 : width >= 640 ? 2 : 1) : 3;
  const expandedIndex = recipes.findIndex((r) => r.id === expandedRecipeId);
  let insertionIndex = -1;
  if (expandedIndex !== -1) {
    const rowStartIndex = Math.floor(expandedIndex / numColumns) * numColumns;
    insertionIndex = Math.min(
      rowStartIndex + numColumns - 1,
      recipes.length - 1,
    );
  }

  const expandedRecipe = recipes.find((r) => r.id === expandedRecipeId);

  // -------------------------------------------------------------------------
  // Loading skeleton: show only on initial page load, not on Load More taps.
  // -------------------------------------------------------------------------
  const showSkeleton = isLoading && !isLoadingMore && recipes.length === 0;

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
          <h1
            tabIndex={0}
            className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:rounded-sm"
          >
            Discover Delicious <span className="text-amber-700">Recipes</span>
          </h1>
          <p
            tabIndex={0}
            className="text-lg text-stone-500 leading-relaxed mb-10 max-w-2xl mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:rounded-sm"
          >
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
          ) : recipes.length > 0 ? (
            recipes.map((recipe, index) => (
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

        {/* Pagination (desktop / tablet) or Load More button (mobile) */}
        {!isError && recipes.length > 0 && (
          isMobile ? (
            <LoadMoreButton
              currentPage={mobilePage}
              totalPages={totalPages}
              isLoading={isLoadingMore}
              onLoadMore={handleLoadMore}
            />
          ) : (
            !isLoading && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )
          )
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
