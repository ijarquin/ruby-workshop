require "rails_helper"

RSpec.describe "Api::V1::Recipes", type: :request do
  let!(:flour) { Ingredient.create!(name: "flour") }
  let!(:sugar) { Ingredient.create!(name: "sugar") }
  let!(:eggs) { Ingredient.create!(name: "eggs") }

  # Recipe 1: Flour + Sugar (Matches if querying flour+sugar)
  let!(:simple_cake) do
    r = Recipe.create!(title: "Simple Cake", cook_time: 30, prep_time: 15, ratings: 4.5)
    r.ingredients << [flour, sugar]
    r
  end

  # Recipe 2: Flour + Sugar + Eggs (Matches if querying flour+sugar, because it's a superset)
  let!(:rich_cake) do
    r = Recipe.create!(title: "Rich Cake", cook_time: 45, prep_time: 20, ratings: 4.8)
    r.ingredients << [flour, sugar, eggs]
    r
  end

  describe "GET /api/v1/recipes" do
    context("when searching by ingredients") do
      it "returns recipes containing all the requested ingredients" do
        get("/api/v1/recipes", params: {ingredients: ["flour", "sugar"]})

        expect(response).to(have_http_status(:success))
        json = JSON.parse(response.body)
        recipes = json["recipes"]

        expect(recipes.size).to(eq(2))
        titles = recipes.map { |r| r["title"] }

        expect(titles).to(include("Simple Cake", "Rich Cake"))

        simple_cake_json = recipes.find { |r| r["title"] == "Simple Cake" }
        expect(simple_cake_json).to(have_key("ingredients"))
        expect(simple_cake_json["ingredients"]).to(be_an(Array))
        expect(simple_cake_json["ingredients"].first).to(have_key("id"))
        expect(simple_cake_json["ingredients"].first).to(have_key("name"))
        expect(simple_cake_json["ingredients"].first.keys).to(contain_exactly("id", "name"))
      end
    end
  end
end
