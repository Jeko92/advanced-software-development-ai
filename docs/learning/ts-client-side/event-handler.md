# TypeScript Client-Side - Event Handlers

Event listeners receive an event object when they fire. TypeScript types that object as the generic `Event` interface, or in some cases the even broader `EventTarget`. The generic type does not carry mouse-specific properties like `clientX`, keyboard-specific properties like `key`, or element-specific properties like `.value` on an input. Trying to access any of those without narrowing the type first causes a compiler error.

The fix is to annotate the event parameter with the correct, specific event interface. TypeScript includes built-in interfaces for every browser event type. Annotating a handler with `MouseEvent` gives the compiler the full property set for mouse events; `KeyboardEvent` does the same for keyboard events.

## Event types

You apply the event type annotation to the event parameter inside the listener callback.

```typescript
const button = document.getElementById("my-button") as HTMLButtonElement;

button.addEventListener("click", (event: MouseEvent) => {
  console.log(event.clientX);
});

document.addEventListener("keydown", (event: KeyboardEvent) => {
  console.log(event.key);
});
```

Common event interfaces:

- `MouseEvent` — clicks, mouse movement, drag events
- `KeyboardEvent` — keydown, keyup, keypress
- `InputEvent` — input element value changes
- `SubmitEvent` — form submission
- `FocusEvent` — focus and blur on elements

## Typed event targets

Inside a handler, `event.target` points to the element that triggered the event. TypeScript types it as `EventTarget`, which is the most general interface in the DOM hierarchy and has almost no element-specific properties.

When you need to access a property like `.value` on the element that fired the event, use type assertion to narrow `event.target` to the correct element type:

```typescript
const input = document.getElementById("user-input") as HTMLInputElement;

input.addEventListener("input", (event: Event) => {
  const inputElement = event.target as HTMLInputElement;
  console.log(inputElement.value);
});
```

The assertion on `event.target` tells the compiler to treat it as `HTMLInputElement`, making `.value` accessible. As with all type assertions, this is compile-time only. If the target is not actually an input, the error surfaces at runtime.

## The `this` context in handlers

In a regular function expression (not an arrow function), `this` inside an event listener refers to the element the listener is attached to. Arrow functions do not have their own `this` and are preferred when the surrounding scope matters, such as inside a class.

If you use a function expression and need TypeScript to recognize `this` as a specific element type, annotate it as the first parameter. TypeScript strips this annotation at compile time; it does not add a real parameter:

```typescript
const container = document.getElementById("container");

container.addEventListener("click", function (this: HTMLDivElement, event: MouseEvent) {
  console.log(this.offsetWidth);
});
```

This pattern is uncommon in modern code. Arrow functions handle most handler cases without needing explicit `this` annotations.

## Resources

[MDN: EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)

[MDN: Event reference](https://developer.mozilla.org/en-US/docs/Web/Events)
