require "test_helper"

class RecipesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @recipe = recipes(:one)
  end

  test("should get index") do
    get api_v1_recipes_url, as: :json
    assert_response :success
  end
end
