# Next.js Server vs Client - Challenges

## Code Along

These challenges continue the Kiki's Delivery Service app from the previous session. Start from where that session left off: a Next.js 16 project with the App Router and TypeScript, the `deliveriesService`, and the `/`, `/deliveries`, and `/deliveries/[id]` routes. Each challenge adds one piece of the server/client picture on top of that app.

### Filter the deliveries with a client component

The deliveries list is a server component, so it cannot filter itself in response to a click. Add a client component that can.

- Create a `DeliveryFilter` component with `"use client"` at the top of the file
- Give it a `deliveries` prop typed as `DeliveryRequest[]`, and a piece of state for the selected status
- Render a `<select>` with one option per status plus an "All" option, and show only the deliveries that match the selected status
- In the `/deliveries` page, read the deliveries on the server as before, then pass them to `<DeliveryFilter>` as a prop
- Confirm that changing the dropdown filters the list without a page reload

### Add a "new delivery" form with a server function

Customers need a way to create a request. Add a form whose submit handler runs on the server.

- Add a `createDelivery` function to the `deliveriesService` that accepts a `pickup` and a `destination`, gives the new request a generated `id` and a `status` of `"active"`, pushes it onto the array, and returns it
- Create a `/deliveries/new` route with a `page.tsx`
- In that page, define an inline server function (`"use server"` as the first line of the function body) that reads `pickup` and `destination` from its `FormData`, calls `createDelivery`, and then calls `revalidatePath("/deliveries")`
- Render a `<form>` whose `action` is that server function, with text inputs named `pickup` and `destination` and a submit button
- Submit the form, then visit `/deliveries` and confirm the new request appears

### Move the server function into its own file

Refactor the form so its submit handler lives in a shared file, the way you would when a client component needs to call it.

- Create `app/actions.ts` with `"use server"` at the top, and move the `addDelivery` function there as a named export
- Import `addDelivery` into the page and pass it to the form's `action`
- Confirm the form still works exactly as before

### Expose the deliveries as an API route

Add an HTTP endpoint so a client outside your UI could read the deliveries.

- Create `app/api/deliveries/route.ts` with an exported `GET` function that reads all deliveries and returns them with `Response.json`
- Create `app/api/deliveries/[id]/route.ts` with a `GET` function that awaits `params`, looks the delivery up by id, returns it as JSON, and returns a `404` when no delivery matches
- Visit `/api/deliveries` and `/api/deliveries/1` in the browser and confirm you get JSON back, then visit `/api/deliveries/999` and confirm you get a 404

### Back the app with Postgres

Replace the in-memory array with a real database so requests survive a restart.

- Set up a PostgreSQL database. A local dockerized or a free hosted one. Both will work, as long as you provide it with a connection string.
- Create the table and seed it with the starter data:

```sql
CREATE TABLE deliveries (
  id SERIAL PRIMARY KEY,
  pickup TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
);

INSERT INTO deliveries (pickup, destination, status) VALUES
  ('Bakery', 'Clock Tower', 'active'),
  ('Harbour', 'Hillside Cafe', 'accepted'),
  ('Bookshop', 'Lighthouse', 'denied'),
  ('Market Square', 'Train Station', 'fulfilled');
```

- Install the `postgres` package and add your connection string to `.env` as `DATABASE_URL`
- Create `lib/db.ts` that builds the `sql` client from `process.env.DATABASE_URL` and exports it
- Rewrite `getAllDeliveries`, `getDeliveryById`, and `createDelivery` in the `deliveriesService` to query Postgres with tagged templates instead of the array
- Confirm the list, the detail pages, the filter, and the form all still work, then restart the dev server and confirm a delivery you created is still there

## Code Snippet Library

This continues the Code Snippet Library from the previous session: a Next.js project with the `snippetsService`, a `/snippets` list, and a `/snippets/[id]` detail page. Add interactivity, a way to create snippets, an endpoint, and a database, mirroring the Kiki's challenges.

### Filter snippets by language

- Create a client component with `"use client"` that takes the snippets as a prop and holds the selected language in state
- Render a `<select>` listing each language that appears in the data, plus an "All" option, and show only the snippets matching the selection
- Pass the snippets into it from the `/snippets` page, which stays a server component

### Add a "new snippet" form

- Add a `createSnippet` function to the `snippetsService` that accepts a title, language, description, and code, assigns an id, adds the snippet, and returns it
- Create a `/snippets/new` route with a form whose `action` is a server function
- Read the four fields from `FormData`, call `createSnippet`, and call `revalidatePath("/snippets")`
- Move the server function into an `app/actions.ts` file once it works inline

### Add a snippets API route

- Create `app/api/snippets/route.ts` with a `GET` that returns every snippet as JSON
- Create `app/api/snippets/[id]/route.ts` with a `GET` that returns one snippet by id, or a `404` when it is missing
- Add a `POST` to `app/api/snippets/route.ts` that reads a snippet from the request body, creates it, and returns it with status `201`

### Back the library with Postgres

- Create and seed a `snippets` table:

```sql
CREATE TABLE snippets (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  language TEXT NOT NULL,
  description TEXT NOT NULL,
  code TEXT NOT NULL
);
```

- Add a `DATABASE_URL` to `.env` and create the `sql` client in `lib/db.ts`
- Rewrite the `snippetsService` functions to query Postgres with tagged templates
- Confirm the list, detail pages, filter, form, and API routes all work against the database, and that snippets persist across a restart
