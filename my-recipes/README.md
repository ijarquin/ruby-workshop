# my-recipes

The application has been split into two apps, a Ruby on Rails API and a Next.js frontend application (web). We have made use of docker for an easy set up, instructions on how to run the application locally can be found below in the installation and setup section.

## Product

It's dinner time! Create an application that helps users find the most relevant recipes that they can prepare with the ingredients that they have at home.

### User stories

We have created the following stories to address the statment above

#### Story 1 - Select or introduce ingredients

**As a** home cook,
**I want to** enter the ingredients I currently have available at home,
**So that** the application can find recipes I am able to prepare without needing to buy additional items.

**Acceptance Criteria:**

- Given I am on the main page, when I type an ingredient name into the search bar, then the ingredient is added to my list of selected ingredients.
- Given I have added one or more ingredients, when I submit the search, then all selected ingredients are used to query for matching recipes.
- Given I have added an ingredient by mistake, when I remove it from the selection, then it is no longer included in the search query.

**Notes:**

- The input must support adding multiple ingredients, not just one.
- The ingredient input should provide a clear experience, in line with the application's mobile-first and accessibility principles.

#### Story 2 - Retrieve recipes with matching ingredients

**As a** home cook,
**I want to** see a list of recipes that match the ingredients I have selected,
**So that** I can quickly identify what I can cook with what I already have at home.

**Acceptance Criteria:**

- Given I have selected one or more ingredients and submitted the search, then I should see a list of recipes that include the ingredients I selected.
- Given the search returns a large number of results, when the results are displayed, then they are paginated so the page remains performant and easy to navigate.
- Given the results are loading, when the API request is in progress, then a skeleton loading state is shown to maintain layout stability and avoid content shift.
- Given a recipe is displayed, when I click on a recipe card, then I can see key information such as the recipe title and list of ingredients.
- Given the search returns no results, then a clear and user-friendly message is shown indicating that no recipes matched the selected ingredients.
- Given I am on a mobile device, when the results are displayed, then the layout is responsive and easy to read on smaller screens.

#### Story 3 - Retrieve recipes ordered by closest match

**As a** home cook,
**I want to** see the retrieved recipes ordered by how closely they match my selected ingredients,
**So that** the recipes I can prepare with the fewest missing ingredients appear first, making it easier to decide what to cook.

**Acceptance Criteria:**

- Given the results are ordered by closest match, when I navigate between pages, then the ordering remains consistent across all pages.
- Given a recipe matches all of my selected ingredients with no extra ingredients required, when the results are displayed, then that recipe is ranked at the top of the list.
- Given I update my ingredient selection and resubmit the search, when the new results are displayed, then the ordering is recalculated based on the updated ingredient list.

**Notes:**

- The ordering logic must be handled server-side by the API.
- "Closest match" is defined as the recipe with the smallest number of extra ingredients.
- A perfect match (0 extra ingredients needed) must always be ranked above any partial match.

## 🚀 Tech Stack

    Backend: Ruby on Rails (API mode)

    Frontend: React Next.js application, Tailwind, Typescript and Tanstack query for data fetching.

    Database: PostgreSQL

## 🛠️ Architecture

The application is split into two main directories:

    my-recipes/api: The Rails API.

    my-recipes/web: The React application.

## API

the api is divided into three main parts, the data modeling, the data ingestion and the business logic.

### Data modeling

The core of the application lies in the relationship between recipes and ingredients. A recipe can have multiple ingredients, and an ingredient can be part of multiple recipes. This many-to-many relationship is implemented using a join table called `recipe_ingredients`.

- `recipes`: This table stores information about each recipe, such as its title, author, cooking time, etc.
- `ingredients`: This table contains a list of all available ingredients.
- `recipe_ingredients`: This join table connects recipes and ingredients together.

### Data Ingestion

To populate the database, we process a large JSON file containing recipes data.  
The strategy used to populate the db is a batching strategy, I have also removed any possible duplicate ingredients and recipes during the ingestion process.

- **Batch Processing**: I have decided on a batching strategy for three reasons,
  - first: to speed up the ingestion process, using upsert allows you to insert a batch or collection of elements with a single query instead of executing an insert query per record. This approach significantly reduces the time to ingest and prevents potential out-of-memory errors, especially with large datasets

  - secondly: data integrity, if something goes wrong the whole batch is discarded avoiding leaving the system in a partially updated state.

  - lastly: it allows us to execute the seeding process as part of the docker compose up command without a significant impact on the time needed, which means developers can have a fully functioning environment with a single command.

- **Efficiency and avoidance of duplicates**: We use `upsert_all` for recipes and ingredients. This command efficiently inserts new records and updates existing ones if a conflict (based on a unique constraint like `title` or `name`) occurs. This makes the seeding process idempotent, meaning it can be run multiple times without creating duplicate data.

- **Transactional Integrity**: Each batch is processed within a database transaction. This ensures that all records related to a batch (recipes, ingredients, and their associations) are either created successfully or not at all. This prevents the database from being left in a partially updated, inconsistent state if an error occurs during seeding.

### Business logic and code structure

The api has been versioned, this will allow us to change it in the future without potentially breaking the clients that consume the endpoint. I have also added rspec as the main test framework to write api and unit tests. The Rails API follows a standard convention-over-configuration approach:

