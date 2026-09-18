# Real-Time Communication - WebSockets Intro

## Learning Objectives

- Explain why request/response HTTP cannot support a free-flowing, two-way conversation between client and server.
- Describe the WebSocket handshake and what full-duplex communication means.
- Weigh the costs and benefits of WebSockets against ordinary HTTP.
- Explain why production systems reach for Socket.io instead of the raw `ws` module.
- Build a real-time backend with NestJS gateways using `@WebSocketGateway` and `@SubscribeMessage`.
- Use the emit/on event model, and isolate users with broadcasting, rooms, and namespaces.
- Integrate a Socket.io client into React without leaking connections or duplicating listeners.
- Reason about authoritative state, race conditions, disconnects, and the problem of scaling beyond one server.

## Overview

Up to now you've been making HTTP do things it wasn't designed for. Short polling, long polling, and Server-Sent Events are all ways to push updates to the browser over a protocol that wasn't built for it. They work, and plenty of production systems still run on them. But none of them gives you a true two-way connection.

With polling, the client keeps asking the server whether anything has changed, and most of the time the answer is no, so most of those requests are wasted. SSE is better: the server can send data at any time, without the client asking for it. But it only works in one direction. The browser receives on that stream and can't send anything back over it. For a notification feed or a live price, one direction is all you need, and SSE is a good fit. A chat is a different problem. Both people send messages, often at the same time, and both need to see the other's messages right away. Neither polling nor a one-way stream handles that well. This module is about a connection where both sides can send at the same time.

## A Short History of Workarounds

These techniques have a name, and a longer history than you might expect. In 2006, Alex Russell grouped them all under one name: Comet. That included the polling techniques you already know, plus stranger ones, like keeping a hidden iframe loading forever so the server could send it script tags one at a time. The name was a joke: Ajax and Comet are both American cleaning-product brands. It caught on because there was finally a single word for getting the server to push data over plain HTTP.

People had been trying to do this long before 2006. Netscape Navigator 2.0 had a "server push" feature in 1996 that held a connection open and sent the browser data in pieces. It usually lasted about thirty seconds before a proxy or firewall dropped the connection.

## The WebSocket

WebSockets solved this with a protocol designed for two-way communication, instead of another workaround on top of HTTP. It first appeared in the HTML5 draft in 2008 under the placeholder name "TCPConnection," then moved to the IETF, and was standardized as RFC 6455 in December 2011. Chrome added support first, the other browsers followed within a year or two, and the old workarounds were no longer needed.

A WebSocket gives each client a single connection that stays open and carries data both ways. The server can send as soon as something happens, and the client can send back over the same connection, without opening a new HTTP request each time. This chapter covers how that connection is set up and what it costs to keep open.

This is the technology behind the features that update in real time. When a shared document shows you another person's cursor moving, or a chat message appears the instant it's sent, there's a connection like this behind it. In all of them, either side can send at any time, without waiting for the other.

The rest of the module follows in order. It starts with the handshake at the protocol level, then looks at why almost nobody uses raw WebSockets in production, and what Socket.io and NestJS add on top. The last topics get into the problems that show up once real users connect: how a React client stays connected through reconnects, who is allowed to do what, how shared state stays consistent, and what changes when one server isn't enough.

## Resources

[The Road to WebSockets: From HTTP Polling to RFC 6455](https://websocket.org/guides/road-to-websockets/)
[MDN: The WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
