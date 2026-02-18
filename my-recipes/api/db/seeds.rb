# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
#

require "json"

file_path = Rails.root.join("db", "data", "recipes-en.json")

if !File.exist?(file_path)
  puts("File not found at #{file_path}. Please check the location.")
  return
end

puts("Parsing JSON file... (this may take a moment for large files)")
recipes_data = JSON.parse(File.read(file_path))

puts("Starting ingestion of #{recipes_data.length} recipes...")

ActiveRecord::Base.transaction do
  recipes_data.each do |data|
    recipe = Recipe.find_or_create_by!(title: data["title"]) do |r|
      r.cook_time = data["cook_time"]
      r.prep_time = data["prep_time"]
      r.ratings = data["ratings"]
      r.cuisine = data["cuisine"]
      r.category = data["category"]
      r.author = data["author"]
      r.image = data["image"]
    end

    data["ingredients"].each do |full_string|
      ingredient = Ingredient.find_or_create_by!(name: full_string.downcase)

      RecipeIngredient.find_or_create_by!(
        recipe: recipe,
        ingredient: ingredient
      )
    end
  end
end

puts("Success! Ingested #{Recipe.count} recipes and #{Ingredient.count} unique ingredients.")
