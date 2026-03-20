# Feature: Recipes with Matching Ingredients

As a user of the recipes web app,
I want to search for recipes by providing one or more ingredient names
So that I can find recipes that use the ingredients I already have at home.

---

## Scenario 1: No ingredients are provided

**Given** recipes exist in the database
**When** a GET request is made to `/api/v1/recipes` with no ingredients parameter
**Then** the response returns an empty recipes list
**And** total_pages is 0

---

## Scenario 2: A single ingredient matches recipes

**Given** multiple recipes exist, some containing "chicken" as an ingredient
**When** a GET request is made to `/api/v1/recipes?ingredients[]=chicken`
**Then** the response only includes recipes that have an ingredient matching "chicken"
**And** the match is case-insensitive

---

## Scenario 3: Multiple ingredients are provided and all must match

**Given** multiple recipes exist with varying ingredient combinations
**When** a GET request is made to `/api/v1/recipes?ingredients[]=chicken&ingredients[]=garlic`
**Then** the response only includes recipes that contain both "chicken" and "garlic"
**And** recipes missing any one of the provided ingredients are excluded

---

## Scenario 4: Results are ordered by fewest ingredients first

**Given** multiple recipes match the provided ingredients
**When** the results are returned
**Then** recipes with fewer total ingredients appear before recipes with more ingredients
**So that** simpler recipes are surfaced first

---

## Scenario 5: Results are paginated

**Given** more than 9 recipes match the provided ingredients
**When** a GET request is made to `/api/v1/recipes?ingredients[]=chicken`
**Then** the response contains at most 9 recipes
**And** the response includes `current_page` and `total_pages` fields
**And** requesting `?page=2` returns the next set of results

---

## Scenario 6: Duplicate or blank ingredient parameters are ignored

**Given** a request is made with duplicate or blank ingredient values
**When** the parameters are processed
**Then** blank values are removed
**And** duplicates are collapsed into a single search term
**And** the search behaves as if only unique, non-blank ingredients were provided

---

## Scenario 7: Each recipe in the response includes its ingredients

**Given** recipes matching the search exist
**When** a GET request is made with valid ingredient parameters
**Then** each recipe in the response includes its full list of ingredients with id and name
