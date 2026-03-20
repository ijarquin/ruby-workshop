# Feature: Model Relationships

As a developer building the recipes API,
I want to establish a many-to-many relationship between recipes and ingredients
So that a recipe can have multiple ingredients and an ingredient can belong to multiple recipes.

---

## Scenario 1: A recipe is created with its core attributes

**Given** no recipes exist in the database
**When** a recipe is created with title, author, category, cuisine, image, prep_time, cook_time, and ratings
**Then** the recipe is persisted with all provided attributes
**And** the title must be unique across all recipes

---

## Scenario 2: An ingredient is created with a unique name

**Given** no ingredients exist in the database
**When** an ingredient is created with a name
**Then** the ingredient is persisted with that name
**And** the name must be unique across all ingredients

---

## Scenario 3: An ingredient is associated with a recipe

**Given** a recipe exists in the database
**And** an ingredient exists in the database
**When** the ingredient is linked to the recipe via a recipe_ingredient record
**Then** the recipe_ingredient record is persisted with valid recipe_id and ingredient_id foreign keys
**And** querying the recipe's ingredients returns that ingredient
**And** querying the ingredient's recipes returns that recipe

---

## Scenario 4: A recipe can have multiple ingredients

**Given** a recipe exists in the database
**And** multiple ingredients exist in the database
**When** each ingredient is linked to the recipe via separate recipe_ingredient records
**Then** querying the recipe's ingredients returns all linked ingredients

---

## Scenario 5: An ingredient can belong to multiple recipes

**Given** multiple recipes exist in the database
**And** an ingredient exists in the database
**When** the ingredient is linked to each recipe via separate recipe_ingredient records
**Then** querying the ingredient's recipes returns all linked recipes

---

## Scenario 6: Deleting a recipe removes its associations

**Given** a recipe exists with linked ingredients via recipe_ingredient records
**When** the recipe is deleted
**Then** the associated recipe_ingredient records are also removed
**And** the ingredients themselves remain in the database

---

## Scenario 7: An ingredient cannot be linked to the same recipe twice

**Given** a recipe and an ingredient are already associated
**When** a duplicate recipe_ingredient record is attempted for the same recipe and ingredient pair
**Then** the operation fails with a constraint violation
