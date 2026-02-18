module Api
  module V1
    class RecipesController < ApplicationController
      # GET /recipes
      def index
        @recipes = Recipe.all

        render(json: {recipes: @recipes})
      end
    end
  end
end
