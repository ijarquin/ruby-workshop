require "rails_helper"

RSpec.describe "Api::V1::Favourites", type: :request do
  let!(:user) { User.create!(email: "test@example.com") }
  let!(:pasta) { Recipe.create!(title: "Pasta", cook_time: 20, prep_time: 10, ratings: 4.5) }
  let!(:salad) { Recipe.create!(title: "Salad", cook_time: 5, prep_time: 10, ratings: 4.0) }

  describe "GET /api/v1/users/:user_id/favourites" do
    context "when the user has favourited recipes" do
      before { user.recipes << pasta }

      it "returns the user's favourited recipes" do
        get("/api/v1/users/#{user.id}/favourites")
        json = JSON.parse(response.body)

        expect(response).to(have_http_status(:success))
        expect(json["recipes"].size).to(eq(1))
        expect(json["recipes"].first["title"]).to(eq("Pasta"))
      end
    end

    context "when the user has no favourites" do
      it "returns an empty collection" do
        get("/api/v1/users/#{user.id}/favourites")
        json = JSON.parse(response.body)

        expect(response).to(have_http_status(:success))
        expect(json["recipes"]).to(be_empty)
      end
    end

    context "when the user does not exist" do
      it "returns not found" do
        get("/api/v1/users/0/favourites")

        expect(response).to(have_http_status(:not_found))
      end
    end
  end

  describe "POST /api/v1/users/:user_id/favourites" do
    it "adds a recipe to the user's favourites" do
      post("/api/v1/users/#{user.id}/favourites", params: { recipe_id: pasta.id })
      json = JSON.parse(response.body)

      expect(response).to(have_http_status(:created))
      expect(json["recipes"].map { |r| r["title"] }).to(include("Pasta"))
    end

    it "does not duplicate a recipe already in favourites" do
      user.recipes << pasta

      post("/api/v1/users/#{user.id}/favourites", params: { recipe_id: pasta.id })
      json = JSON.parse(response.body)

      expect(response).to(have_http_status(:created))
      expect(json["recipes"].count { |r| r["title"] == "Pasta" }).to(eq(1))
    end

    it "returns not found when the recipe does not exist" do
      post("/api/v1/users/#{user.id}/favourites", params: { recipe_id: 0 })

      expect(response).to(have_http_status(:not_found))
    end

    it "returns not found when the user does not exist" do
      post("/api/v1/users/0/favourites", params: { recipe_id: pasta.id })

      expect(response).to(have_http_status(:not_found))
    end
  end

  describe "DELETE /api/v1/users/:user_id/favourites/:id" do
    before { user.recipes << pasta }

    it "removes the recipe from the user's favourites" do
      delete("/api/v1/users/#{user.id}/favourites/#{pasta.id}")
      json = JSON.parse(response.body)

      expect(response).to(have_http_status(:success))
      expect(json["recipes"]).to(be_empty)
    end

    it "returns not found when the recipe is not in the user's favourites" do
      delete("/api/v1/users/#{user.id}/favourites/#{salad.id}")

      expect(response).to(have_http_status(:not_found))
    end

    it "returns not found when the user does not exist" do
      delete("/api/v1/users/0/favourites/#{pasta.id}")

      expect(response).to(have_http_status(:not_found))
    end
  end
end
