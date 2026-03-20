# Domain Model

A high-level description of the core entities, their properties, and how they relate to each other. This is intentionally non-technical — for the database and code details see [`architecture/database.md`](../architecture/database.md) and [`architecture/models.md`](../architecture/models.md).

---

## Entities

### Recipe

The central entity of the application. A recipe represents a single dish and carries the information a user needs to understand and cook it.

**Properties:**
- **Title** — The name of the dish. Unique.
- **Author** — Who created or published the recipe.
- **Category** — The type of dish (e.g. Dessert, Main Course, Snack).
- **Cuisine** — The culinary tradition the recipe belongs to (e.g. Italian, Mexican).
- **Image** — A visual reference for the finished dish.
- **Prep time** — How long it takes to prepare the ingredients before cooking, in minutes.
- **Cook time** — How long the dish takes to cook, in minutes.
- **Ratings** — An average score reflecting how well-received the recipe is.

---

### Ingredient

A food item that appears in one or more recipes. Ingredients exist independently of any single recipe — they are shared across the entire dataset.

**Properties:**
- **Name** — The ingredient's label (e.g. `"garlic"`, `"olive oil"`). Unique and stored in lowercase.

---

### Recipe–Ingredient Link

Connects a recipe to one of its ingredients. A recipe can link to many ingredients, and an ingredient can link to many recipes.

This relationship has no properties of its own beyond the two entities it connects.

---

## Relationships

```
A Recipe has many Ingredients (through Recipe–Ingredient links).
An Ingredient belongs to many Recipes (through Recipe–Ingredient links).
```

This is a standard **many-to-many** relationship:

```
Recipe  1 ──────< Recipe–Ingredient Link >────── 1  Ingredient
         (has many)                    (belongs to many)
```

---

## Invariants

These are facts that must always be true in a valid system state:

- Every Recipe–Ingredient link points to exactly one existing Recipe and one existing Ingredient.
- No two Recipe–Ingredient links connect the same Recipe and Ingredient pair.
- No two recipes share the same title.
- No two ingredients share the same name.

---

## What the Application Does

The application allows a user to **discover recipes based on ingredients they already have**. The user provides a list of ingredient names; the system returns all recipes that contain every one of those ingredients, ordered from the simplest (fewest ingredients) to the most complex.

The data is read-only from the API's perspective. All recipes and ingredients are loaded at setup time via a seed process and are not modified through the API.
