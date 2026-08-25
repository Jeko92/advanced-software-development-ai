# NestJS RESTful Design - Intro

## Learning Objectives

- Design resource-oriented URLs that follow REST conventions for collections, items, and sub-resources.
- Choose the correct HTTP method for each operation based on its safety and idempotency.
- Return appropriate status codes for success and error outcomes, including validation failures.
- Separate the public API contract from the database schema using request and response DTOs.
- Configure NestJS pipes to validate and transform incoming requests before they reach a controller.
- Implement paginated list endpoints that work past the first thousand records.

## Overview

REST is the boring default of web APIs, and that is exactly why it won. When Roy Fielding wrote his 2000 doctoral dissertation, the internet was already running on HTTP. His insight was simple. Rather than invent a new protocol on top of HTTP, design APIs that use HTTP the way it was meant to be used. Caches, status codes, verbs, headers: all of it was already there. Most early web APIs ignored that infrastructure and bolted something custom on top. REST asked the opposite question. What if the API just spoke HTTP?

An RPC-style API treats the URL as a function name (`/createConcert`, `/getConcertById?id=42`, `/deleteConcert`). A REST API treats the URL as an address for a thing. `/concerts` is the collection, `/concerts/42` is one specific concert, and the HTTP method tells the server what to do with that thing. The same handful of methods cover every operation on every resource the API will ever expose. You stop inventing new endpoints for every new action and start thinking in nouns.

Two decades on, REST is no longer the only option. GraphQL solved a different problem: clients that need to assemble data from many resources without ten round-trips. gRPC dominates internal service-to-service traffic where the contract is tight and binary efficiency matters. For the typical web backend exposing data to a browser, a mobile app, or a third party, REST remains the path of least surprise.

This session is split in two. The first half covers REST itself: what counts as a resource, how URLs identify them, how HTTP methods act on them, and which status codes the server should return. The second half walks through NestJS, where controllers, DTOs, pipes, and query parameters turn those rules into running code.

> **_:bulb: Good to know:_** Fielding wrote his dissertation while working on the HTTP/1.1 specification. REST was not so much invented as it was the description of how the web's most successful systems were already structured. The label came after the practice.

## Resources

[Roy Fielding, Architectural Styles and the Design of Network-based Software Architectures](https://ics.uci.edu/~fielding/pubs/dissertation/top.htm)
