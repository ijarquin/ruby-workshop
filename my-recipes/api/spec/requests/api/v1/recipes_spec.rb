require "rails_helper"

RSpec.describe "Api::V1::Recipes", type: :request do
  let!(:flour) { Ingredient.create!(name: "flour") }
  let!(:sugar) { Ingredient.create!(name: "sugar") }
  let!(:eggs) { Ingredient.create!(name: "eggs") }
  let!(:butter) { Ingredient.create!(name: "butter") }

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

  # Recipe 3: Flour + Butter (Mismatch if querying flour+sugar)
  let!(:butter_cookie) do
    r = Recipe.create!(title: "Butter Cookie", cook_time: 20, prep_time: 10, ratings: 4.0)
    r.ingredients << [flour, butter]
    r
  end

  describe "GET /api/v1/recipes" do
    context("when searching by ingredients") do
      before do
        get("/api/v1/recipes", params: {ingredients: ["flour", "sugar"]})
        json = JSON.parse(response.body)
        @recipes = json["recipes"]
      end

      it "returns a success response" do
        expect(response).to(have_http_status(:success))
      end

      it "returns recipes containing all the requested ingredients" do
        titles = @recipes.map { |r| r["title"] }

        expect(@recipes.size).to(eq(2))
        expect(titles).to(include("Simple Cake", "Rich Cake"))

        simple_cake_json = @recipes.find { |r| r["title"] == "Simple Cake" }

        expect(simple_cake_json).to(have_key("ingredients"))
        expect(simple_cake_json["ingredients"]).to(be_an(Array))
        expect(simple_cake_json["ingredients"].first).to(have_key("id"))
        expect(simple_cake_json["ingredients"].first).to(have_key("name"))
        expect(simple_cake_json["ingredients"].first.keys).to(contain_exactly("id", "name"))
      end

      it "does not return recipes where at least one ingredient does not match" do
        titles = @recipes.map { |r| r["title"] }
        expect(titles).not_to(include("Butter Cookie"))
      end

      it "returns and empty array when no ingredients match" do
        get("/api/v1/recipes", params: {ingredients: ["bread"]})
        json = JSON.parse(response.body)
        recipes = json["recipes"]

        expect(recipes.size).to(eq(0))
      end

      it "returns and empty array when no params passed" do
        get("/api/v1/recipes")
        json = JSON.parse(response.body)
        recipes = json["recipes"]

        expect(recipes.size).to(eq(0))
      end
    end
  end
end
