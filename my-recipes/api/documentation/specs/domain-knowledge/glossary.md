# Glossary

Definitions of the core terms used throughout this codebase and its documentation.

---

### Recipe

A single dish or food preparation with a title, author, categorisation metadata, timing information, a rating, and a list of ingredients. Recipes are the primary entity of the application.

A recipe is uniquely identified by its **title**.

---

### Ingredient

A food item or substance used in one or more recipes. Ingredients are stored as standalone entities with a unique name, allowing the same ingredient (e.g. `"garlic"`) to be linked to many different recipes without duplication.

An ingredient is uniquely identified by its **name** (stored in lowercase).

---

### Recipe–Ingredient Association

The link between a recipe and an ingredient. A recipe can have many ingredients, and an ingredient can appear in many recipes — this is a many-to-many relationship mediated by the `recipe_ingredients` join table.

---

### Ingredient Search

The act of querying recipes by providing one or more ingredient names. The search finds all recipes that contain **every** provided ingredient (AND logic). Matching is partial and case-insensitive — a term like `"oil"` will match recipes that contain `"olive oil"`, `"coconut oil"`, and so on.

---

### Search Term

A single ingredient name provided by a user as a filter. Multiple search terms can be supplied in one request. Blank or duplicate terms are discarded before the search runs.

---

### Matching Recipe

A recipe that contains at least one ingredient matching each of the provided search terms. A recipe must satisfy all terms simultaneously to appear in the results.

---

### Page

A fixed-size slice of the full result set returned by the API. The page size is 9 recipes. Clients request a specific page by providing a `page` number.

---

### Seed Data

The initial dataset loaded into the database from a JSON file (`db/data/recipes-en.json`). It populates the `recipes`, `ingredients`, and `recipe_ingredients` tables. The seeding process is idempotent.

---

### Upsert

An insert operation that updates an existing record if a conflict is detected (e.g. a recipe with the same title already exists), rather than failing. Used during seeding to allow repeated runs without producing duplicates.
