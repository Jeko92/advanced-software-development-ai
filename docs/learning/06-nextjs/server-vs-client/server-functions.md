# Next.js Server vs Client - Server Functions

So far data has moved in one direction: the server reads it and the client displays it. Saving a change goes the other way. When a customer submits a new delivery request, the browser has the form values, but the database lives on the server, and a client component cannot reach it. It has no database connection and no access to secrets, and you would not want it to, since anything in the browser is visible to the user.

In a traditional app you would write a backend endpoint that accepts the form data, and a fetch call on the client-side that posts to it. Traditional strategy:

**Backend:**

```typescript
// API Route
app.post("/api/user", (req, res) => {
  // write data
});
```

**Frontend:**

```typescript
async function handleSubmit(data) {
  await fetch("/api/user", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
```

Next.js provides a mechanism for this scenario that feels almost magical: Server functions. Instead of creating API endpoints and manually sending requests to it, you can define a server function that contains the server-side logic. When you call it from your client code as if it were a local function, Next.js will automatically create the network request and endpoint behind the scenes.

## The "use server" directive

A server function is marked with the `"use server"` directive. It is the mirror image of `"use client"`: where that directive pulls a component into the browser, this one pins a function to the server. When client code calls a server function, Next.js does not run the function in the browser. It sends the arguments to the server, runs the function there, and sends the result back. You see a normal function call; the network round-trip is generated underneath it.

Because the function genuinely runs on the server, it can do the things a server can do: read and write the database, use secret keys, and touch the file system. None of that code is ever sent to the browser.

## Inline server functions and form actions

You can define a server function directly inside a server component by writing `"use server"` as the first line of the function body. This pairs well with a form, because a `<form>` accepts a server function as its `action`, and on submit Next.js calls that function with the form's data as a `FormData` object.

```tsx
import { createDelivery } from "@/lib/services/deliveriesService";
import { revalidatePath } from "next/cache";

export default function NewDeliveryPage() {
  async function addDelivery(formData: FormData) {
    "use server";

    const pickup = formData.get("pickup") as string;
    const destination = formData.get("destination") as string;

    await createDelivery({ pickup, destination });
    revalidatePath("/deliveries");
  }

  return (
    <form action={addDelivery}>
      <input name="pickup" placeholder="Pickup" />
      <input name="destination" placeholder="Destination" />
      <button type="submit">Create request</button>
    </form>
  );
}
```

What each part is doing:

- `addDelivery` is marked `"use server"`, so it runs on the server even though the form that triggers it is rendered into the browser
- `createDelivery` writes the new request to the database, which is only possible because this code runs on the server

This form needs no `onSubmit` handler and no `useState`. The page can stay a server component, because the only browser-side behaviour, submitting the form, is handled via `action` a browser feature that does not use JavaScript.

## Refreshing data with revalidatePath

After a server function changes data, the pages that show that data are out of date. Next.js caches rendered pages, so the deliveries list would keep showing the old set until something tells it to rebuild. `revalidatePath` is that signal. Calling `revalidatePath("/deliveries")` marks the cached `/deliveries` page as stale, so Next.js renders it again with the new data on the next visit.

You call it inside the server function, after the write succeeds, naming the route whose data just changed. Without it, the customer might submit a new request and then see a list that does not include it, simply because they are looking at a cached copy from before the change.

## File-based server functions

When a client component needs to trigger a server function, an inline function will not work, because a client component cannot contain server code. Instead you put the function in its own file that starts with `"use server"`. Every function exported from that file becomes a server function, and a client component can import and call it.

```ts
"use server";

import { createDelivery } from "@/lib/services/deliveriesService";
import { revalidatePath } from "next/cache";

export async function addDelivery(formData: FormData) {
  const pickup = formData.get("pickup") as string;
  const destination = formData.get("destination") as string;

  await createDelivery({ pickup, destination });
  revalidatePath("/deliveries");
}
```

With the directive at the top of the file, you do not repeat it inside each function. A client component imports `addDelivery` like any other function:

```tsx
"use client";

import { addDelivery } from "@/app/actions";

export default function NewDeliveryForm() {
  return (
    <form action={addDelivery}>
      <input name="pickup" placeholder="Pickup" />
      <input name="destination" placeholder="Destination" />
      <button type="submit">Create request</button>
    </form>
  );
}
```

This is the exception to the prop serialization rule from the previous file. An ordinary function cannot be passed across the boundary, but a server function can, because Next.js sends a reference to the server-side function rather than the function itself. When the client calls it, the call travels to the server.

## Using parameters and return values with server functions

A server function can receive any arguments and return any value, just like a regular function, as long as the values are serializable.

```typescript
"use server";

import { createDelivery } from "@/lib/services/deliveriesService";

type CreateInput = { pickup: string; destination: string; priority?: number };
type CreateResult = { ok: true; id: string } | { ok: false; error: string };

export async function addDelivery(input: CreateInput): Promise<CreateResult> {
  try {
    const delivery = await createDelivery(input);
    return { ok: true, id: delivery.id };
  } catch (error) {
    return { ok: false, error: "Could not create delivery" };
  }
}
```

This function can now be called on the client as if it was a regular function:

```typescript
"use client";
import { addDelivery } from "@/lib/actions/deliveries";

export function CreateButton() {
  async function onClick() {
    const result = await addDelivery({ pickup: "A", destination: "B" });
    if (result.ok) console.log(result.id);
  }
  return <button onClick={onClick}>Create</button>;
}
```

Serialized props in combination with server functions allow you to blend server and client code and focus on the crucial parts: how to group your code as components.

## Resources

["use server" directive](https://nextjs.org/docs/app/api-reference/directives/use-server)

[Server Functions](https://nextjs.org/docs/app/getting-started/updating-data)

[revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
