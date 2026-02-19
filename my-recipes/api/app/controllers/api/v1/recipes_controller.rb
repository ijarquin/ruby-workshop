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
        # produces just a list of matching recipe IDs (no extra columns in the SELECT that would upset PostgreSQL's GROUP BY rules
        matching_ids = Recipe
          .joins(:ingredients)
          .where(ingredients: {name: ingredients})
          .group("recipes.id")
          .having("COUNT(DISTINCT ingredients.id) = ?", ingredients.size)
          .pluck(:id)

        # loads those recipes with their full ingredients association for serializatio
        Recipe.includes(:ingredients).where(id: matching_ids)
      end
    end
  end
end
