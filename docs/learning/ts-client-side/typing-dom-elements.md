# TypeScript Client-Side - Typing DOM Elements

While TypeScript usually infers types accurately from your code and external libraries, browser APIs are a notable exception. For example, the expression `document.getElementById("username-input")` could result in an input, a div, a button, or anything else. For TypeScript, it is impossible to know which HTML element has that ID. The method is defined to return `HTMLElement | null`, which is the broadest accurate type TypeScript can safely give you.

The issue with `HTMLElement` is that it only includes properties common to all elements. It does not have `.value`, which belongs to inputs, or `.src`, which belongs to images. Trying to read `element.value` on an `HTMLElement` causes a compiler error, even if you can see in your HTML that the element is definitely an input.

## Type assertions

Type assertion lets you tell the compiler which specific type a value actually is. You use the `as` keyword after the value, followed by the type you want to assert. This is a compile-time instruction. TypeScript treats the value as that type from that point on. No runtime check happens, so if the assertion is wrong, the code will fail silently with no warning from the compiler.

A basic example: if a variable is typed as `unknown` but you know it holds a string, you can assert it as `string` to access string methods.

```typescript
let myValue: unknown = "Hello, TypeScript!";
let strLength: number = (myValue as string).length;
```

The parentheses around `myValue as string` ensure the assertion applies to the value before the property access. Without them, TypeScript would try to assert `.length` rather than `myValue`.

## DOM element types

Each HTML element type has a corresponding TypeScript interface e.g.:
- `HTMLInputElement`
- `HTMLButtonElement`
- `HTMLImageElement`

When selecting an element from the DOM, assert it to the interface that matches the actual element in your HTML. These interfaces extend the base `HTMLElement` with properties specific to that element kind:

```typescript
const inputElement = document.getElementById(
  "username-input",
) as HTMLInputElement;
```

TypeScript then treats `inputElement` as `HTMLInputElement`, which makes input-specific properties available like `.value`,`.disabled` and`.placeholder`.

Without the assertion, both lines produce compiler errors, because those properties do not exist on the base `HTMLElement` type.

## Element type reference

Here are common HTML element types and their key properties:

- `HTMLInputElement`: `.value`, `.disabled`, `.type`, `.placeholder`
- `HTMLButtonElement`: `.disabled`, `.textContent`, `.innerHTML`
- `HTMLImageElement`: `.src`, `.alt`, `.width`, `.height`
- `HTMLDivElement`: `.innerHTML`, `.textContent`, `.style`
- `HTMLSelectElement`: `.value`, `.selectedIndex`, `.options`
- `HTMLTextAreaElement`: `.value`, `.disabled`, `.placeholder`

## Resources

[TypeScript handbook: Type assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
