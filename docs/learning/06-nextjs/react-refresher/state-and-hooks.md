# React Refresher - State and Hooks

While props are immutable, UIs frequently need to track data that changes over time, like input values, active selections, or task statuses.

Standard JavaScript variables fail here for two reasons:

- They reset to their initial values every time the component re-runs.
- Modifying them does not trigger a UI update.

React uses state to solve this. State persists across renders, and updating it signals React to re-render the component with the new data.

You add state to a component using `useState`, which is a type of hook. Hooks are special functions that let your components tap into core React features. Next, we will focus on implementing `useState`.

## React Hooks

Hooks are functions prefixed with `use` (such as `useState`) that let functional components tap into React features.
Hooks must follow two strict rules:

- Call hooks only at the top level: Never place hooks inside loops, conditions, or nested functions. React relies on the call order remaining identical across every render to track state correctly.
- Call hooks only from React functions: Only invoke hooks inside React components or custom hooks, never within regular JavaScript functions.

## `useState`

The `useState` hook adds a single piece of state to a component. It accepts an initial value and returns an array containing two elements: the current state value and an updater function. Use array destructuring to capture both.

```jsx
import { useState } from "react";

function DeliveryCard({ item }) {
  const [delivered, setDelivered] = useState(false);

  return (
    <article>
      <h3>{item}</h3>
      <p>{delivered ? "Delivered" : "On the way"}</p>
      <button onClick={() => setDelivered(true)}>Mark as delivered</button>
    </article>
  );
}
```

How this works:

- `useState(false)` sets the initial state value to `false`.
- `delivered` holds the current state value for the current render.
- `setDelivered` is the updater function used to change the state.
- `onClick={() => setDelivered(true)}` triggers the updater function when the button is clicked.
- The ternary operator dynamically renders the status text based on the value of `delivered`.

The component still receives `item` as an external prop, but it now manages its own internal `delivered` state in response to user interaction.

## Updating the State

Calling the setter function instead of directly reassigning the variable (`delivered = true`) is what triggers a re-render. The setter alerts React to the change, prompting it to re-run the component function. On this next execution, `useState` returns the updated value and the UI refreshes. Direct reassignment leaves the display frozen because React remains unaware of the change.

When your new state depends on the previous state, pass a function to the updater instead of a raw value. React calls this function with the most current state.

```jsx
const [count, setCount] = useState(0);
// ...
<button onClick={() => setCount((current) => current + 1)}>
  {count} packages
</button>;
```

Using `setCount((current) => current + 1)` guarantees you are reading the absolute latest state value, which is the safest way to handle incremental updates.

## State is private to its component

State is strictly private to the specific component instance that creates it.

If `App` renders two `<DeliveryCard />` components, each tracks its own independent delivered value. Marking the first card as `delivered` has no effect on the second.

This isolation allows you to safely reuse components across a page without their data interfering with each other.

## Resources

[State: a component's memory](https://react.dev/learn/state-a-components-memory)

[Responding to events](https://react.dev/learn/responding-to-events)
