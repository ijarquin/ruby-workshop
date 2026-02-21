require "rails_helper"

RSpec.describe "Api::V1::Recipes", type: :request do
  let!(:flour) { Ingredient.create!(name: "flour") }
  let!(:sugar) { Ingredient.create!(name: "sugar") }
  let!(:eggs) { Ingredient.create!(name: "eggs") }
  let!(:butter) { Ingredient.create!(name: "butter") }

  # Recipe 1: Flour + Sugar (Matches if querying flour+sugar)
  let!(:simple_cake) do
    r = Recipe.create!(title: "Simple Cake", cook_time: 30, prep_time: 15, ratings: 4.5)
    r.ingredients << [ flour, sugar ]
    r
  end

  # Recipe 2: Flour + Sugar + Eggs (Matches if querying flour+sugar, because it's a superset)
  let!(:rich_cake) do
    r = Recipe.create!(title: "Rich Cake", cook_time: 45, prep_time: 20, ratings: 4.8)
    r.ingredients << [ flour, sugar, eggs ]
    r
  end

  # Recipe 3: Flour + Butter (Mismatch if querying flour+sugar)
  let!(:butter_cookie) do
    r = Recipe.create!(title: "Butter Cookie", cook_time: 20, prep_time: 10, ratings: 4.0)
    r.ingredients << [ flour, butter ]
    r
  end

  describe "GET /api/v1/recipes" do
    context("when searching by ingredients") do
      it "returns recipes containing all the requested ingredients" do
        get("/api/v1/recipes", params: { ingredients: [ "flour", "sugar" ] })
        json = JSON.parse(response.body)
        recipes = json["recipes"]

        expect(response).to(have_http_status(:success))
        titles = recipes.map { |r| r["title"] }

        expect(recipes.size).to(eq(2))
        expect(titles).to(include("Simple Cake", "Rich Cake"))
        expect(titles).not_to(include("Butter Cookie"))

        simple_cake_json = recipes.find { |r| r["title"] == "Simple Cake" }

        expect(simple_cake_json).to(have_key("ingredients"))
        expect(simple_cake_json["ingredients"]).to(be_an(Array))
        expect(simple_cake_json["ingredients"].first).to(have_key("id"))
        expect(simple_cake_json["ingredients"].first).to(have_key("name"))
        expect(simple_cake_json["ingredients"].first.keys).to(contain_exactly("id", "name"))
      end

      it "includes pagination metadata in the response" do
        get("/api/v1/recipes", params: { ingredients: [ "flour", "sugar" ] })
        json = JSON.parse(response.body)

        expect(json).to(have_key("current_page"))
        expect(json).to(have_key("total_pages"))
        expect(json["current_page"]).to(eq(1))
        expect(json["total_pages"]).to(eq(1))
      end

      it "returns the requested page of results" do
        get("/api/v1/recipes", params: { ingredients: [ "flour", "sugar" ], page: 1 })
        json = JSON.parse(response.body)

        expect(json["current_page"]).to(eq(1))
      end

      it "returns an empty collection when no matching ingredients" do
        get("/api/v1/recipes", params: { ingredients: [ "bread" ] })
        json = JSON.parse(response.body)
        recipes = json["recipes"]

        expect(response).to(have_http_status(:success))
        expect(recipes.size).to(eq(0))
        expect(json["current_page"]).to(eq(1))
        expect(json["total_pages"]).to(eq(0))
      end
    end
  end
end
