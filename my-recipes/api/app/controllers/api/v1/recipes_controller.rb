module Api
  module V1
    class RecipesController < ApplicationController
      # GET api/v1/recipes
      def index
        raw_ingredients = params[:ingredients]

        # Ensure ingredients are unique, sorted, and non-empty strings
        ingredients = Array(raw_ingredients).map(&:to_s).map(&:strip).reject(&:blank?).uniq.sort

        render(json: {recipes: RecipeBlueprint.render_as_hash(recipes_with_matching_ingredients(ingredients))})
      end

      private

      def recipes_with_matching_ingredients(ingredients)
        return Recipe.none if ingredients.empty?

        # Each term adds an EXISTS clause, so every term must match at least one ingredient in the recipe
        scope = ingredients.reduce(Recipe.all) do |s, term|
          s.where(
            "EXISTS (SELECT 1 FROM recipe_ingredients ri
                     JOIN ingredients i ON i.id = ri.ingredient_id
                     WHERE ri.recipe_id = recipes.id
                     AND i.name ILIKE ?)", "%#{term}%"
          )
        end

        Recipe.includes(:ingredients).where(id: scope.select(:id))
      end
    end
  end
end
