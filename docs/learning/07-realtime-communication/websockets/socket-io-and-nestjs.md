# Real-Time Communication - Socket.io & NestJS

A raw WebSocket is just an open connection. As the previous section showed, everything a real application needs on top of that, you have to build yourself. Of course, there are already some proficient implementations in the wild. Socket.io is the library that handles a lot for you, and NestJS adds structure around it, so your real-time code is organised and testable like the rest of your backend instead of a loose collection of event handlers. The running example for the rest of this session is a live poll, where clients send votes, and the server pushes the updated tally to everyone watching.

## Native WebSockets vs. Socket.io

Socket.io is not just a thin wrapper around the browser's `WebSocket`. It is its own protocol that runs on top of WebSockets, which is why a Socket.io client must talk to a Socket.io server and cannot connect to a plain `ws://` endpoint. In return, it provides the things raw WebSockets don't:

- **Automatic reconnection.** When a connection drops, the client keeps trying to reconnect on its own, with sensible backoff.
- **Transport fallback.** If a network or proxy blocks WebSockets, Socket.io falls back to HTTP long polling and keeps working, then upgrades to a real WebSocket once it can.
- **Structured events with JSON.** You emit named events carrying plain objects, and Socket.io serialises and deserialises them for you. No manual `JSON.stringify` on every message.
- **Rooms and namespaces.** Built-in ways to group clients and split traffic into separate channels, so you can deliver a message to one group of users instead of everyone.

## NestJS Gateways

In NestJS, the equivalent of a controller for WebSocket traffic is a _gateway_. It is a normal provider class marked with a decorator, and by default it runs on Socket.io.

First, install the WebSocket packages on the backend:

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

The frontend needs `socket.io-client`. But first let's implement the gateway:

```ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { PollService } from "./poll.service";

@WebSocketGateway({ cors: { origin: "*" } })
export class PollGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly pollService: PollService) {}

  @SubscribeMessage("vote")
  handleVote(@MessageBody() option: string) {
    const results = this.pollService.addVote(option);
    this.server.emit("results", results);
  }
}
```

Each decorator has a specific job:

- `@WebSocketGateway()` marks the class as a gateway and accepts configuration such as a port, a namespace, or CORS settings.
- `@WebSocketServer()` injects the underlying Socket.io `Server` instance, which you use to push messages out.
- `@SubscribeMessage("vote")` registers the method as the handler for the `vote` event, the rough equivalent of a route handler for an HTTP endpoint.
- `@MessageBody()` pulls the data the client sent with the event into a parameter.

The `cors` option in the decorator needs a quick explanation. The browser treats the connection as a cross-origin request whenever the frontend is served from a different origin than the backend, which it almost always is during development: the dev server runs on one port, Nest on another. Without an allowed origin, the browser blocks the handshake before Socket.io runs. `origin: "*"` allows any origin, which is fine while developing; in production you would set it to your frontend's real URL.

Look at the constructor. A gateway is an ordinary NestJS provider, so dependency injection works exactly as it does everywhere else in the app. The gateway injects a `PollService` and leaves the actual tallying to it. That keeps the gateway focused on sending and receiving, while the business logic stays in a service you can test on its own.

Here's the minimal `PollService` it delegates to:

```ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class PollService {
  private tallies: Record<string, number> = {};

  addVote(option: string) {
    this.tallies[option] = (this.tallies[option] ?? 0) + 1;
    return this.tallies;
  }
}
```

Register both as providers in a module – `@Module({ providers: [PollGateway, PollService] })` – and import that module into your `AppModule`. That is enough to run; the rest is ordinary Nest setup.

## Events: Emit vs. On

Socket.io communication is publish/subscribe, and it works the same way on both ends. One side _emits_ a named event carrying some data, and the other side _listens_ for that name. Sending and receiving are the same two verbs no matter which end you are on.

On the server, `@SubscribeMessage("vote")` is the listen half, and `this.server.emit("results", ...)` is the send half. The client mirrors it exactly:

```ts
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.emit("vote", "pizza");

socket.on("results", (results: Record<string, number>) => {
  renderResults(results); // your function to update the UI
});
```

The client emits a `vote` event with the chosen option, which lands in the server's `handleVote`. The server emits a `results` event with the new tally, which lands in the client's `on("results", ...)` handler. Notice that `"pizza"` and the `results` object travel as real JavaScript values, not hand-built strings. Socket.io handles the serialisation in both directions.

## Broadcasting, Rooms & Namespaces

So far every `results` event goes to every connected client, because `this.server.emit(...)` sends to all of them. That's rarely what you want. You usually need to reach a specific subset of users, and Socket.io gives you three tools for it.

The first is broadcasting to everyone except the sender. If you have the individual client's socket, `socket.broadcast.emit(...)` sends to all clients except the one that triggered it. It's handy for "someone else just voted" notifications.

The second, and the most important, is rooms. A room is a named group of sockets that you reach as a unit. A client does not join a room directly; it asks the server, and the server puts the socket into the room. Once joined, `this.server.to(roomId).emit(...)` delivers only to the sockets in that room. That's how one server runs many independent polls at once: each poll is a room, and a vote in one room never reaches another.

```ts
import { ConnectedSocket, MessageBody, SubscribeMessage } from "@nestjs/websockets";
import { Socket } from "socket.io";

@SubscribeMessage("joinPoll")
handleJoin(@MessageBody() pollId: string, @ConnectedSocket() socket: Socket) {
  socket.join(pollId);
}

@SubscribeMessage("vote")
handleVote(@MessageBody() data: { pollId: string; option: string }) {
  const results = this.pollService.addVote(data.pollId, data.option);
  this.server.to(data.pollId).emit("results", results);
}
```

`socket.join(pollId)` needs the client's own socket, which the `@ConnectedSocket()` decorator provides. Because there are several polls now, `addVote` takes the `pollId` as well and keeps a separate tally for each one. After joining, every vote scoped to that `pollId` is emitted only to its room, so clients watching a different poll hear nothing.

The third tool is namespaces, which split traffic at a higher level than rooms. A namespace is a separate, predefined endpoint such as `/chat` or `/admin`, each with its own connection handling and its own set of rooms. Rooms are dynamic groupings created and joined at runtime; namespaces are coarse, fixed divisions of the application. Most features use rooms; namespaces are only worth it when you have genuinely separate areas that shouldn't share a connection.

> **_✏️ Note:_** Rooms live entirely on the server. The client has no `join` method and no list of rooms it belongs to. It emits an event like `joinPoll`, and the server decides whether and how to place that socket into a room. Keep room membership a server-side decision so a client can't put itself into a room it shouldn't be in.

## Resources

- [Socket.io documentation](https://socket.io/docs/v4/)
- [Socket.io: Rooms](https://socket.io/docs/v4/rooms/)
- [NestJS: Gateways](https://docs.nestjs.com/websockets/gateways)
