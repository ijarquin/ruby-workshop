class RecipeBlueprint < Blueprinter::Base
  identifier :id
  fields :title, :cook_time, :prep_time, :ratings, :cuisine, :category, :author, :image

  association :ingredients, blueprint: IngredientBlueprint
end
