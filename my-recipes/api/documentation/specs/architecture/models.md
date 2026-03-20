# Models

The application has three ActiveRecord models. They represent the core domain and its many-to-many relationship.

---

## `Recipe`

**File:** `app/models/recipe.rb`

Represents a single recipe entry.

### Attributes

| Attribute    | Type    |
|--------------|---------|
| `title`      | string  |
| `author`     | string  |
| `category`   | string  |
| `cuisine`    | string  |
| `image`      | string  |
| `prep_time`  | integer |
| `cook_time`  | integer |
| `ratings`    | float   |

### Associations

```ruby
has_many :recipe_ingredients
has_many :ingredients, through: :recipe_ingredients
```

A recipe has many ingredients through the `recipe_ingredients` join table.

---

## `Ingredient`

**File:** `app/models/ingredient.rb`

Represents a unique, normalised ingredient name.

### Attributes

| Attribute | Type   |
|-----------|--------|
| `name`    | string |

### Associations

```ruby
has_many :recipe_ingredients
has_many :recipes, through: :recipe_ingredients
```

An ingredient can belong to many recipes through the `recipe_ingredients` join table.

---

## `RecipeIngredient`

**File:** `app/models/recipe_ingredient.rb`

The join model that links a `Recipe` to an `Ingredient`.

### Attributes

| Attribute       | Type   |
|-----------------|--------|
| `recipe_id`     | bigint |
| `ingredient_id` | bigint |

### Associations

```ruby
belongs_to :recipe
belongs_to :ingredient
```

---

## Relationship Overview

```
Recipe ──< RecipeIngredient >── Ingredient
```

- A `Recipe` has many `Ingredient` records through `RecipeIngredient`.
- An `Ingredient` has many `Recipe` records through `RecipeIngredient`.
- `RecipeIngredient` is a pure join model — it holds only the foreign keys and timestamps.

---

## Serialization

Models are not serialized directly. Instead, **Blueprinter** blueprints are used to control the JSON output shape:

- `RecipeBlueprint` — `app/blueprints/recipe_blueprint.rb`
- `IngredientBlueprint` — `app/blueprints/ingredient_blueprint.rb`

See [`api.md`](./api.md) for the full response shape.
