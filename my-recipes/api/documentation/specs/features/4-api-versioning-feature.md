# Feature: API Versioning

As a developer consuming the recipes API,
I want all endpoints to be namespaced under `/api/v1`
So that future breaking changes can be introduced in new versions without affecting existing clients.

---

## Scenario 1: The recipes endpoint is reachable under the versioned namespace

**Given** the application is running
**When** a GET request is made to `/api/v1/recipes`
**Then** the response status is 200
**And** the response body contains recipe data

---

## Scenario 2: Requests to unversioned paths are not routed

**Given** the application is running
**When** a GET request is made to `/recipes` without the `/api/v1` prefix
**Then** the response status is 404
**And** no recipe data is returned

---

## Scenario 3: Requests to an unknown version are not routed

**Given** the application is running
**When** a GET request is made to `/api/v2/recipes`
**Then** the response status is 404
**And** no recipe data is returned

---

## Scenario 4: Only explicitly allowed actions are exposed

**Given** the recipes resource is configured with `only: [:index]`
**When** a POST, PUT, PATCH, or DELETE request is made to any `/api/v1/recipes` path
**Then** the response status is 404
**And** the server does not attempt to process the request
