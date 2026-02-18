class RecipesController < ApplicationController
  # GET /recipes
  def index
    @recipes = Recipe.all

    render(json: @recipes)
  end
end
