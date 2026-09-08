# Next.js Server vs Client - Client Components

Not all components can run on the server if we want to make them interactive. There is no way to track what the user typed, respond to a click, or run an effect, because the things that do those jobs in React, like `useState`, `useEffect`, and event handlers such as `onClick`, only exist in the browser. A client component is the way to opt a part of the tree back into the browser, where React runs the full lifecycle and state and events work as you are used to. You reach for one whenever a piece of UI needs to remember something or react to the user.

## The "use client" directive

You turn a component into a client component by writing `"use client"` as the very first line of the file, above the imports. From that point the component runs in the browser, so it can use state, effects, and event handlers.

A status filter for the deliveries list is a good example. It holds the selected status in state and updates the visible list as the user changes a dropdown:

```tsx
"use client";

import { useState } from "react";
import type { DeliveryRequest } from "@/lib/services/deliveriesService";

export default function DeliveryFilter({
  deliveries,
}: {
  deliveries: DeliveryRequest[];
}) {
  const [status, setStatus] = useState("all");

  const visible =
    status === "all"
      ? deliveries
      : deliveries.filter((delivery) => delivery.status === status);

  return (
    <div>
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="accepted">Accepted</option>
        <option value="fulfilled">Fulfilled</option>
      </select>
      <ul>
        {visible.map((delivery) => (
          <li key={delivery.id}>
            {delivery.pickup} to {delivery.destination} ({delivery.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
```

The pieces that depend on the browser, and so depend on `"use client"`:

- `useState` holds the currently selected status between renders
- `onChange` is an event handler that runs when the user picks an option
- The list re-renders on every change, because state updates trigger a re-render.

The data still comes from the server. `DeliveryFilter` receives the full `deliveries` list as a prop from the server component that renders it, then filters that list in the browser as the user clicks around.

## Everything inside a client component runs in the browser

It is easy to read `"use client"` as a label you stick on each component that needs the browser. It is more than that. The directive marks the point where the tree switches from server to client, and everything imported into a client component from there down is also client code. If `DeliveryFilter` imports a `<StatusBadge>` component, `StatusBadge` runs in the browser too, even though it has no `"use client"` line of its own. It is on the client side of the boundary, so it is a client component.

This means you put the directive at the top of the boundary, not on every component beneath it. You mark `DeliveryFilter`, the component that first needs state, and the smaller components it uses come along automatically. A common mistake is to scatter `"use client"` across an entire feature out of caution. The opposite is the goal: keep the directive as low in the tree as you can, so the interactive part runs in the browser and as much as possible above it stays on the server.

Keep in mind that if the child components also use a hook or add interaction to an element, they still need to explicilty be marked as client components with "use client".

## Serializing props across the boundary

Props flow into a client component from the server component that renders it, the way `deliveries` flows into `DeliveryFilter`. Those props do not travel as objects in memory. As the previous file described, the server sends the client component's data across the network, and anything sent across the network has to be turned into a stream of text first and rebuilt on the other side. That conversion is called serialization, and it only works for certain kinds of values.

Values that serialize, and so can be passed as props to a client component:

- Strings, numbers, booleans, `null`, and `undefined`
- Plain objects and arrays made of these values, such as the `deliveries` array
- `Date` objects, `Map`, and `Set`

Values that do not serialize, and so cannot be passed:

- Ordinary functions, including a callback you might want to hand down
- Class instances, because their methods and prototype do not survive the conversion

Therefore, we need to be careful where to place the "use client" boundary and what props to pass from the server to the client.

## Resources

["use client" directive](https://nextjs.org/docs/app/api-reference/directives/use-client)

[Passing props from Server to Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components#passing-data-from-server-to-client-components)
