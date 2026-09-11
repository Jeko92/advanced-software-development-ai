# Next.js Ecosystem - State Management with Zustand

A typical React application will eventually face an annoying issue known as "prop drilling." This happens when you find yourself passing data down through endless layers of components that don't even need it, just to reach a specific component at the very bottom of the tree. Next.js is fantastic for building the interface itself, but it leaves you on your own when it comes to cleanly sharing that data globally.

A React developer would reach out for `useContext`, which works well for sharing global configurations like themes or language settings, but it falls short when managing dynamic, rapidly changing application state. Because context triggers a re-render on every consumer component whenever its value changes, an update to a single property forces unrelated components to re-execute. If a single context houses both user authentication data and a shopping cart array, your page header will re-render every time an item is added to the cart, even though it only reads the username.

The traditional workaround involves splitting state into multiple, isolated contexts. While this mitigates unnecessary re-renders, it introduces provider nesting hell. Your root component quickly becomes buried under a tower of providers, making the architecture brittle and difficult to maintain.

Zustand eliminates the need for context providers entirely. Components connect directly to a store via a hook and request a specific slice of state using a selector. Zustand monitors this selected slice and only triggers a re-render if the requested data changes.

## Creating a Store

To build a store, define the structural shape of your state and actions using a TypeScript interface. Pass this interface to the `create` function to ensure strict type safety across your application.

```typescript
// store/useCartStore.ts
import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const useCartStore = create<CartState>((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ items: [] }),
}));

export default useCartStore;
```

The `CartState` interface explicitly types the structure, preventing type mismatches during development. Within the `create` callback, `items` initializes as an empty array. The `addItem` action updates this state by passing a function to `set`, capturing the current state, and returning an expanded array via the spread operator. To maintain immutability, `removeItem` uses `filter` to generate a new array rather than modifying the existing one in place. Because `set` merges changes instead of replacing the top-level object, unrelated store properties remain untouched.

The store is created once and exported as a hook. Any component can import it directly.

## Subscribing to Zustand Stores

Components subscribe to the store by invoking the hook and providing a selector function that picks the slice of state the component needs.

```jsx
// components/CartSummary.tsx
"use client";

import useCartStore from "../store/useCartStore";

export default function CartSummary() {
  const items = useCartStore((state) => state.items);

  return (
    <div className="p-4 border rounded">
      <h2>Your Cart</h2>
      {items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity} - ${item.price * item.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

Because `CartSummary` specifically selects `state.items`, it remains completely unaffected if other state properties change. If the store expands later to track user preferences or UI toggle states, this component will not re-render when those values change.

## Zustand in the Next.js App Router (SSR)

Zustand stores function as global variables within the module scope. While this model works in client-side React SPAs, it introduces architectural risks within the Next.js App Router during Server-Side Rendering (SSR).

The Node.js server processes requests from multiple distinct users concurrently. A global variable on the server persists across these requests. If User A adds an item to the store, User B will encounter that same item during their subsequent request. This vulnerability is called cross-request state pollution.

Treating the store as client-only avoids that issue, but it introduces a different problem as soon as the data is persisted. Since a persisted store pulls its initial state from `localStorage`, the server obviously can't access it. The server renders an empty default, the client instantly loads the saved data, and Next.js throws a hydration mismatch error because the two don't line up. The simplest workaround is just to hold off on rendering the data until the component actually mounts in the browser.

```typescript
// components/CartSummarySafe.tsx
'use client';

import { useState, useEffect } from 'react';
import useCartStore from '../store/useCartStore';

export default function CartSummarySafe() {
  const [hasMounted, setHasMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name} – ${item.price}</li>
      ))}
    </ul>
  );
}
```

This removes the warning, but it puts the fix in the wrong place. Every component reading from the store now needs its own `hasMounted` flag and an early `return null`. You end up repeating the same boilerplate everywhere. After we've covered the middleware, we'll improve this setting.

## Resources

- [Zustand documentation](https://zustand.docs.pmnd.rs/learn/getting-started/introduction)
- [Zustand on GitHub](https://github.com/pmndrs/zustand)
- [Zustand comparison with other libraries](https://zustand.docs.pmnd.rs/learn/getting-started/comparison)
