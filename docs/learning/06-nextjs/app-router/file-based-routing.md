# Next.js App Router - File Based Routing

In most React setups you wire up routing yourself: install a router, write a list of paths, and match each path to a component. Next.js removes that step. In the App Router, the folders inside the `app` directory are the routes, and the URL a user visits is just the path of folders leading to a page. There is no route list to keep in sync with your files, because the files are the route list. This is called file-based routing, and getting comfortable with it is most of what it takes to navigate a Next.js project.

## Folders as route segments

Each folder inside `app` adds one piece to the URL. A folder named `deliveries` corresponds to the `/deliveries` part of the address. Nesting folders nests the URL in the same way: a `deliveries` folder containing a `new` folder describes the path `/deliveries/new`. The `app` folder itself is the root of the site, so it stands for `/`.

A folder on its own does not create a visitable page. It only names a segment of a possible URL. To make a segment something a user can actually open, you add a `page.tsx` file to it.

## `page.tsx`

A `page.tsx` file turns a folder into a real, reachable page. The file must have a default export, and that export is a React component. Next.js renders it when a user visits the matching URL.

For the Kiki's Delivery Service home page, `app/page.tsx` handles the `/` route:

```tsx
export default function HomePage() {
  return (
    <div>
      <h1>Kiki's Delivery Service</h1>
      <p>Fast, reliable deliveries across the city.</p>
    </div>
  );
}
```

There are a few things to notice here:

- The file lives directly in `app`, so it answers the `/` URL
- The component is a plain function returning JSX, with no router configuration anywhere

## Nesting folders for nested URLs

To add a page that lists every delivery request, create a `deliveries` folder with its own `page.tsx`. Its location in the folder tree defines its URL:

```
app/
  page.tsx              ->  /
  deliveries/
    page.tsx            ->  /deliveries
```

The list page is again a default-exported component. Because it is a Server Component, it can read the delivery data directly while rendering, with no separate fetch from the browser:

```tsx
import { getAllDeliveries } from "@/lib/services/deliveriesService";

export default async function DeliveriesPage() {
  const deliveries = await getAllDeliveries(); // calls separate Backend API or makes a direct database query

  return (
    <div>
      <h1>All Deliveries</h1>
      <ul>
        {deliveries.map((delivery) => (
          <li key={delivery.id}>
            {delivery.pickup} to {delivery.destination} ({delivery.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
```

The `deliveries` data is directly accessed via the deliveries service and read while the component renders on the server. The browser receives a finished list as HTML. Another interesting feature of Server Components is that they can be async, so promises can be awaited directly in the component.

## Resources

[Defining routes](https://nextjs.org/docs/app/getting-started/project-structure)

[Pages and layouts](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
