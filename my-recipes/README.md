# my-recipes

The application will be splitted into two apps, a ruby api and a next.js frontend. we use docker for an easy set up, instruction on how to run the applicatin locally can be found bellow in the instalation section

## 🚀 Tech Stack

    Backend: Ruby on Rails (API mode)

    Frontend: React next.js application, we will be using tailwind and typescript

    Database: PostgreSQL

## 🛠️ Architecture

The application is split into two main directories:

    my-recipes/api: The Rails API.

    my-recipes/web: The React application.

## API

the api is devided into three main parts, the data modeling, the data ingestion and the bussines logic.

### Data modeling

The core of the application lies in the relationship between recipes and ingredients. A recipe can have multiple ingredients, and an ingredient can be part of multiple recipes. This many-to-many relationship is implemented using a join table called `recipe_ingredients`.

- `recipes`: This table stores information about each recipe, such as its title, author, cooking time, etc.
- `ingredients`: This table contains a list of all available ingredients.
- `recipe_ingredients`: This join table connects recipes and ingredients.

### Data Ingestion

To populate the database, we process a large JSON file containing recipes data.  
The strategy used to populate the db is a batching strategy, I have also remove any posible recipe duplicates during the ingestion process.

- **Batch Processing**: I have decided for a batching strategy for two reason, first to spead up the ingestion proccess, using upsert allows you to insert a batch or collection of element with a single query instead
  instead of executing and insert query per record. This approach significantly reduces the time to ingest and prevents potential out-of-memory errors, especially with large datasets and also allow us
  to execute the seeding proccess as part of the docker compose up command without a significan impact which means developes can have a fully functioning environment with a single
  command.

- **Idempotency and Efficiency**: We use `upsert_all` for recipes and ingredients. This command efficiently inserts new records and updates existing ones if a conflict (based on a unique constraint like `title` or `name`) occurs. This makes the seeding process idempotent, meaning it can be run multiple times without creating duplicate data.

- **Transactional Integrity**: Each batch is processed within a database transaction. This ensures that all records related to a batch (recipes, ingredients, and their associations) are either created successfully or not at all. This prevents the database from being left in a partially updated, inconsistent state if an error occurs during seeding.

### Bussines logic and code structure

The api have been versioned, this will allow us to change it in the future with potentially broken the clients that consume the endpoint. I have also added rspec as the main
test framework to write api and unit tests. The Rails API follows a standard convention-over-configuration approach:

- `app/controllers/api/v1`: Handles incoming HTTP requests and sends responses. The `Api/v1` namespace is used to version the API.
- `app/models`: Defines the application's data model and the relationships between tables.
- `app/blueprints`: A layer on top of the models that allows for custom JSON responses, ensuring that only the necessary data is exposed.
- `app/services`: Encapsulates the application's business logic. For example, the `RecipesSearchService` is responsible for finding recipes based on a given set of ingredients.
- `spec`: Contains the application's tests, ensuring code quality and reliability.
  - `spec/requests/api/v1/`: contains the api related tests.
  - `spec/services/`: contains the unit test related to the query added to search for the recipes with mathing ingredients.

## 🏁 Getting Started

### Prerequisites

    Ruby (v4.x.x)

    Node.js (v25)

    PostgreSQL

### Installation

    Clone the repository: git clone https://github.com/pennylane-hiring/ijarquin
    cd my-recipes
    execute: docke compose up
