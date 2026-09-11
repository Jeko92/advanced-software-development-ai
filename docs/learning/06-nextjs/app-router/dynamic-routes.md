# Next.js App Router - Dynamic Routes

The deliveries list shows every request, but each request also needs its own detail page at a URL like `/deliveries/42`. You cannot create a folder for every delivery, because the requests are added by users and there could be thousands of them. What the folder names have in common is the shape `/deliveries/<some id>`, where the id is the only part that changes. A dynamic route captures exactly that: one folder that matches any value in a segment of the URL and hands you that value to work with.

## The square-bracket folder

You mark a segment as dynamic by wrapping the folder name in square brackets. A folder named `[id]` matches any single value in that position of the path. For the delivery detail page, the structure looks like this:

```
app/
  deliveries/
    page.tsx          ->  /deliveries
    [myAmazingId]/
      page.tsx        ->  /deliveries/42, /deliveries/7, /deliveries/anything
```

The name inside the brackets, `id`, is the one you choose, and it becomes the key under which Next.js gives you the matched value. A request for `/deliveries/42` renders `app/deliveries/[id]/page.tsx` with the id `"42"`.

## Reading params

Next.js passes the matched URL values to the page through a `params` prop. This prop is a Promise, so the page component is written as an `async` function and you `await params` before reading it. Awaiting it gives you an object whose keys match your bracket folder names. `PageProps` is a utility type from Next.js that infers the shape of the `params` object from the URL passed through the generic.

```tsx
import { getDeliveryById } from "@/lib/services/deliveriesService";

export default async function DeliveryDetailPage({
  params,
}: PageProps<"/deliveries/[myAmazingId]">) {
  const { myAmazingId } = await params;
  const delivery = await getDeliveryById(myAmazingId);

  if (!delivery) {
    return (
      <div>
        <h1>Delivery {id} not found</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Delivery {id}</h1>
      <p>
        From {delivery.pickup} to {delivery.destination}
      </p>
      <p>Status: {delivery.status}</p>
    </div>
  );
}
```

Forgetting to await `params` is the most common mistake here. If you read `params.myAmazingId` directly without awaiting, you are reading a property off a Promise, not off the resolved values, and it will not hold the id you expect.

## Generating pages ahead of time

By default a dynamic route renders on demand: the page for `/deliveries/42` is built when someone requests it. If you already know the full set of ids at build time, you can list them from a function named `generateStaticParams`, and Next.js will build those pages in advance so they are served instantly.

```tsx
export async function generateStaticParams() {
  const deliveries = await getDeliveries();
  return deliveries.map((delivery) => ({ myAmazingId: delivery.id }));
}
```

Each object in the returned array matches the shape of the route's `params`, with one entry per page to pre-build. This is an optional optimization for routes whose values are known ahead of time, such as a fixed set of records.

## Resources

[Dynamic routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)

[generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
