# Real-Time Communication - Challenges

## Task 1: Delivery Service

A warm-up exercise: see how much redundant work polling causes before replacing it with a better approach.

Setup:

- Create a backend endpoint that tracks one order's status. The order moves through distinct stages (e.g. Preparing, Out for Delivery, Delivered) driven by server-side timers.
- Build a client that displays the current status of that order.

1. Implement the tracking with short polling. Watch the browser's network tab and compare how many requests you send against how many actually report a change. Make sure the client stops polling once the order reaches its final stage.
2. Refactor client and server to long polling. The client should receive an HTTP response only when the status actually advances. Compare the network traffic against your short-polling version.

## Task 2: World Cup Live Match Ticker

The main challenge. Build a one-way feed of updates from the server to the browser, like the live commentary and score changes on a sports site during a 2026 World Cup match.

Core build:

1. Create an endpoint that streams events instead of returning a single JSON response. This is the Server-Sent Events pattern: the `text/event-stream` content type and a response you keep writing to instead of ending.
2. On the server, generate match events at irregular intervals (a goal, a yellow card, a substitution, a VAR review) and push each one down the stream as it happens. Randomising the delay between events makes the feed feel live.
3. Build a client that connects to the stream with `EventSource` and renders each new event at the top of a running commentary list.
4. Implement resource cleanup. When the client disconnects (closed tab, navigation, lost network), the server must detect it through the request's `close` event and release anything it set up for that connection, such as timers and listeners. The match events come from one shared source for all viewers, so a single client leaving should remove only that client's listener, never stop the feed for everyone. On the client, close the stream with `source.close()` when the component unmounts.
5. Show the connection state in the UI as Live, Reconnecting, or Offline. `EventSource` reconnects on its own, but you have to observe it to display the state: `onopen` fires when the stream is (re)established, `onerror` fires when it drops and the browser starts retrying, and `source.readyState` is `CONNECTING`, `OPEN`, or `CLOSED`. Map `OPEN` to Live, the retry phase to Reconnecting, and a stream you have given up on to Offline.
6. Test the reconnect behaviour. With the client listening, stop your server process to simulate a stadium network failure, watch the UI switch to Reconnecting, then restart the server and confirm the client re-establishes the stream and returns to Live on its own.

## Bonus

- Send a type with each event (an `event:` line) and route the kinds into separate UI panels: critical `score-update` events in one, general `match-commentary` and `stadium-stats` in another. On the client these arrive through `source.addEventListener("score-update", ...)` rather than the generic `onmessage`, all over the one stream.
- Implement state recovery. Give each event an `id`. When the client reconnects, the browser sends the last id it processed in the `Last-Event-ID` header; read it on the server (`req.headers["last-event-id"]`), replay the events the client missed during the outage, then resume the live feed. This needs the server to keep a short history of recent events.
