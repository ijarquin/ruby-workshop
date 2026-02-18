module Api
  module V1
    class RecipesController < ApplicationController
      # GET api/v1/recipes
      def index
        @recipes = Recipe.all

        render(json: {recipes: RecipeBlueprint.render_as_hash(@recipes)})
      end
    end
  end
end
