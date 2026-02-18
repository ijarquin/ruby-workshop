class AddUniqueIndexToRecipesTitle < ActiveRecord::Migration[8.1]
  def change
    add_index(:recipes, :title, unique: true)
  end
end
