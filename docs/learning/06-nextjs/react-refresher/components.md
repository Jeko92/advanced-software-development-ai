# React Refresher - Components

To follow the DRY (Don't Repeat Yourself) principle, avoid duplicating JSX. Instead, define a piece of UI once as a reusable JavaScript function that returns JSX. These are called components.

React apps are structured as a component tree. A single root component renders child components, which nest down to granular pieces like a single button or card. Writing React is largely about "thinking in components": breaking a layout into isolated, named functions and assembling them.

Next, we'll cover how to define components, render them, and dynamically render lists from data arrays.

## Defining a Component

A React component is a JavaScript function that returns JSX. Its name must start with a capital letter, which is how React distinguishes custom components from native HTML tags. For example, `<article>` renders a standard HTML element, while `<DeliveryCard>` renders your custom component.

```jsx
function DeliveryCard() {
  return (
    <article>
      <h3>Bread delivery</h3>
      <p>From the bakery to the clock tower</p>
    </article>
  );
}
```

At this stage, `DeliveryCard` is just a standard function that returns an element structure. Defining a component does not automatically render it to the screen: it simply registers the component for use.

## Rendering a Component

To render a component, use it as a JSX tag just like an HTML tag. If the component has no children, use a self-closing tag.

```jsx
function App() {
  return (
    <main>
      <DeliveryCard />
      <DeliveryCard />
    </main>
  );
}
```

Here, App renders two `<DeliveryCard />` instances inside a `<main>` element. Each tag executes the `DeliveryCard` function and injects its JSX into the page.

This highlights the primary advantage of components: you define the markup once and reuse it by name. Right now, both cards are identical because the component cannot accept unique data yet. We will address this using props in the next section.

## Rendering a List

Instead of hardcoding components individually, use the JavaScript `map()` method to generate a JSX element for each item in an array. You then embed the resulting array directly into your markup using curly braces.

```jsx
const deliveries = [
  { id: 1, item: "Bread" },
  { id: 2, item: "Herring pie" },
];

function DeliveryList() {
  return (
    <ul>
      {deliveries.map((delivery) => (
        <li key={delivery.id}>{delivery.item}</li>
      ))}
    </ul>
  );
}
```

Three elements make this work:

- `deliveries.map()` loops through the data to return an `<li>` for each item.
- Curly braces embed the generated array of elements inside the `<ul>`.
- `key={delivery.id}` provides a unique identifier for each item.

React requires the `key` prop to track items across renders. If the list changes, React uses these keys to target and update only the modified or moved elements instead of rebuilding the entire list. Always use a stable ID from your data source rather than the array index.

## Resources

[Your first component](https://react.dev/learn/your-first-component)

[Rendering lists](https://react.dev/learn/rendering-lists)
