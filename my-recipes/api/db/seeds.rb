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

# --- Configuration ---
BATCH_SIZE = 1_000
file_path = Rails.root.join("db", "data", "recipes-en.json")

# --- File validation ---
unless File.exist?(file_path)
  puts("Seed file not found at #{file_path}. Halting.")
  return
end

# --- Data Loading ---
puts("Parsing JSON file at #{file_path}...")
begin
  json_data = JSON.parse(File.read(file_path))
  puts("Found #{json_data.length} recipes to process.")
rescue JSON::ParserError => e
  puts("Error parsing JSON file: #{e.message}. Halting.")
  return
end

# --- Seeding Process ---
puts("Starting ingestion in batches of #{BATCH_SIZE}...")
total_processed = 0

json_data.each_slice(BATCH_SIZE).with_index do |recipe_batch, index|
  puts("--- Processing batch #{index + 1} ---")
  recipes_to_create = []
  # Use a Set for efficient uniqueness
  all_ingredient_names = Set.new

  now = Time.current

  # 1. Prepare data for the current batch
  recipe_batch.each do |recipe_data|
    recipes_to_create <<
      {
        title: recipe_data["title"],
        cook_time: recipe_data["cook_time"],
        prep_time: recipe_data["prep_time"],
        ratings: recipe_data["ratings"],
        cuisine: recipe_data["cuisine"],
        category: recipe_data["category"],
        author: recipe_data["author"],
        image: recipe_data["image"],
        created_at: now,
        updated_at: now
      }
    recipe_data["ingredients"].each { |name| all_ingredient_names.add(name.downcase) }
  end

  # Use a transaction to ensure atomicity for each batch
  ActiveRecord::Base.transaction do
    # Drop duplicated recipes by title before upserting
    recipes_to_create.uniq! { |recipe| recipe[:title] }
    puts("Upserting #{recipes_to_create.length} recipes...")
    Recipe.upsert_all(recipes_to_create, unique_by: :title)

    # 3. Create a map of recipe titles to their newly created IDs
    batch_titles = recipes_to_create.map { |r| r[:title] }
    recipe_id_map = Recipe.where(title: batch_titles).pluck(:title, :id).to_h

    # 4. Bulk insert/update all unique ingredients for the batch
    puts("Upserting #{all_ingredient_names.length} unique ingredients...")
    ingredients_to_create = all_ingredient_names.map do |name|
      { name: name, created_at: now, updated_at: now }
    end

    Ingredient.upsert_all(ingredients_to_create, unique_by: :name)

    # 5. Create a map of ingredient names to their IDs
    ingredient_id_map = Ingredient.where(name: all_ingredient_names).pluck(:name, :id).to_h

    # 6. Prepare and bulk insert the join table records
    recipe_ingredients_to_create = []
    recipe_batch.each do |recipe_data|
      recipe_id = recipe_id_map[recipe_data["title"]]
      # Skip if recipe wasn't created for some reason
      next unless recipe_id

      recipe_data["ingredients"].each do |ing_name|
        ingredient_id = ingredient_id_map[ing_name.downcase]
        next unless ingredient_id

        recipe_ingredients_to_create <<
          {
            recipe_id: recipe_id,
            ingredient_id: ingredient_id,
            created_at: now,
            updated_at: now
          }
      end
    end

    if recipe_ingredients_to_create.any?
      puts("Inserting #{recipe_ingredients_to_create.length} recipe-ingredient associations...")
      RecipeIngredient.insert_all(recipe_ingredients_to_create.uniq)
    end
  end

  total_processed += recipe_batch.length
  puts("Batch #{index + 1} complete. Total recipes processed so far: #{total_processed}.")
end

puts("\n--- Seed process finished! ---")
puts("Total recipes in DB: #{Recipe.count}")
puts("Total unique ingredients in DB: #{Ingredient.count}")
