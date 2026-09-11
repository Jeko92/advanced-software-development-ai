# React Refresher - Props

The current `DeliveryCard` always displays the same hard-coded text. To make it reusable for any delivery, it needs to accept dynamic data using props.

Props (short for properties) are values passed from a parent component to a child component, similar to function arguments or HTML attributes. They are the primary mechanism for moving data in React, always flowing in a single direction from parent to child.

Next, we will look at how to pass props, use the common destructuring shorthand, and understand why props must remain immutable to the component receiving them.

## Passing and Reading Props

Pass props by adding attributes to the component's JSX tag. The child component receives these attributes packaged into a single object, conventionally named `props`.

```jsx
function DeliveryCard(props) {
  return (
    <article>
      <h3>{props.item}</h3>
      <p>
        {props.from} to {props.to}
      </p>
    </article>
  );
}

function App() {
  return <DeliveryCard item="Bread" from="Bakery" to="Clock tower" />;
}
```

Here, `App` passes `item`, `from`, and `to` to `<DeliveryCard>`. React collects these into the `props` object, letting the child component access them via `props.item`, `props.from`, and `props.to`. Reusing the same component with different attribute values dynamically updates the output.

## Destructuring Props

Repeating `props.` can make your code noisy. Since `props` is a plain JavaScript object, you can destructure it directly in the function parameter list to use the variables cleanly.

```jsx
function DeliveryCard({ item, from, to }) {
  return (
    <article>
      <h3>{item}</h3>
      <p>
        {from} to {to}
      </p>
    </article>
  );
}
```

This functions exactly like the previous version but improves readability. This destructuring pattern is the standard convention in most React codebases.

Props accept any JavaScript data type. The syntax rules match standard JSX: strings use quotes, while other types use curly braces.

```jsx
<DeliveryCard item="Bread" distance={3} urgent={true} />
```

- `item="Bread"` uses quotes for literal strings.
- `distance={3}` uses curly braces for numbers.
- `urgent={true}` uses curly braces for booleans.

## Props are Read-only

rops are strictly read-only. A component must never modify the props it receives. For example, inside `DeliveryCard` you can read `item`, but reassigning it will not update the UI.

This enforces React's one-way data flow: the parent owns the data, and the child simply renders it.

If a component needs to track data that changes over time (such as marking a delivery as completed), that data cannot live in props. Instead, it requires state, which we will cover next.

## Resources

[Passing props to a component](https://react.dev/learn/passing-props-to-a-component)
