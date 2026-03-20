# Database Architecture

The application uses **PostgreSQL** as its database. The schema consists of three tables that model a many-to-many relationship between recipes and ingredients.

---

## Tables

### `recipes`

Stores the core data for each recipe.

| Column       | Type      | Constraints        |
|--------------|-----------|--------------------|
| `id`         | bigint    | PK, auto-increment |
| `title`      | string    | unique index       |
| `author`     | string    |                    |
| `category`   | string    |                    |
| `cuisine`    | string    |                    |
| `image`      | string    |                    |
| `prep_time`  | integer   |                    |
| `cook_time`  | integer   |                    |
| `ratings`    | float     |                    |
| `created_at` | datetime  | not null           |
| `updated_at` | datetime  | not null           |

**Indexes:**
- `index_recipes_on_title` — unique, used to enforce title uniqueness and as the upsert key during seeding.

---

### `ingredients`

Stores unique, normalised ingredient names.

| Column       | Type     | Constraints        |
|--------------|----------|--------------------|
| `id`         | bigint   | PK, auto-increment |
| `name`       | string   | unique index       |
| `created_at` | datetime | not null           |
| `updated_at` | datetime | not null           |

**Indexes:**
- `index_ingredients_on_name` — unique, enforces deduplication. Names are stored lowercase.

---

### `recipe_ingredients`

Join table that links recipes to ingredients.

| Column          | Type     | Constraints        |
|-----------------|----------|--------------------|
| `id`            | bigint   | PK, auto-increment |
| `recipe_id`     | bigint   | not null, FK       |
| `ingredient_id` | bigint   | not null, FK       |
| `created_at`    | datetime | not null           |
| `updated_at`    | datetime | not null           |

**Indexes:**
- `index_recipe_ingredients_on_recipe_id`
- `index_recipe_ingredients_on_ingredient_id`

**Foreign keys:**
- `recipe_id` → `recipes.id`
- `ingredient_id` → `ingredients.id`

---

## Entity Relationship Diagram

```
recipes                recipe_ingredients          ingredients
-----------            -------------------         -----------
id         <---FK---   recipe_id                   id
title                  ingredient_id   ---FK--->   name
author                 created_at                  created_at
category               updated_at                  updated_at
cuisine
image
prep_time
cook_time
ratings
created_at
updated_at
```

---

## Design Decisions

- **`title` is the natural unique key for recipes.** It is used as the conflict target during bulk upserts in the seed process.
- **Ingredient names are stored in lowercase.** Normalisation happens at ingestion time so that "Garlic" and "garlic" are treated as the same ingredient.
- **No composite unique constraint on `recipe_ingredients`.** Uniqueness of associations is enforced at the application level during seeding via Ruby's `Array#uniq` before `insert_all`.
