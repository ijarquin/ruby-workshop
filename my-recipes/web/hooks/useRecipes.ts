import { useQuery } from "@tanstack/react-query";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export interface Ingredient {
  id: number;
  name: string;
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  category: string;
  cuisine?: string;
  cook_time?: number;
  prep_time?: number;
  ratings?: number;
  author?: string;
  ingredients: Ingredient[];
}

export interface RecipesResponse {
  recipes: Recipe[];
  current_page: number;
  total_pages: number;
}

const buildQueryString = (ingredients: string[]) => {
  const params = new URLSearchParams();
  ingredients.forEach((ing) => {
    if (ing.trim()) {
      params.append("ingredients[]", ing.trim());
    }
  });
  return `?${params.toString()}`;
};

export const fetchRecipes = async (
  ingredients: string[] = [],
): Promise<RecipesResponse> => {
  const queryString = buildQueryString(ingredients);
  const response = await fetch(`${API_URL}/recipes${queryString}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const useRecipes = (ingredients: string[]) => {
  return useQuery({
    queryKey: ["recipes", ingredients],
    queryFn: () => fetchRecipes(ingredients),
  });
};
