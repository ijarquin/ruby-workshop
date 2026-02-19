class RecipesSearchService
  def initialize(ingredients)
    @ingredients = ingredients
  end

  def with_matching_ingredients
    return Recipe.none if ingredients.empty?

    Recipe.includes(:ingredients).where(id: scope_matching_all_terms.select(:id))
  end

  private

  attr_reader :ingredients

  def scope_matching_all_terms
    ingredients.reduce(Recipe.all) do |s, term|
      s.where(
        "EXISTS (SELECT 1 FROM recipe_ingredients ri
                     JOIN ingredients i ON i.id = ri.ingredient_id
                     WHERE ri.recipe_id = recipes.id
                     AND i.name ILIKE ?)",
        "%#{term}%"
      )
    end
  end
end
