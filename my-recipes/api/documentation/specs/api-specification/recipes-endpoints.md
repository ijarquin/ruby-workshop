# API Specification: Recipes Endpoints

## `GET /api/v1/recipes`

Returns a paginated list of recipes that match **all** of the provided ingredient search terms.

---

## Request

### URL

```
GET /api/v1/recipes
```

### Headers

| Header   | Value              | Required |
| -------- | ------------------ | -------- |
| `Accept` | `application/json` | no       |

### Query Parameters

| Parameter       | Type             | Required | Default | Description                                                           |
| --------------- | ---------------- | -------- | ------- | --------------------------------------------------------------------- |
| `ingredients[]` | array of strings | yes      | —       | Ingredient names to filter by. All terms must be present in a recipe. |
| `page`          | integer          | no       | `1`     | Page number to retrieve. Values below 1 are treated as 1.             |

### Parameter Rules

- `ingredients[]` values are **stripped** of leading and trailing whitespace.
- **Blank** values are ignored.
- **Duplicate** values are collapsed into a single term.
- Matching is **case-insensitive** and **partial** — searching for `"oil"` will match `"olive oil"`, `"coconut oil"`, etc.
- All terms use **AND logic** — a recipe must contain every provided ingredient to appear in the results.

### Example Requests

Search for recipes containing both chicken and garlic:

```
GET /api/v1/recipes?ingredients[]=chicken&ingredients[]=garlic
```

Retrieve the second page of results:

```
GET /api/v1/recipes?ingredients[]=chicken&page=2
```

---

## Response

### Status Codes

| Status | Condition                        |
| ------ | -------------------------------- |
| `200`  | Always, including empty results. |

### Body

```json
{
  "recipes": [...],
  "current_page": 1,
  "total_pages": 4
}
```

| Field          | Type    | Description                                             |
| -------------- | ------- | ------------------------------------------------------- |
| `recipes`      | array   | The recipes matching the search for the requested page. |
| `current_page` | integer | The page number returned.                               |
| `total_pages`  | integer | Total number of pages across all matching recipes.      |

### Recipe Object

```json
{
  "id": 1,
  "title": "Garlic Roasted Chicken",
  "author": "Jane Doe",
  "category": "Main Course",
  "cuisine": "Italian",
  "image": "https://example.com/image.jpg",
  "prep_time": 15,
  "cook_time": 45,
  "ratings": 4.7,
  "ingredients": [
    { "id": 3, "name": "chicken" },
    { "id": 7, "name": "garlic" },
    { "id": 12, "name": "olive oil" }
  ]
}
```

| Field         | Type    | Description                                    |
| ------------- | ------- | ---------------------------------------------- |
| `id`          | integer | Unique recipe identifier.                      |
| `title`       | string  | Recipe title. Unique across all recipes.       |
| `author`      | string  | Name of the recipe author.                     |
| `category`    | string  | Recipe category (e.g. `"Dessert"`, `"Snack"`). |
| `cuisine`     | string  | Cuisine type (e.g. `"Italian"`, `"Mexican"`).  |
| `image`       | string  | URL of the recipe image.                       |
| `prep_time`   | integer | Preparation time in minutes.                   |
| `cook_time`   | integer | Cooking time in minutes.                       |
| `ratings`     | float   | Average user rating.                           |
| `ingredients` | array   | All ingredients that belong to this recipe.    |

### Ingredient Object

| Field  | Type    | Description                   |
| ------ | ------- | ----------------------------- |
| `id`   | integer | Unique ingredient identifier. |
| `name` | string  | Ingredient name in lowercase. |

---

## Ordering

Results are ordered by **total ingredient count ascending** — recipes with fewer ingredients appear first. This surfaces simpler recipes at the top of the results.

---

## Pagination

- Page size is fixed at **9 recipes per page**.
- `total_pages` is `0` when there are no matching results.
- Requesting a page beyond `total_pages` returns an empty `recipes` array.

---

## Edge Cases

| Scenario                                  | Behaviour                                                  |
| ----------------------------------------- | ---------------------------------------------------------- |
| `ingredients[]` not provided              | Returns `{ recipes: [], current_page: 1, total_pages: 0 }` |
| All `ingredients[]` values are blank      | Same as not providing the parameter.                       |
| `page` is `0` or negative                 | Treated as `page=1`.                                       |
| `page` exceeds `total_pages`              | Returns an empty `recipes` array.                          |
| Ingredient term matches no recipes        | Returns an empty `recipes` array.                          |
| Duplicate ingredient terms in the request | Collapsed to one term before querying.                     |

---

## Full Example

**Request:**

```
GET /api/v1/recipes?ingredients[]=garlic&ingredients[]=lemon&page=1
```

**Response:**

```json
{
  "recipes": [
    {
      "id": 42,
      "title": "Lemon Garlic Shrimp",
      "author": "Mario Batali",
      "category": "Main Course",
      "cuisine": "Mediterranean",
      "image": "https://example.com/shrimp.jpg",
      "prep_time": 10,
      "cook_time": 15,
      "ratings": 4.8,
      "ingredients": [
        { "id": 7, "name": "garlic" },
        { "id": 19, "name": "lemon" },
        { "id": 23, "name": "shrimp" },
        { "id": 31, "name": "butter" }
      ]
    }
  ],
  "current_page": 1,
  "total_pages": 1
}
```
