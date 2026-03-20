# Feature: Mobile Load More Recipes Button

## Summary

On mobile viewports (screen width below 640 px), the existing paginator component
is replaced by a "Load More" button. Tapping the button fetches the next page of
recipes from the API and appends the results below the recipes already visible on
the page. Once the final page has been loaded the button is hidden. On tablet and
desktop viewports the existing Prev / Next paginator remains unchanged.

---

## User Stories

### Story 1 — Load More button on mobile

As a mobile user browsing recipes,
I want to tap a "Load More" button to fetch additional recipes,
So that I can keep scrolling through results without navigating away from the
recipes I have already seen.

### Story 2 — Accumulated recipe list on mobile

As a mobile user who has tapped "Load More" one or more times,
I want the newly fetched recipes to appear below the ones already on screen,
So that I never lose my place in the list and can continue scrolling down.

### Story 3 — Button disappears on last page

As a mobile user who has reached the end of the result set,
I want the "Load More" button to disappear,
So that I know there are no more recipes to load and am not presented with a
non-functional control.

### Story 4 — Desktop and tablet pagination is unaffected

As a desktop or tablet user,
I want the existing Prev / Next paginator to continue working as before,
So that my browsing experience is not changed by this mobile-only feature.

### Story 5 — Loading state feedback while fetching

As a mobile user who has tapped "Load More",
I want the button to show a loading indicator while the next page is being fetched,
So that I receive immediate feedback that my action is being processed.

---

## Acceptance Criteria

### Scenario 1: Load More button is shown on mobile when more pages exist

**Given** a mobile user has searched for recipes
**And** the API response contains more than one page of results
**When** the first page of recipes is displayed
**Then** a "Load More" button is visible below the recipe list
**And** the Pagination component is not rendered

### Scenario 2: Tapping Load More appends the next page of recipes

**Given** a mobile user is viewing the first page of recipes
**And** a "Load More" button is visible
**When** the user taps the "Load More" button
**Then** the next page of recipes is fetched from the API
**And** those recipes are appended below the existing ones
**And** the previously visible recipes remain on screen

### Scenario 3: Load More button is hidden after the last page is loaded

**Given** a mobile user has tapped "Load More" until the final page is reached
**When** the last page of recipes has been appended
**Then** the "Load More" button is no longer rendered

### Scenario 4: Load More button shows a loading state while fetching

**Given** a mobile user taps the "Load More" button
**When** the next page request is in flight
**Then** the button is disabled
**And** the button label changes to indicate loading (e.g. "Loading...")

### Scenario 5: Desktop and tablet viewports render the Pagination component

**Given** a user is on a viewport 640 px wide or wider
**When** recipes are displayed
**Then** the existing Pagination component is rendered
**And** no "Load More" button is shown

### Scenario 6: Accumulated list resets when search parameters change

**Given** a mobile user has accumulated multiple pages of recipes
**When** the user submits a new ingredient search
**Then** the accumulated recipe list is cleared
**And** only the first page of results for the new search is shown
**And** the "Load More" button reappears if more pages exist

---

## Out of Scope

- Infinite scroll / automatic loading without a button tap
- Any changes to the Rails API — the existing pagination contract is sufficient
- Changes to the desktop or tablet pagination behaviour
- Persisting the accumulated list across browser sessions or page refreshes
- Any changes to the recipe detail panel behaviour on mobile

---

## Constraints and Dependencies

- Mobile breakpoint is defined as viewport width strictly below 640 px, consistent
  with the Tailwind CSS `sm:` breakpoint already used throughout the application.
- The `useWindowSize` hook already provides the viewport width and must be reused.
- The `useRecipes` hook (React Query) already caches individual pages by query key;
  accumulation logic must be handled in the component layer, not inside the hook.
- The API response shape (`recipes`, `current_page`, `total_pages`) must not change.
- The feature is purely a frontend change; no backend work is required.
