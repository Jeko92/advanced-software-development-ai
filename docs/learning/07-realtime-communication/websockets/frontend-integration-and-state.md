# Real-Time Communication - Frontend Integration & State

A socket is a single connection that should stay open for a long time. A React component is the opposite: it re-renders constantly and gets mounted and unmounted as the user moves around the app. If you put the socket directly in the component, you open a new connection on every render, or you register the same event handler several times so one event runs your code more than once. Let's discuss how to avoid that.

## The Socket.io client in React

The first decision is where the socket lives. If you call `io(...)` inside the component body, you open a new connection on every render, which is almost never what you want. The connection should be created once and shared. The simplest way is to create it once at module scope, so every render of the component reuses the same socket.

```tsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { autoConnect: false });

export function Poll({ pollId }: { pollId: string }) {
  const [results, setResults] = useState<Record<string, number>>({});

  useEffect(() => {
    socket.connect();
    socket.emit("joinPoll", pollId);

    const onResults = (data: Record<string, number>) => setResults(data);
    socket.on("results", onResults);

    return () => {
      socket.off("results", onResults);
      socket.disconnect();
    };
  }, [pollId]);

  const vote = (option: string) => socket.emit("vote", { pollId, option });

  return (
    <div>
      <button onClick={() => vote("pizza")}>Pizza</button>
      <button onClick={() => vote("pasta")}>Pasta</button>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
```

The socket is created once, outside the component, so re-renders never create a second one. Passing `autoConnect: false` stops it from connecting as soon as the module loads. Instead the effect opens the connection, so it's tied to when the component is on screen. Inside the effect, the socket connects, joins the poll's room, and starts listening for `results`; each update goes into state, so React re-renders with the new tally. Sending a `vote` is just an event on the same shared socket.

In a larger app you wouldn't repeat this setup in every component. One option would be to move the socket into a small Zustand store, much as we did earlier in this course with shared states.

## useEffect and memory leaks

The cleanup function in that effect isn't optional. Every call to `socket.on("results", ...)` adds another handler; it doesn't replace the previous one. If the component mounts, unmounts, and mounts again, or the effect re-runs because `pollId` changed, you register a second `results` listener while the first one is still there. Now a single incoming event runs your handler twice, then three times, and the state updates multiply. The connection itself may be fine, but the listeners are leaking.

The fix is to remove exactly what you added. That's why the handler is stored in a named `const onResults` instead of an inline arrow function: `socket.off("results", onResults)` can only remove the listener if you give it the same function reference you registered. An inline arrow passed to both `on` and `off` would be two different functions, so the `off` would remove nothing.

> **_❗ Watch out:_** In development, React Strict Mode mounts every component, runs its effects, then immediately unmounts and remounts it, on purpose, to surface exactly this kind of bug. Without proper cleanup you'll see doubled connections and events that fire twice, but only in development. Don't "fix" it by turning off Strict Mode. The doubling is a sign your cleanup is incomplete.

## Handling reconnection

Connections drop, and often for ordinary reasons, like a laptop going to sleep. Socket.io handles the reconnecting itself, retrying with backoff until it gets through, but it can't decide what your interface should show while that happens. That part is up to you, and it starts with tracking the connection status in state.

```tsx
const [connected, setConnected] = useState(socket.connected);

useEffect(() => {
  const onConnect = () => {
    setConnected(true);
    socket.emit("joinPoll", pollId); // re-join the room on every (re)connection
  };
  const onDisconnect = () => setConnected(false);

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);

  return () => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
  };
}, [pollId]);
```

The `connect` and `disconnect` events flip a boolean you can render as a "Live" or "Reconnecting..." badge, so the user understands why updates have paused. On reconnect, `onConnect` re-emits `joinPoll`. Rooms live on the server, so a reconnected socket starts out in no room at all. If `joinPoll` only ran once at startup, the client would silently stop getting room updates after the first drop. Re-joining inside `onConnect` runs it on every connection, so the client gets its room back each time. The same idea applies to any state the client needs after being offline: on reconnect, ask the server for the current tally, so the UI catches up on whatever it missed.

## A Zustand store for the socket

The per-component pattern above works, but in a real app several components care about the same connection and the same results. This course has already used Zustand for shared state, and a socket fits that model: keep the socket and its state in a store, and let components read what they need and call actions to send.

```ts
import { create } from "zustand";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { autoConnect: false });

type PollState = {
  results: Record<string, number>;
  connected: boolean;
  pollId: string | null;
  joinPoll: (pollId: string) => void;
  vote: (option: string) => void;
};

export const usePollStore = create<PollState>()((set, get) => {
  // Registered once, because the store is created once.
  socket.on("connect", () => {
    set({ connected: true });
    const { pollId } = get();
    if (pollId) socket.emit("joinPoll", pollId); // re-join on every (re)connection
  });
  socket.on("disconnect", () => set({ connected: false }));
  socket.on("results", (results: Record<string, number>) => set({ results }));

  return {
    results: {},
    connected: false,
    pollId: null,

    joinPoll: (pollId) => {
      set({ pollId });
      if (socket.connected) {
        socket.emit("joinPoll", pollId);
      } else {
        socket.connect();
      }
    },

    vote: (option) => socket.emit("vote", { pollId: get().pollId, option }),
  };
});
```

The listeners are registered once, because the store is created once, so there's no per-component `on`/`off` and nothing to leak when a component re-mounts. The `connect` handler re-joins the room on every connection — the same reconnection fix from the previous section, now in one place. Components read individual slices of the store and re-render only when those slices change:

```tsx
import { useEffect } from "react";
import { usePollStore } from "./pollStore";

export function Poll({ pollId }: { pollId: string }) {
  const results = usePollStore((s) => s.results);
  const connected = usePollStore((s) => s.connected);
  const joinPoll = usePollStore((s) => s.joinPoll);
  const vote = usePollStore((s) => s.vote);

  useEffect(() => {
    joinPoll(pollId);
  }, [pollId, joinPoll]);

  return (
    <div>
      <span>{connected ? "Live" : "Reconnecting..."}</span>
      <button onClick={() => vote("pizza")}>Pizza</button>
      <button onClick={() => vote("pasta")}>Pasta</button>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
```

`joinPoll` still runs in an effect keyed on `pollId`, but now it talks to the store instead of the socket directly. Because the socket lives for the life of the app, there's no `disconnect` on unmount; the store keeps the one connection, and every component shares it.

## Resources

- [Socket.io: Client API](https://socket.io/docs/v4/client-api/)
- [Socket.io: Client with React](https://socket.io/how-to/use-with-react)
- [React: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [Zustand documentation](https://github.com/pmndrs/zustand)
