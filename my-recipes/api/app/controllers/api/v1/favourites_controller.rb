module Api
  module V1
    class FavouritesController < ApplicationController
      before_action :set_user

      # GET /api/v1/users/:user_id/favourites
      def index
        render(json: { recipes: RecipeBlueprint.render_as_hash(@user.recipes) })
      end

      # POST /api/v1/users/:user_id/favourites
      def create
        recipe = Recipe.find(params[:recipe_id])
        @user.recipes << recipe unless @user.recipes.include?(recipe)
        render(json: { recipes: RecipeBlueprint.render_as_hash(@user.recipes) }, status: :created)
      rescue ActiveRecord::RecordNotFound
        render(json: { error: "Recipe not found" }, status: :not_found)
      end

      # DELETE /api/v1/users/:user_id/favourites/:id
      def destroy
        recipe = @user.recipes.find(params[:id])
        @user.recipes.delete(recipe)
        render(json: { recipes: RecipeBlueprint.render_as_hash(@user.recipes) })
      rescue ActiveRecord::RecordNotFound
        render(json: { error: "Recipe not found in favourites" }, status: :not_found)
      end

      private

      def set_user
        @user = User.find(params[:user_id])
      rescue ActiveRecord::RecordNotFound
        render(json: { error: "User not found" }, status: :not_found)
      end
    end
  end
end
