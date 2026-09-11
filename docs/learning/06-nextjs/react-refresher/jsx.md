# React Refresher - JSX

React components use JSX (or TSX for TypeScript) to define the UI. While it looks like HTML, JSX is actually a syntax extension for JavaScript. Before reaching the browser, a build tool compiles JSX tags into plain JavaScript function calls (like `React.createElement`). JSX exists purely for readability. Without it, building complex UIs would require writing deeply nested, unmanageable function calls. It keeps the code looking like the final layout, while letting the developer drop in regular JavaScript (or TypeScript) using curly braces `{}`. Let’s take a look at some common pitfalls where JSX differs from standard HTML.

## Embedding JavaScript

To evaluate JavaScript inside JSX, wrap it in curly braces `{}`. Anything between the braces is treated as a JavaScript expression, and its result is rendered directly into the markup.

```jsx
const customer = "Tombo";
const element = <p>Delivery for {customer}</p>;
```

You can pass variables, math operations (`{2 + 2}`), object properties (`{delivery.pickup}`), or function calls.

The key restriction is that curly braces only accept expressions (code that evaluates to a value). JavaScript statements like `if` or `for` loops will not work. For conditional logic inside JSX, use a ternary operator instead:

```jsx
<p>Priority: {isUrgent ? "Urgent" : "Standard"}</p>
```

## Attributes

Because JSX is JavaScript underneath, attributes use camelCase naming instead of standard HTML conventions. For example, since `class` is a reserved keyword in JavaScript, JSX uses `className`. Multi-word attributes follow camelCase (e.g., `onClick`, `htmlFor`).

Values are passed to attributes in two ways:

- Static strings go in quotes (`""`).
- JavaScript expressions go in curly braces (`{}`).

```jsx
<img className="avatar" src={kiki.photo} alt="Kiki" />
```

- `className="avatar"` and `alt="Kiki"` use quotes because they are fixed strings.
- `src={kiki.photo}` uses curly braces to dynamically read a property from a JavaScript object.

## Return JSX

Every JSX expression must return a single root element. Returning sibling tags side-by-side causes a syntax error because JSX compiles into a single JavaScript function call, which can only return one value.

To group multiple elements without adding unnecessary `<div>` nodes to the DOM, wrap them in a Fragment (`<>` and `</>`).

```jsx
return (
  <>
    <h2>Today's deliveries</h2>
    <p>Three packages ready for pickup</p>
  </>
);
```

Fragments satisfy JSX's single-element requirement while keeping the rendered HTML clean.

## Resources

[Writing markup with JSX](https://react.dev/learn/writing-markup-with-jsx)

[JavaScript in JSX with curly braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces)
