# Feature: Initial Skeleton

As a developer setting up the recipes API,
I want a Rails API-only application configured with PostgreSQL and CORS support
So that I have a solid and deployable foundation to build features on top of.

---

## Scenario 1: The application boots successfully

**Given** the Rails application is configured in API-only mode
**When** the server starts
**Then** the application boots without errors
**And** it connects to a PostgreSQL database

---

## Scenario 2: The health check endpoint responds

**Given** the application is running
**When** a GET request is made to `/up`
**Then** the response status is 200
**And** the application confirms it is live and healthy

---

## Scenario 3: The health check fails if the app has errors on boot

**Given** the application has a boot-time exception
**When** a GET request is made to `/up`
**Then** the response status is 500

---

## Scenario 4: Cross-origin requests are accepted

**Given** the application has CORS configured
**When** a request is made from an allowed external origin
**Then** the response includes the appropriate CORS headers
**And** the request is not blocked

---

## Scenario 5: The application runs across all environments

**Given** the application has development, test, and production environment configurations
**When** the application is started in any of those environments
**Then** it loads the correct environment-specific settings without errors
