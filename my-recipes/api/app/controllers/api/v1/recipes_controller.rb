module Api
  module V1
    class RecipesController < ApplicationController
      # GET api/v1/recipes
      def index
        raw_ingredients = params[:ingredients]

        # Ensure ingredients are unique, sorted, and non-empty strings
        ingredients = Array(raw_ingredients).map(&:to_s).map(&:strip).reject(&:blank?).uniq.sort
        recipes = RecipesSearchService.new(ingredients)

        render(json: {recipes: RecipeBlueprint.render_as_hash(recipes.with_matching_ingredients)})
      end
    end
  end
end
