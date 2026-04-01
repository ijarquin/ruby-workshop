import { useState, useEffect, useCallback } from "react";
import { Recipe } from "./useRecipes";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// TODO: replace with real user ID once authentication is implemented
const TEMP_USER_ID = 1;

export const useFavourites = () => {
  const [favouriteRecipes, setFavouriteRecipes] = useState<Recipe[]>([]);

  const favouriteIds = new Set(favouriteRecipes.map((r) => r.id));

  useEffect(() => {
    fetch(`${API_URL}/users/${TEMP_USER_ID}/favourites`)
      .then((res) => res.json())
      .then((data) => setFavouriteRecipes(data.recipes ?? []))
      .catch(() => {});
  }, []);

  const addFavourite = useCallback(async (recipeId: number) => {
    const res = await fetch(`${API_URL}/users/${TEMP_USER_ID}/favourites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_id: recipeId }),
    });
    const data = await res.json();
    setFavouriteRecipes(data.recipes ?? []);
  }, []);

  const removeFavourite = useCallback(async (recipeId: number) => {
    const res = await fetch(
      `${API_URL}/users/${TEMP_USER_ID}/favourites/${recipeId}`,
      { method: "DELETE" },
    );
    const data = await res.json();
    setFavouriteRecipes(data.recipes ?? []);
  }, []);

  return { favouriteRecipes, favouriteIds, addFavourite, removeFavourite };
};
