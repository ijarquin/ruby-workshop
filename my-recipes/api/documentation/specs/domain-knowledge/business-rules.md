# Business Rules

The rules that govern how the domain behaves. These are constraints and decisions that exist for product or data integrity reasons, not purely technical ones.

---

## Recipes

**BR-01 — Recipe titles are unique.**
No two recipes can share the same title. The title is the natural identifier for a recipe and is used as the conflict key during bulk data ingestion.

**BR-02 — All recipe fields are optional except the title.**
Author, category, cuisine, image, prep_time, cook_time, and ratings may be absent (e.g. missing from the source data). The application does not enforce their presence.

**BR-03 — Times are expressed in minutes.**
`prep_time` and `cook_time` are stored as plain integers representing minutes.

---

## Ingredients

**BR-04 — Ingredient names are unique.**
No two ingredient records can have the same name. This ensures that `"garlic"` is stored once and shared across all recipes that use it, rather than duplicated per recipe.

**BR-05 — Ingredient names are stored in lowercase.**
Names are normalised to lowercase at ingestion time. This means `"Garlic"`, `"GARLIC"`, and `"garlic"` all resolve to the same ingredient record.

---

## Search

**BR-06 — All search terms must be present in a recipe (AND logic).**
Providing multiple ingredient terms narrows the results — a recipe must contain all of them. There is no OR mode.

**BR-07 — Search is partial and case-insensitive.**
A term matches any ingredient whose name contains that string, regardless of case. Searching for `"oil"` returns recipes with `"olive oil"`, `"sesame oil"`, etc.

**BR-08 — Blank and duplicate search terms are silently discarded.**
Empty strings and repeated values are removed before the query runs. The client does not receive an error for providing them.

**BR-09 — Providing no valid search terms returns an empty result set.**
The API will not return all recipes when no ingredients are specified. The search is intentionally opt-in — a client must provide at least one meaningful term.

---

## Results Ordering

**BR-10 — Results are ordered by fewest ingredients first.**
Among all matching recipes, those with fewer total ingredients are surfaced first. The rationale is that simpler recipes are more likely to be achievable with what the user already has at home.

---

## Pagination

**BR-11 — Page size is fixed at 9 recipes.**
Clients cannot request a different page size. This keeps response payloads predictable and consistent.

**BR-12 — Page numbers below 1 are treated as 1.**
There is no error for an invalid page number — the API silently clamps it to the minimum valid value.

**BR-13 — Requesting a page beyond the last page returns an empty list.**
The API does not return an error in this case.
