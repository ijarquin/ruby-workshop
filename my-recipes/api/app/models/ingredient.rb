class Ingredient < ApplicationRecord
  has_many :recipe_ingredients
  has_meny :recipes, through: :recipe_ingredients
end
