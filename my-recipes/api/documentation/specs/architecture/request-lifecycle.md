# Request Lifecycle

This document traces the path a request takes through the application from the moment it arrives to the moment a JSON response is returned.

---

## Overview

```
Client
  │
  ▼
config/routes.rb          — matches the path and dispatches to the right controller action
  │
  ▼
ApplicationController     — base controller (API-only mode, no session/cookie middleware)
  │
  ▼
Api::V1::RecipesController#index
  ├── sanitises params     — strips blanks, deduplicates, sorts ingredient terms
  ├── delegates query      — RecipesSearchService
  ├── paginates            — offset / limit applied to the resolved scope
  └── serializes           — RecipeBlueprint renders the result as a hash
  │
  ▼
JSON response
```

---

## Step-by-Step

### 1. Routing — `config/routes.rb`

```
GET /api/v1/recipes  →  Api::V1::RecipesController#index
```

The routes file defines a versioned namespace (`api` → `v1`) with recipes exposed as a read-only resource (`only: [:index]`).

---

### 2. Parameter Sanitisation — `RecipesController#index`

Before any query is run, the raw `ingredients` parameter is cleaned:

```ruby
ingredients = Array(raw_ingredients)
               .map(&:to_s)
               .map(&:strip)
               .reject(&:blank?)
               .uniq
               .sort
```

This ensures:
- A missing parameter is treated as an empty array (not an error).
- Blank strings are removed.
- Duplicate terms are collapsed.
- Terms are sorted so the same set of ingredients always produces the same query regardless of the order the client sends them.

The `page` parameter is coerced to an integer with a minimum of `1`:

```ruby
page = [params[:page].to_i, 1].max
```

---

### 3. Query — `RecipesSearchService`

The controller delegates all query logic to `RecipesSearchService`.

**When `ingredients` is empty:** returns `Recipe.none` — no query is executed.

**When `ingredients` has values:**

The service builds a scope that chains an `EXISTS` subquery for each term, requiring all terms to match (AND logic):

```sql
SELECT recipes.*
FROM recipes
WHERE EXISTS (
  SELECT 1 FROM recipe_ingredients ri
  JOIN ingredients i ON i.id = ri.ingredient_id
  WHERE ri.recipe_id = recipes.id
  AND i.name ILIKE '%chicken%'
)
AND EXISTS (
  SELECT 1 FROM recipe_ingredients ri
  JOIN ingredients i ON i.id = ri.ingredient_id
  WHERE ri.recipe_id = recipes.id
  AND i.name ILIKE '%garlic%'
)
ORDER BY (
  SELECT COUNT(*) FROM recipe_ingredients WHERE recipe_id = recipes.id
) ASC
```

The final scope also uses `includes(:ingredients)` to avoid N+1 queries when the blueprints access the ingredient associations.

---

### 4. Pagination — `RecipesController#index`

After the search scope is resolved, the controller applies pagination:

```ruby
total_count = scope.count         # one COUNT query
total_pages = (total_count.to_f / PER_PAGE).ceil
paginated   = scope.offset((page - 1) * PER_PAGE).limit(PER_PAGE)
```

`PER_PAGE` is a constant set to `9`.

---

### 5. Serialization — `RecipeBlueprint`

The paginated scope is rendered using Blueprinter:

```ruby
RecipeBlueprint.render_as_hash(paginated)
```

`RecipeBlueprint` exposes: `id`, `title`, `cook_time`, `prep_time`, `ratings`, `cuisine`, `category`, `author`, `image`, and a nested `ingredients` association serialized by `IngredientBlueprint` (fields: `id`, `name`).

---

### 6. Response

The controller renders a single JSON object:

```ruby
render(json: {
  recipes:      RecipeBlueprint.render_as_hash(paginated),
  current_page: page,
  total_pages:  total_pages
})
```

HTTP status is implicitly `200 OK`.

---

## Key Design Points

| Concern          | Responsibility                  |
|------------------|---------------------------------|
| Routing          | `config/routes.rb`              |
| Param sanitisation | `RecipesController#index`     |
| Query / search   | `RecipesSearchService`          |
| Pagination       | `RecipesController#index`       |
| Serialization    | `RecipeBlueprint` / `IngredientBlueprint` |

The controller is kept thin by delegating all query logic to the service. The service is kept focused by returning an ActiveRecord scope, leaving pagination to the controller.
