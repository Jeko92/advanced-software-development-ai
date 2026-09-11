# Next.js Server vs Client - Component Architecture

Most web apps you have seen so far are built as two projects. For example, a frontend written with React.js, and a backend often an Express.js application. Between them sits the network. When the frontend needs data, it makes a fetch call to a URL the backend exposes, the backend reads its database and sends JSON back, and the frontend renders it. You write both parts and the communication in between everything by hand. Including an endpoint on one side, a fetch on the other, an agreed-upon shape for the JSON in the middle. Next.js abstracts away much of the complexity of this separation while providing type safety from the database all the way to the components that consume the data..


## Importing across the boundary

With the App Router, Next.js no longer treats the frontend and backend as separate parts of the application. Instead, the server/client boundary exists within the component tree itself. Components run on the server by default and only move to the browser when marked with "use client".

Here is the part Next.js hides. A server component renders a client component by importing it and using it like any other component. There is no fetch call and no endpoint between them.

```tsx
import { getAllDeliveries } from "@/lib/services/deliveriesService";
import DeliveryFilter from "./DeliveryFilter";

export default async function DeliveriesPage() {
  const deliveries = await getAllDeliveries();

  return (
    <main>
      <h1>All Deliveries</h1>
      <DeliveryFilter deliveries={deliveries} />
    </main>
  );
}
```

`DeliveriesPage` runs on the server. It reads the deliveries directly, the same way pages did in the last session. `DeliveryFilter` is a client component, so it runs in the browser. Yet the page pulls it in with a normal `import` and passes data to it through a normal prop.

In a traditional setup, getting `deliveries` from the server to a browser component means an endpoint that returns the list and a fetch on the other side that asks for it. Here you write neither. Next.js renders the server component, reaches the client component, and leaves a marked spot in the HTML where the browser will take over. Alongside the HTML it sends the data the client component needs, including the `deliveries` prop, in a format React reads on the other side. The crossing still happens, but Next.js generates it. That is the sense in which the framework hides the divide: the server / client divide in your code looks like an import and a prop.

This is also why the boundary has a rule attached to it. Because the `deliveries` prop is sent across the network rather than handed over in memory, it has to be something that survives the trip. How this contrains which props are allowed to cross the boundary is covered in the next chapter.

## Resources

[Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

[How Server and Client Components work together](https://nextjs.org/docs/app/getting-started/server-and-client-components#examples)
