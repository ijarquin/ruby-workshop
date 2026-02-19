require "rails_helper"

RSpec.describe RecipesSearchService, type: :model do
  let!(:flour) { Ingredient.create!(name: "flour") }
  let!(:sugar) { Ingredient.create!(name: "sugar") }
  let!(:eggs) { Ingredient.create!(name: "eggs") }
  let!(:butter) { Ingredient.create!(name: "butter") }

  let!(:simple_cake) do
    r = Recipe.create!(title: "Simple Cake", cook_time: 30, prep_time: 15, ratings: 4.5)
    r.ingredients << [ flour, sugar ]
    r
  end

  let!(:rich_cake) do
    r = Recipe.create!(title: "Rich Cake", cook_time: 45, prep_time: 20, ratings: 4.8)
    r.ingredients << [ flour, sugar, eggs ]
    r
  end

  let!(:butter_cookie) do
    r = Recipe.create!(title: "Butter Cookie", cook_time: 20, prep_time: 10, ratings: 4.0)
    r.ingredients << [ flour, butter ]
    r
  end

  describe "#with_matching_ingredients" do
    subject(:results) { described_class.new(ingredients).with_matching_ingredients }

    context "when no ingredients are given" do
      let(:ingredients) { [] }

      it "returns an empty relation" do
        expect(results).to(be_empty)
      end
    end

    context "when all ingredients match exactly" do
      let(:ingredients) { [ "flour", "sugar" ] }

      it "returns recipes that have all the requested ingredients" do
        expect(results).to(include(simple_cake, rich_cake))
      end

      it "excludes recipes missing at least one ingredient" do
        expect(results).not_to(include(butter_cookie))
      end
    end

    context "when a recipe has more ingredients than requested" do
      let(:ingredients) { [ "flour", "sugar" ] }

      it "still returns the recipe" do
        expect(results).to(include(rich_cake))
      end
    end

    context "when ingredients are partial matches" do
      let(:ingredients) { [ "flou", "sug" ] }

      it "returns recipes whose ingredients contain the term" do
        expect(results).to(include(simple_cake, rich_cake))
      end

      it "excludes recipes missing an ingredient matching each term" do
        expect(results).not_to(include(butter_cookie))
      end
    end

    context "when matching is case-insensitive" do
      let(:ingredients) { [ "FLOUR", "SUGAR" ] }

      it "returns matching recipes regardless of case" do
        expect(results).to(include(simple_cake, rich_cake))
      end
    end

    context "when ordering by closeness of match" do
      let(:ingredients) { [ "flour", "sugar" ] }

      it "returns recipes with fewer extra ingredients first" do
        # simple_cake has 2 ingredients (exact match), rich_cake has 3 (1 extra)
        expect(results.first).to(eq(simple_cake))
        expect(results.last).to(eq(rich_cake))
      end
    end

    context "when no ingredient matches" do
      let(:ingredients) { [ "bread" ] }

      it "returns an empty relation" do
        expect(results).to(be_empty)
      end
    end
  end
end
