# Data Ingestion

This document describes how the database is populated with recipe data via the seed script.

---

## Source File

```
db/data/recipes-en.json
```

The seed script expects a JSON array where each element represents a recipe. If the file is missing or contains invalid JSON the script halts immediately without writing anything to the database.

### Expected JSON Shape

```json
[
  {
    "title":       "Garlic Chicken",
    "author":      "Jane Doe",
    "category":    "Main Course",
    "cuisine":     "Italian",
    "image":       "https://example.com/image.jpg",
    "prep_time":   10,
    "cook_time":   30,
    "ratings":     4.5,
    "ingredients": ["Chicken Breast", "Garlic", "Olive Oil"]
  }
]
```

---

## Running the Seed

```bash
bin/rails db:seed
```

The script is idempotent — it can be run multiple times without creating duplicate records.

---

## Ingestion Strategy

The seed script processes records in **batches of 1000** to limit memory usage and keep individual transactions small.

Each batch follows this sequence inside a single database transaction:

```
1. Collect recipe hashes and ingredient names from the batch
        │
        ▼
2. Upsert recipes           →  unique_by: :title
        │
        ▼
3. Fetch recipe ID map      →  title → id
        │
        ▼
4. Upsert ingredients       →  unique_by: :name  (names are downcased)
        │
        ▼
5. Fetch ingredient ID map  →  name → id
        │
        ▼
6. Build join records       →  recipe_id + ingredient_id pairs (deduped)
        │
        ▼
7. Insert recipe_ingredients  →  insert_all (no upsert, dupes removed in Ruby first)
```

If any step in the transaction fails, the entire batch is rolled back. Other batches are not affected.

---

## Normalisation Rules

| Data              | Rule                                                              |
|-------------------|-------------------------------------------------------------------|
| Recipe title      | Stored as-is. Used as the unique key for upserts.                 |
| Ingredient name   | **Downcased** before insert. `"Garlic"` and `"garlic"` become one record. |
| Duplicate titles  | Deduplicated in Ruby (`uniq!`) before the upsert so the same batch does not produce a conflict. |
| Duplicate associations | Deduplicated in Ruby (`Array#uniq`) before `insert_all`.    |

---

## Bulk Operations Used

| Operation              | Method                          | Conflict strategy         |
|------------------------|---------------------------------|---------------------------|
| Insert recipes         | `Recipe.upsert_all`             | Update on `title` conflict |
| Insert ingredients     | `Ingredient.upsert_all`         | Update on `name` conflict  |
| Insert join records    | `RecipeIngredient.insert_all`   | Skip (dupes removed first) |

`upsert_all` and `insert_all` bypass ActiveRecord callbacks and validations for performance. Uniqueness is enforced at the database level via indexes.

---

## Performance Considerations

- A single `Time.current` call is reused for all `created_at` / `updated_at` timestamps within a batch, avoiding repeated system calls.
- A `Set` is used to accumulate unique ingredient names within a batch, providing O(1) membership checks.
- ID maps (`recipe_id_map`, `ingredient_id_map`) are built with a single `pluck` query each rather than individual lookups.
- All writes within a batch are bulk operations — no row-by-row inserts.
