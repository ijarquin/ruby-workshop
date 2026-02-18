class RenameDescriptionToNameInIngredients < ActiveRecord::Migration[8.1]
  def change
    rename_column(:ingredients, :description, :name)

    add_index(:ingredients, :name, unique: true)
  end
end
