# Next.js App Router - Challenges

## Code Along

These challenges build the Kiki's Delivery Service app one route at a time. Start from a fresh Next.js 16 project created with the App Router and TypeScript, and use the starter data below so every challenge works from the same set of delivery requests.

### Project scaffolding

Create a new next app project:

```bash
npx create-next-app kikis-delivery-service
```

You will be prompted a few times to choose your preferences. Choose the following:

- TypeScript
- No Tailwind
- No `src/` directory
- Use App Router
- No ESlint
- Use Turbopack
- Custom Import Alias: "@/\*"

After that, remove the unneeded boilerplate from the `page.tsx` as well as the `layout.tsx`.

### Starter data

Create a mock deliveries service in the `lib/services/deliveriesService.ts` file:

```typescript
export type DeliveryStatus = "active" | "accepted" | "denied" | "fulfilled";

export type DeliveryRequest = {
  id: string;
  pickup: string;
  destination: string;
  status: DeliveryStatus;
};

const deliveries: DeliveryRequest[] = [
  { id: "1", pickup: "Bakery", destination: "Clock Tower", status: "active" },
  {
    id: "2",
    pickup: "Harbour",
    destination: "Hillside Cafe",
    status: "accepted",
  },
  { id: "3", pickup: "Bookshop", destination: "Lighthouse", status: "denied" },
  {
    id: "4",
    pickup: "Market Square",
    destination: "Train Station",
    status: "fulfilled",
  },
];

export function getAllDeliveries(): DeliveryRequest[] {
  return deliveries;
}

export function getDeliveryById(id: string): DeliveryRequest | null {
  return deliveries.find((d) => d.id === id) || null;
}
```

### The welcome Page

Create the `/` route. Add a `page.tsx` to a `pages` folder that imports the `deliveries` list and renders the first request, showing its pickup and destination.

### The deliveries list

Create the `/deliveries` route. Add a `page.tsx` to a `deliveries` folder that imports the `deliveries` list and renders every request, showing its pickup, destination, and status. Confirm that visiting `/deliveries` shows all four requests.

### Delivery detail with a dynamic route

Add a dynamic route so each request has its own page at `/deliveries/<id>`.

- Create an `[id]` folder inside `deliveries` with its own `page.tsx`
- Read the `id` from `params`, remembering that `params` is a Promise and must be awaited
- Find the matching request in the `deliveries` list and show its details

### Add content to the root layout

Add a title bar to the root layout, with the title "Kiki's Delivery Service".

- Add a header element with a nested h1 that says "Kiki's Delivery Service" to the Root Layout component

### Loading and error states

Add the two special files to the `deliveries` segment.

- Add a `loading.tsx` that shows a loading message while the page is being prepared
- Add an `error.tsx` that shows a fallback when rendering fails, with a button that calls `reset` to retry
- To see the error boundary work, throw an error inside the detail page (for example, when no request matches the id) and visit a `/deliveries/<id>` that does not exist

### Link deliveries to their details page

Add a link to the detail page for each request in the list.

- Add a `<Link>` to the list item, linking to `/deliveries/<id>`
- Add a `<Link>` to the detail page, linking back to `/deliveries`

### Use a custom font

Add a custom font to the Root Layout component, using the `next/font` package.

- Import the `Cherry_Bomb_One` font from `next/font/google`
- Add a `font-family` to the Root Layout component, using the `variable` property
- Use the font in the Root Layout component, using the `fontFamily` property and add it to the h1 element.

## Code Snippet Library

You build a simple code snippet library for keeping all your code snippets in one place. The snippets are stored for now in an array on the server. In this challenge you will build the snippet listing page as well as the details page for each snippet.

Scaffold a fresh Next.js project with the same setup answers as before, then store the snippets in a service file at `lib/services/snippetsService.ts`:

```typescript
export type Snippet = {
  id: number;
  title: string;
  language: string;
  description: string;
  code: string;
};

const snippets: Snippet[] = [
  {
    id: 1,
    title: "CSS Grid Areas",
    language: "CSS",
    description: "Create a grid with named areas.",
    code: ".grid-container {\n  display: grid;\n  grid-template-areas:\n    'header header header'\n    'sidebar content content'\n    'footer footer footer'; \n  grid-gap: 10px;\n  background-color: #2196F3;\n  padding: 10px;\n}",
  },
  {
    id: 2,
    title: "Range of numbers",
    language: "JavaScript",
    description: "Build an array from a start value up to an end value.",
    code: "const range = (start, end) =>\n  Array.from({ length: end - start }, (_, i) => start + i);",
  },
  {
    id: 3,
    title: "Group by key",
    language: "TypeScript",
    description: "Turn a list into buckets keyed by one of its fields.",
    code: "function groupBy(items, key) {\n  return items.reduce((acc, item) => {\n    (acc[item[key]] ??= []).push(item);\n    return acc;\n  }, {});\n}",
  },
];

export function getAllSnippets(): Snippet[] {
  return snippets;
}

export function getSnippetById(id: string): Snippet | null {
  return snippets.find((snippet) => snippet.id === id) || null;
}
```

With the data in place, build the rest of the project:

- Render a list of every snippet at `/snippets`, showing each one's title, language, and description. Put the code inside a `<pre>` as well as `<code>` element so the line breaks and indentation survive.
- Add a dynamic route at `/snippets/<id>` for the detail page of a single snippet. Read the `id` from `params`, look the snippet up with `getSnippetById`, and show its full details.
- Use the `Link` component to connect the pages: each snippet in the list links to its detail page, and the detail page links back to the list.
- Load a monospace font such as `JetBrains_Mono` for the code, and a separate body font such as `Inter` for everything else, both from `next/font/google`.
- Keep all styling in a single `<style>` tag inside the root layout. Set the body and heading typography there, and apply the monospace font to `pre` and `code` so the snippets read like code. (The real styling of the frontend is part of a future session.)
