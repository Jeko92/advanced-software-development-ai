# Next.js Ecosystem - Zustand Middlewares

Once you have a functional baseline Zustand store, you will likely need to extend its capabilities. Whether you want to persist data across page reloads, simplify complex state mutations, or integrate with debugging tools, Zustand provides a powerful ecosystem of plugins to help. These plugins are called middlewares.

Middlewares wrap your Zustand store to intercept and augment its default behavior, adding functionality like saving state to the browser or connecting to debugging tools. However, implementing them requires a structural shift in how you define the store using TypeScript.

## The TypeScript Currying Syntax

TypeScript struggles to infer types when functions wrap other functions multiple times. When building a bare Zustand store, you pass your interface directly to `create`:

```typescript
// Standard syntax (breaks with middlewares)
const useCartStore = create<CartState>((set) => ({ ... }));
```

Adding a middleware changes the signature of the `set` function. If you use the standard syntax, TypeScript fails to resolve the combined types, resulting in complex error messages. Zustand solves this using currying—calling a function that returns another function.

You call create with your interface but no arguments, which returns a new store-creator function. You then call that second function with your middlewares and state logic.

```typescript
// Currying syntax (required for middlewares)
const useCartStore = create<CartState>()((set) => ({ ... }));
```

Notice the `()()`. The first set of parentheses locks in the types. The second set receives the actual store implementation.

By default, store data disappears on a page refresh. The `persist` middleware automatically saves the state to `localStorage` (or `sessionStorage`) and rehydrates it when the application loads.

You import `persist` and wrap your state creator function. It requires a configuration object with at least a `name` property, which becomes the key used in `localStorage`.

## Persist Middleware

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
    }),
    {
      name: "cart-storage", // Key used in localStorage
    },
  ),
);
```

## Immer Middleware

Zustand enforces immutable state updates. When updating an array or a deeply nested object, you must copy the existing state using the spread operator (`...state`) rather than modifying it directly. While this prevents unexpected side effects, writing deeply nested spread operators quickly becomes tedious and hard to read.

`immer` is a library that allows you to write code that looks like it is mutating state directly, while safely producing an immutable copy under the hood. Because `immer` is an independent library, we must install it.

```bash
npm install immer
# or: bun add immer
```

Zustand provides a first-class middleware for `immer`:

```typescript
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// ... CartState interface ...

export const useCartStore = create<CartState>()(
  immer((set) => ({
    items: [],
    addItem: (item) =>
      set((state) => {
        state.items.push(item);
      }),
  })),
);
```

Notice how in the `addItem` function above, we simply use `.push()` on the array. We no longer need to return a newly constructed object or use spread operators. When using `immer`, your `set` function no longer needs to return an object. You simply modify the draft `state` provided in the callback.

## Combining Middlewares

You can nest multiple middlewares to apply both to your store:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// ... CartState interface ...

export const useCartStore = create<CartState>()(
  immer(
    persist(
      (set) => ({
        items: [],
        addItem: (item) =>
          set((state) => {
            state.items.push(item);
          }),
      }),
      { name: "cart-storage" },
    ),
  ),
);
```

## Fixing the Hydration Mismatch

As discussed before, client components undergo a SSR rendering phase before they get hydrated in the frontend. If the two render stages produce different outputs, it results in a hydration error. This happens regularly when we persist our store with localStorage. The server receives the default state, the client has access to the persisted data, and the results don't match.

To circumvent this issue, we can use the following trick: we will skip the hydration in our persist layer which will return the default values as done on the server. Then, we will rehydrate the store manually once in a useEffect that is placed in a thin wrapper around our store.

```typescript
import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ... CartState interface ...

const cartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          state.items.push(item);
        }),
    }),
    {
      name: "store",
      skipHydration: true,
    },
  ),
);

let rehydrated = false;

export function useCartStore<T>(selector: (state: CartState) => T): T {
  useEffect(() => {
    if (!rehydrated) {
      rehydrated = true;
      cartStore.persist.rehydrate();
    }
  }, []);

  return cartStore(selector);
}
```

The exported `useCartStore` hook is what we actually use in the components. It receives the selector function and passes it to the store. It also calls the `useEffect` that triggers the rehydration. Because the `rehydrated` flag is shared across every `useCartStore` call, the rehydration runs only once.

## Resources

[Zustand Middlewares, Guide](https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript#middlewares)
[Persist Reference](https://zustand.docs.pmnd.rs/reference/middlewares/persist)
[Immer Reference](https://zustand.docs.pmnd.rs/reference/middlewares/immer)
