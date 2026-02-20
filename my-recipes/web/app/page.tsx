"use client";

import Link from "next/link";
import SearchBar from "../components/SearchBar";
import React, { useState, useMemo } from "react";
import { useRecipes } from "../hooks/useRecipes";

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);

  const { data, isLoading, isError } = useRecipes(ingredients);
  const recipes = useMemo(() => data?.recipes ?? [], [data?.recipes]);

  const handleSearch = (newIngredients: string[]) => {
    setIngredients(newIngredients);
  };

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
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight">
            Discover Delicious <span className="text-amber-700">Recipes</span>
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            Find and share the best recipes from around the world. From comfort
            food to healthy bites, we have it all.
          </p>

          <div className="flex justify-center mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            "Loading..."
          ) : isError ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl font-serif text-red-500">
                Error loading recipes. Please try again later.
              </p>
            </div>
          ) : recipes.length > 0 ? (
            recipes.map((recipe) => (
              <React.Fragment key={recipe.id}>
                <p className="text-xl font-serif text-black">{recipe.title}</p>
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
      </main>

      <footer className="bg-stone-100 border-t border-stone-200 py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center text-stone-500">
          <p>&copy; 2026 MyRecipes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
