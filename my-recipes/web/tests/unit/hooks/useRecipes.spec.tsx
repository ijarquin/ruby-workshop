import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { fetchRecipes, useRecipes, RecipesResponse } from "@/hooks/useRecipes";
const mockResponse: RecipesResponse = {
  recipes: [
    {
      id: 1,
      title: "Chicken Soup",
      image: "chicken-soup.jpg",
      category: "Soup",
      ingredients: [{ id: 1, name: "Chicken" }],
    },
  ],
  current_page: 1,
  total_pages: 1,
};

const mockFetch = (ok: boolean, data?: unknown) => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(data) }),
  );
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe("fetchRecipes", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls the API with only the page param when no ingredients are provided", async () => {
    mockFetch(true, mockResponse);

    await fetchRecipes([]);

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    const params = new URL(calledUrl).searchParams;
    expect(params.get("page")).toBe("1");
    expect(params.getAll("ingredients[]")).toEqual([]);
  });

  it("calls the API with the correct query string when ingredients are provided", async () => {
    mockFetch(true, mockResponse);

    await fetchRecipes(["Chicken", "Garlic"]);

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    const params = new URL(calledUrl).searchParams;
    expect(params.getAll("ingredients[]")).toEqual(["Chicken", "Garlic"]);
    expect(params.get("page")).toBe("1");
  });

  it("includes the page number in the query string", async () => {
    mockFetch(true, mockResponse);

    await fetchRecipes(["Chicken"], 3);

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    const params = new URL(calledUrl).searchParams;
    expect(params.get("page")).toBe("3");
  });

  it("trims whitespace from ingredients before building the query string", async () => {
    mockFetch(true, mockResponse);

    await fetchRecipes(["  Chicken  ", "  Garlic  "]);

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    const params = new URL(calledUrl).searchParams;
    expect(params.getAll("ingredients[]")).toEqual(["Chicken", "Garlic"]);
  });

  it("returns the parsed JSON response on success", async () => {
    mockFetch(true, mockResponse);

    const result = await fetchRecipes([]);

    expect(result).toEqual(mockResponse);
  });

  it("throws an error when the response is not ok", async () => {
    mockFetch(false);

    await expect(fetchRecipes([])).rejects.toThrow(
      "Network response was not ok",
    );
  });
});

describe("useRecipes", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns data on a successful fetch", async () => {
    mockFetch(true, mockResponse);

    const { result } = renderHook(() => useRecipes(["Chicken"]), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);
  });

  it("returns an error state when the fetch fails", async () => {
    mockFetch(false);

    const { result } = renderHook(() => useRecipes(["Chicken"]), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
