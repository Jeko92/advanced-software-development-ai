# Real-Time Communication - Advanced Topics

A two-way connection and rooms get messages to the right clients. They don't help once many of those clients read and change the same state at the same time. A demo with two browser tabs never reveals it. The failures appear only under real conditions: users joining and leaving at random, two actions landing in the same instant, and more load than one server can hold.

## Authoritative Server

In any shared real-time system, the server is the single source of truth. Clients should send *intents*, descriptions of what they want to do, and the server decides what happens. A client should never be trusted to report the result.

The poll makes this concrete. A client emits `vote` for an option; it does not emit a finished tally. If a client were allowed to announce "the score is now 500 to 3," nothing would stop a malicious user from sending whatever numbers they liked. Because the count lives on the server and it only accepts "I vote for this option," the server can check each change before applying it — rejecting a vote for an option that doesn't exist, or a second vote from someone who has already voted. A vote that arrives after the poll has closed is dropped the same way.

This is also where authentication belongs. Because every intent is acted on by the server, the server needs to know who sent it. Socket.io lets you check credentials during the connection handshake (for example, a token passed when the client connects) and reject the connection before any events flow. Validating the connection once, up front, means every later intent arrives already tied to a known user.

## State Synchronisation

If the server owns the truth, it has to keep every client's view of that truth current. The server holds the canonical state for a room in memory, the poll's tallies and who is connected, and pushes it out so every client in the room ends up with the same state.

There are two ways to send it. The simplest is a full snapshot: every time something changes, broadcast the entire current state. It is easy to reason about, because a client just replaces what it has. The cost is size, since you resend everything even when one number changed. The alternative is incremental updates, or deltas: send only what changed, such as "pizza plus one." Deltas are far lighter, but they assume the client received every previous update in order. Miss one and the client's state is out of sync from then on, with nothing to signal it.

A practical system often uses both. Send deltas during normal operation for efficiency, and send a full snapshot whenever a client joins or reconnects, so a client that just arrived or recovered from a gap is fully up to date before the next delta arrives.

## Race Conditions & Disconnects

A real-time server handles messages from many clients arriving interleaved, and that concurrency creates bugs you never see with a single user. Two clients vote at the same instant, or a vote arrives for a poll that closed a moment earlier. Handlers are shared code working on shared state, so if one handler reads a value, does some async work, then writes the result back, another update can slip in during the async gap, and one of the two changes is lost. The defence is to keep changes to shared state small and immediate, and to avoid async work in the middle of a read-modify-write that other clients are also performing.

Disconnects are the other constant. Clients vanish without notice when a tab closes or a network drops, and the server has to cope cleanly. NestJS gateways expose a `handleDisconnect` lifecycle hook for exactly this. Socket.io automatically removes a disconnected socket from its rooms, but anything else you tracked for that client is your responsibility: presence lists, "currently typing" flags, or any in-flight operation it left half-finished. The awkward case is a client that disappears mid-action, where you have to decide in advance what its absence means for the shared state it was touching.

## The Scaling Problem & Redis Pub/Sub

Everything so far assumes one server process holding all the connections and all the state in its own memory. That assumption holds only for a single process. Under real load you'll run several instances behind a load balancer, and then it no longer holds.

Two problems appear together. The first is connection affinity. A WebSocket connection and its state live on the specific instance that accepted it, so every message from that client has to keep reaching the same instance. Load balancers solve this with sticky sessions, which pin a client to one instance for the life of its connection. This matters even during the initial Socket.io handshake, where the connection may briefly use HTTP long polling before upgrading.

The second problem is cross-instance delivery. Imagine a poll room with some members connected to instance A and others to instance B. A vote arrives on instance A, which calls `io.to(room).emit(...)`, but that only reaches the clients connected to A. Instance B never hears about it, so its clients see nothing. The fix is the Socket.io Redis adapter. It publishes every emit to a Redis Pub/Sub channel that all instances subscribe to. When instance A emits to a room, instance B receives it through Redis and forwards it to its own local clients in that room. Redis becomes the shared message bus that makes many instances behave as one.

## Resources

- [Socket.io: Adapters and scaling](https://socket.io/docs/v4/adapter/)
- [Socket.io: Redis adapter](https://socket.io/docs/v4/redis-adapter/)
- [NestJS: Gateway lifecycle hooks](https://docs.nestjs.com/websockets/gateways#lifecycle-hooks)
