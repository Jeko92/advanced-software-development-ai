# Recap Project 3 - Challenges

This is the recap project for the NestJS module. You build the DarkBay auction API described in the introduction: a NestJS application where users post auctions, bid on them with offers, and where a bid is only accepted if it beats the current highest price. Authentication acts as the final layer, added on top of a working core.

## 1 Project Setup and Database Integration

Your first objective is establishing the foundation of a running NestJS application connected to a local SQLite database.

> - [ ] Initialize a new NestJS workspace and structure your feature modules.
> - [ ] Wire up the database using TypeORM.
> - [ ] Architectural thought: During early development, how do you configure your database connection so that tables are automatically generated from your entities on startup, avoiding manual schema changes?

> :research: _Resource:_ [NestJS Database Integration](https://docs.nestjs.com/techniques/database)

## 2 The Auction Module

Create the core resource of the API. Sellers need a way to create an auction, list all available auctions, and fetch specific listings.

> - [ ] Model the `Auction` entity. Define the necessary properties to track the item's details (title, description), pricing (starting price, current price), lifecycle (end date), and the seller's identity.
> - [ ] Design the endpoints to handle creation and retrieval.
> - [ ] **Design question:** Look at your request payload. Which fields must the client provide, and which should the server generate independently?
> - [ ] **Business rule:** If a client omits an end date during creation, how do you enforce a default duration of three days within your service logic?

> :research: _Resource:_ [NestJS TypeORM Entities](https://docs.nestjs.com/techniques/database#repository-pattern)

## 3 The Offer Module and Bidding Logic

This module handles the core mechanic of DarkBay. Users submit offers, and the system evaluates them against strict rules.

> - [ ] Model the `Offer` entity and establish its relationship with the `Auction`. How do you link multiple bids to a single listing to track the complete bid history?
> - [ ] Implement the bidding service. Before saving an offer, your application must validate the state of the auction.
> - [ ] Edge cases to handle:
>
> 1. What happens if the auction is already closed?
> 2. What if the bid fails to exceed the current price (or the starting price, if it is the very first bid)?
>
> - [ ] HTTP Semantics: Rejecting a bid because the amount is too low is a business rule violation, not a malformed request syntax. Which HTTP status code best communicates a conflict with the current state of the resource?

> :research: _Resource:_ [TypeORM Relations](https://typeorm.io/docs/relations/relations/)

## 4 RESTful Polish

Elevate your API to professional standards without altering the core functionality.

> - [ ] Enforce global validation. How do you guarantee that incoming payloads match your DTO shapes and automatically reject extraneous fields?
> - [ ] Protect your database architecture from leaking. Define specific Response Models (DTOs) so clients only receive the data they are meant to see.
> - [ ] Implement pagination and the following filtering options for your auction list:
>
> 1. `?status=open|closed`
> 2. `?min-price` & `?max-price`
> 3. sorting the auctions by end date, with the most recent first
>
> - [ ] **Implementation detail:** How do you handle clients requesting a specific page size or filtering auctions by their current status (open vs. closed)? Make sure to include metadata (total items, total pages) in your paginated responses.

> :research: _Resource:_ [NestJS Validation](https://docs.nestjs.com/techniques/validation)

## 5 Authentication & Authorization

Replace the plaintext seller and bidder strings with a secure identity system. The API will now extract the user's identity from a verified token rather than trusting the request body.

> - [ ] Introduce a `User` model with securely hashed passwords.
> - [ ] Implement a JWT-based login flow.
> - [ ] **Security challenge:** How do you lock down your API so that creating auctions or placing bids requires authentication, while browsing the auction list remains completely public?
> - [ ] Refactor your auction and offer creation services. Strip the `seller` and `bidder` fields from your incoming DTOs and pull the identity directly from the verified token.
> - [ ] **Business logic upgrade:** With real authentication in place, how do you prevent a seller from placing a bid on their own listing?

> :research: _Resource:_ [NestJS Authentication](https://docs.nestjs.com/security/authentication)

## 6 API Documentation with Swagger

Generate live, interactive documentation directly from your code. Developers should be able to understand your endpoints and test them from the browser.

> - [ ] Mount Swagger and configure it to recognize your DTOs.
> - [ ] How do you configure the documentation to handle authenticated routes? Ensure the UI provides an Authorize dialog so users can paste their JWT and test protected endpoints.
> - [ ] Enrich your schema. Where the inferred types are ambiguous, use decorators to provide clear descriptions and realistic examples (e.g., demonstrating the expected date format).

> :research: _Resource_: [NestJS OpenAPI](https://docs.nestjs.com/openapi/introduction)

## Bonus Challenges

Pick one or more if you complete the main requirements early.

> - [ ] **Watchlists:** Implement a user's ability to add and remove an auction to their own watchlist and retrieve it.
> - [ ] **Database Migrations:** Turn off automatic synchronization. Write an initial migration that manually creates your tables. This is the only safe way to evolve a schema in production.
> - [ ] **Derived State:** Expose a computed status field (`open` or `closed`) on the auction response based on the current timestamp, saving the client from doing date math.
> - [ ] **Role-Based Access Control:** Introduce an `admin` role. Implement a guard that allows admins to delete any auction, whereas standard users can only delete their own listings.
> - [ ] **Rate Limiting:** Track offer submissions. Reject sudden bursts of bids from the same user within a short time window using a `429 Too Many Requests` status.
