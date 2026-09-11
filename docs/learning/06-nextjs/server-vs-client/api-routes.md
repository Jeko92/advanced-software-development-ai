# Next.js Server vs Client - API Routes

Server functions cover the case where your own UI needs to call the server. But not every caller is your UI. A mobile app might need the delivery data, a payment provider might send a webhook when a charge succeeds, or another team's service might want to read your deliveries as JSON. None of these is a React component rendering a form, so a server function does not fit. What they all understand is plain HTTP: a request to a URL with a method like GET or POST, and a response with a status code and a body. An API route, which Next.js calls a route handler, is how you expose exactly that. It is an endpoint at a URL you control, written in the same project as the rest of the app.

## The route.ts file

A route handler lives in a file named `route.ts`. It works like `page.tsx`, except that instead of returning UI it returns an HTTP response. The folder it sits in decides the URL, the same way folders decide page URLs, so `app/api/deliveries/route.ts` answers requests to `/api/deliveries`. Inside the file you export an async function for each HTTP method you want to support, named after the method in uppercase.

```typescript
import { getAllDeliveries } from "@/lib/services/deliveriesService";

export async function GET() {
  const deliveries = await getAllDeliveries();
  return Response.json(deliveries);
}
```

The following points are worth keeping in mind:

- The function is named `GET`, so it runs when someone makes a GET request to `/api/deliveries`
- It returns a `Response` rather than JSX, here built with `Response.json`, which serialises the value to JSON and sets the `Content-Type` header for you
- A folder cannot hold both a `page.tsx` and a `route.ts`, because one URL cannot be both a page and an endpoint

By convention these files live under an `api` folder, but that is only a naming habit. Any folder without a `page.tsx` can hold a `route.ts`.

## Reading the request and dynamic segments

Each method function receives the incoming request as its first argument, a standard `Request` object. For a POST that creates a delivery, you read the JSON body off the request with `await request.json()`:

```typescript
import { createDelivery } from "@/lib/services/deliveriesService";

export async function POST(request: Request) {
  const body = await request.json();
  const delivery = await createDelivery(body);

  return Response.json(delivery, { status: 201 });
}
```

The second argument to `Response.json` sets the status code. Returning `201` tells the caller the request succeeded and something was created, which is the conventional code for a POST that adds a record.

Dynamic segments work in route handlers just as they do in pages. An `[id]` folder matches any value in that position of the URL, and the matched value arrives through a `params` prop. As with pages in Next.js, `params` is a Promise, so you await it:

```typescript
import { getDeliveryById } from "@/lib/services/deliveriesService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const delivery = await getDeliveryById(id);

  if (!delivery) {
    return Response.json({ error: "Delivery not found" }, { status: 404 });
  }

  return Response.json(delivery);
}
```

A request to `/api/deliveries/2` runs this handler with `id` set to `"2"`. When nothing matches, the handler returns a `404` status with an error message, so the caller can tell the difference between a missing delivery and a successful one.

## Route handlers or server functions

Both server functions and route handlers run server code in response to something the client does, so it is worth being clear on when to reach for which.

A server function is the better fit when your own Next.js UI is the caller. The form that creates a delivery is the clearest case: you want to run server code on submit, you do not care about the URL or the HTTP method, and you would rather write a function call than a fetch. Server functions also tie into Next.js features like `revalidatePath`, so the page updates after the change.

A route handler is the better fit when the caller is not your UI. A public API, a webhook from a payment provider, a mobile app, or any client that speaks HTTP and expects a URL, a method, and a status code. You reach for a route handler when the endpoint itself, the contract other systems depend on, is the thing you are building.

## Resources

[Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

[route.ts file conventions](https://nextjs.org/docs/app/api-reference/file-conventions/route)
