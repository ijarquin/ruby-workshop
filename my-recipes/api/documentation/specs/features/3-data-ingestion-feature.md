# Feature: Data Ingestion

As a developer populating the recipes database,
I want to seed recipes and ingredients from a JSON file in batches
So that the database is filled with real data efficiently and without duplicates.

---

## Scenario 1: Seed file is missing

**Given** no seed file exists at `db/data/recipes-en.json`
**When** the seed task is run
**Then** the process halts with a clear message indicating the file was not found
**And** no data is written to the database

---

## Scenario 2: Seed file contains invalid JSON

**Given** the seed file exists but contains malformed JSON
**When** the seed task is run
**Then** the process halts with a clear error message describing the parse failure
**And** no data is written to the database

---

## Scenario 3: Recipes are upserted from the JSON file

**Given** a valid seed file with recipe records exists
**When** the seed task is run
**Then** each recipe is inserted into the `recipes` table with its title, author, category, cuisine, image, prep_time, cook_time, and ratings
**And** if a recipe with the same title already exists it is updated instead of duplicated

---

## Scenario 4: Ingredient names are normalized and upserted

**Given** a valid seed file where recipe records contain ingredient lists
**When** the seed task is run
**Then** each ingredient name is downcased before being inserted
**And** unique ingredients are upserted into the `ingredients` table by name
**And** duplicate ingredient names within a batch are collapsed into a single record

---

## Scenario 5: Recipe-ingredient associations are created

**Given** recipes and ingredients have been upserted successfully
**When** the seed task is run
**Then** the join records linking each recipe to its ingredients are inserted into `recipe_ingredients`
**And** duplicate associations within the same batch are not inserted twice

---

## Scenario 6: Data is processed in batches

**Given** a seed file with a large number of recipes
**When** the seed task is run
**Then** records are processed in batches of 1000
**And** each batch is wrapped in a database transaction so a failure in one batch does not affect others

---

## Scenario 7: The seed process is idempotent

**Given** the seed task has been run once and data already exists
**When** the seed task is run again with the same file
**Then** no duplicate recipes or ingredients are created
**And** the total counts in the database remain consistent
