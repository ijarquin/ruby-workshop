module Api
  module V1
    class RecipesController < ApplicationController
      PER_PAGE = 9

      # GET api/v1/recipes
      def index
        raw_ingredients = params[:ingredients]
        page = [ params[:page].to_i, 1 ].max

        # Ensure ingredients are unique, sorted, and non-empty strings
        ingredients = Array(raw_ingredients).map(&:to_s).map(&:strip).reject(&:blank?).uniq.sort
        scope = RecipesSearchService.new(ingredients).with_matching_ingredients

        total_count = scope.count
        total_pages = (total_count.to_f / PER_PAGE).ceil
        paginated = scope.offset((page - 1) * PER_PAGE).limit(PER_PAGE)

        render(json: {
          recipes: RecipeBlueprint.render_as_hash(paginated),
          current_page: page,
          total_pages: total_pages
        })
      end
    end
  end
end