- `app/controllers/api/v1`: Handles incoming HTTP requests and responds with the list of recipes matching the ingredients sent from the client. The `api/v1` namespace is used to version the API.
- `app/models`: Defines the application's data model and the relationships between tables.
- `app/blueprints`: A layer on top of the models that allows for custom JSON responses, ensuring that only the necessary data is exposed.
- `app/services`: Encapsulates the application's business logic. The `RecipesSearchService` lives in this folder and is responsible for finding recipes based on a given set of ingredients.
- `spec`: Contains the application's tests:
  - `spec/requests/api/v1/`: contains the api related tests. These are more high-level tests that check the logic that is related to the controller, api status code on responses and that return the expected json to the client.
  - `spec/services/`: contains the unit test related to the query added to search for the recipes with matching ingredients. This is a more fine-grained kind of test, we would test here all the possible cases related to the sql query as well as those edge cases that we deem necessary.

## Web

The web application is a Next.js application. The application has been structured in a way that shows a clear separation of concerns. The main directories are:

- `components`: Contains main UI components that have been used on the main page.
- `app`: Contains the application's main page(page.tsx) and the app providers(tanstack).
- `hooks`: Contains two custom React hooks, the main one used to fetch the recipes data from the api.
- `tests`: Contains all the application's tests.

The application has been designed with a mobile-first approach, ensuring that it is responsive and provides a seamless user experience across different devices.

### Search Functionality

The search functionality is implemented in the `SearchBar` component, which allows users to input ingredients and search for matching recipes. The search query includes the ingredients and the page requested, this data has been added as parameters in the query. Once the URL has been built the request is sent to the API, which will return a paginated list of recipes that match the provided ingredients. The request response is as follows:

```json
{
  "recipes": [
    {
      "id": 1,
      "title": "Spaghetti Carbonara",
      "author": "John Doe",
      "cooking_time": 30,
      "ingredients": [
        {
          "id": 1,
          "name": "Spaghetti"
        },
        {
          "id": 2,
          "name": "Eggs"
        },
        {
          "id": 3,
          "name": "Pancetta"
        }
      ]
    },
    ...
  ],
  "total_pages": 5,
  "current_page": 1
}
```

We have implemented data persistence through the URL query, this means that the search query is reflected in the URL, allowing users to share their search results with others or bookmark specific searches for future reference.

### design and styling

We have opted for a simple design that focuses on the user experience, the main focus is to make the search process as seamless as possible, we have used tailwind css for styling, and typescript to ensure type safety.

### web core vitals

We have implemented several optimizations to ensure that the web application performs well and provides a good user experience. We have always kept an eye on the web core vitals during the development process, and we have implemented several strategies to optimize the performance of the application, such as Skeleton loading to minimize any impact to the CLS, we have made use of the Core web Vitals chrome plugin to make sure that every parameter is under an accepted value. We also considered adding code splitting for dynamic bundle loading to speed up the js bundle loading process but decided not to add it due in part to time constraint but more importantly the fact that all core web vitals parameters were already in a very good shape.

### accessibility

We have implemented several accessibility features to ensure that the web application is usable by everyone, including those with disabilities. We have used semantic HTML elements, and ensured that the application can be navigated using a keyboard. Executing Lighthouse has given us a 94 score on accessibility.

### testing

We have implemented a comprehensive testing strategy to ensure the quality and reliability of the web application. We have followed the test pyramid principles, this includes unit tests for individual components, end-to-end tests to verify the overall functionality of the application, and UI tests to ensure that the user interface remains as expected. We have used popular testing libraries such as Vite and Playwright to write our tests.
Vite has been used for unit testing and playwright for e2e and ui testing.

## AI

Throughout the development process, I have made use of AI tools (Claude) to assist with various tasks. I have made use of AI for code generation especially around testing, I have explicitly described the scenarios to test and the expected behaviour and let the AI deal with the boilerplate of the test implementation, this has allowed me to focus more on the test strategy and the scenarios to cover rather than the implementation details of the tests. Every time AI has been used it has been in small increments so we could easily review the code generated and adjust it when it was need is. Other situations where I have made use of AI was for functionalities I didn't think they were strictly required by the test exersize but I thought they could enhance the user experience and help to improve some of the core web vitals, examples of this is the skeleton loading, the paginator component or the paginated response from the API.

## 🏁 Getting Started

### Prerequisites

- the only requirement is to have Docker running locally, however if you wanted to run the application manually without the use of docker, you need to install in your local environment:
  - Ruby (v4.x.x)
  - Node.js (v25)
  - PostgreSQL

### Installation

The easy way:

- Clone the repository: git clone https://github.com/pennylane-hiring/ijarquin
- cd my-recipes
- execute: docker compose up --build

Running the application locally without docker:

- Clone the repository: git clone https://github.com/pennylane-hiring/ijarquin

- api:
  - cd into my-recipes/api/
  - bundle install
  - bundle exec rails db:prepare
  - bundle exec rails s (api will run in port 3000 by the default)

- client(web)
  - cd into my-recipes/web/
  - nvm use 25 (make sure you are running on node version 25 or above)
  - npm install
  - npm run dev (take into consideration that you need to set the client to run a different port than the api)

### Running the tests

api: cd into the api folder and run `bundle exec rspec`
web: cd into the web folder and run:

- unit: npm run test:unit
- e2e: npm run test:e2e (you need the application running as these tests are run against a running server)
- ui: npm run test:ui (you need the application running as these tests are run against a running server)

### linting tools

- API, rubocop: bundle exec rubocop -A (the -A flag will correct all the offences)
- WEB, eslint and TSC, the list of command available are:
  - npm run lint
  - npm run lint:fix
  - npm run type-check
