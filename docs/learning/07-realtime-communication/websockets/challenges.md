# Real-Time Communication - Challenges

## Real-time Chat

These challenges build one app in stages: a real-time chat where people join named rooms and talk to the others in the same room. Chat is a good exercise because every client sends and receives at the same time, and rooms make you deliver each message only to the people in the right room. Build the backend as a NestJS gateway on Socket.io, and the frontend in React. Each challenge adds one capability to the chat from the step before.

## Task 1: Connect and broadcast

Start with the plumbing: a connection that works and a message that reaches everyone.

- Set up a NestJS gateway that accepts Socket.io connections, and a React client that connects with `socket.io-client`. Create the client connection once and share it, so re-renders don't open new ones.
- Let a user send a message: the client emits it with the text, and the server sends it to every connected client.
- Render the messages as a list as they arrive.
- Clean up your socket listeners in the React effect's cleanup function, so a remounting component doesn't register them twice.

## Task 2: Rooms

Now scope messages to a room, so people in different rooms don't see each other's messages.

- Let a user join a room by emitting an event with the room name. The server puts that socket into the room. A user is in one room at a time for now.
- When a user sends a message, include the room and the text. The server delivers it only to that room with `server.to(room).emit(...)`.
- Render the message list for the current room, and make sure switching rooms shows the new room's messages, not a mix of both.

## Task 3: Presence

Show who is in the room.

- Track who is in each room on the server.
- When someone joins or leaves, tell the room, so every client can show an up-to-date list of who's there.

## Task 4: Typing indicators

Show when someone else is typing.

- When a user is typing, emit a `typing` event. The server relays it to the others in the room — `socket.broadcast` sends to everyone but the sender.
- Show the indicator in the UI while someone is typing, and remove it when they stop.

## Task 5: Disconnects & reconnection

Handle people leaving and coming back.

- Handle disconnects on the server with the `handleDisconnect` hook: update presence and tell the room the user left.
- Reflect the connection state in the UI, so the user can see when they're connected and when they're reconnecting.
- Re-join the user's room automatically after a reconnection, so they keep receiving messages.

## Bonus

- Keep the last 20 messages per room on the server, and send that history to a user when they join, so a new arrival sees recent context instead of an empty screen.
- Require a username when connecting, validated during the Socket.io handshake, and attach it to every message and presence event.
- Support private one-to-one messages by giving each pair of users their own room.
