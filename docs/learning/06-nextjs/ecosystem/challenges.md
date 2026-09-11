# Next.js Ecosystem - Challenges

## Code Snippet Library - Better Create Form

Add `react-hook-form` to the project and use it to create a form for creating new snippets.

- Use the `register` function on your inputs.
- Use the `handleSubmit` function on your form.
- Use the `formState` object to show validation errors.
- Add validation rules to your inputs.

## Code Snippet Library - Favorites Page

Add a favorites page that displays the user's favorite snippets.

- create a global favoritesStore that holds an array of favorite snippet IDs and update functions.
- Create a Favorite Button that uses the store to add or remove a snippet from favorites. Use the component in the snippet detail page as well as in the snippets list.
- Create a FavoritesList page that uses the store to read the favorite snippets list.
- Create a server function that takes a list of snippet IDs and returns the corresponding snippets.
- Add a getSnippetsByIds function to the snippets service that queries the database for a list of snippets by ID. (postgres has a keyword called `ANY` that will come in handy here.)
- Either use a useEffect or Suspense boundary to call the async server function in your FavoritesList page.
- Persist the favorites list in localStorage. Make sure to prevent a hydration mismatch.

## Code Snippet Library - Interactive Code Editor

Add the Monaco editor to the snippet detail page for editing the code snippet. Add a button to switch between the code block display and code editor.
