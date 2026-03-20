# API Reference

The API is versioned under the `/api/v1` namespace. It is read-only — only GET requests are accepted.

---

## Base URL

```
http://localhost:3000/api/v1
```

---

## Endpoints

### `GET /api/v1/recipes`

Search for recipes by ingredient names. Returns a paginated list.

#### Query Parameters

| Parameter        | Type            | Required | Description                                                    |
|------------------|-----------------|----------|----------------------------------------------------------------|
| `ingredients[]`  | array of strings | yes     | One or more ingredient names to search by. All must match.     |
| `page`           | integer          | no      | Page number (default: 1, minimum: 1).                          |

> If `ingredients[]` is empty or not provided, the response will contain an empty `recipes` array.

#### Example Request

```
GET /api/v1/recipes?ingredients[]=chicken&ingredients[]=garlic&page=1
```

#### Response Shape

```json
{
  "recipes": [
    {
      "id": 1,
      "title": "Garlic Chicken",
      "author": "Jane Doe",
      "category": "Main Course",
      "cuisine": "Italian",
      "image": "https://example.com/image.jpg",
      "prep_time": 10,
      "cook_time": 30,
      "ratings": 4.5,
      "ingredients": [
        { "id": 12, "name": "chicken" },
        { "id": 7,  "name": "garlic" }
      ]
    }
  ],
  "current_page": 1,
  "total_pages": 3
}
```

#### Response Fields

| Field          | Type    | Description                                      |
|----------------|---------|--------------------------------------------------|
| `recipes`      | array   | Paginated list of matching recipes.              |
| `current_page` | integer | The page number of the current result set.       |
| `total_pages`  | integer | Total number of pages for the matched result set.|

Each recipe object:

| Field         | Type    | Description                      |
|---------------|---------|----------------------------------|
| `id`          | integer | Recipe identifier.               |
| `title`       | string  | Recipe title.                    |
| `author`      | string  | Author of the recipe.            |
| `category`    | string  | Recipe category (e.g. Dessert).  |
| `cuisine`     | string  | Cuisine type (e.g. Italian).     |
| `image`       | string  | URL to the recipe image.         |
| `prep_time`   | integer | Preparation time in minutes.     |
| `cook_time`   | integer | Cooking time in minutes.         |
| `ratings`     | float   | Average rating.                  |
| `ingredients` | array   | List of ingredients for the recipe.|

Each ingredient object:

| Field  | Type    | Description           |
|--------|---------|-----------------------|
| `id`   | integer | Ingredient identifier.|
| `name` | string  | Ingredient name.      |

---

## Pagination

- Page size is fixed at **9 recipes per page**.
- The `page` parameter defaults to `1` and is clamped to a minimum of `1`.
- `total_pages` is computed as `ceil(total_count / 9)`.

---

## Search Behaviour

- Ingredient matching is **case-insensitive** (uses `ILIKE` with `%term%` wildcards).
- All provided ingredients must be present in a recipe for it to appear (**AND logic**).
- Results are **ordered by fewest ingredients first**, surfacing simpler recipes at the top.
- Blank values and duplicate ingredient parameters are silently discarded before the query runs.

---

## Health Check

### `GET /up`

Returns `200 OK` if the application has booted without errors. Returns `500` otherwise. Used by load balancers and uptime monitors.

---

## CORS

The API accepts cross-origin requests from `http://localhost:3001` (the web frontend). Allowed methods: `GET`, `OPTIONS`, `HEAD`.
