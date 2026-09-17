# Recap Project 3 - DarkBay

Welcome to **DarkBay**, an underground marketplace API where users list items for sale and bid against each other. You will build this backend entirely from scratch. There is no frontend; Everything happens via a RESTful API using JSON payloads.

A seller posts an auction for an item with a starting price and an end date. Other users compete by posting offers. The core business logic lives in your service layer: a valid bid must meet the initial starting price and strictly exceed any existing bids. Naturally, the auction must still be open. If a request breaks these rules, your API rejects it with an appropriate HTTP status code instead of failing silently or throwing a generic server error.

Your data model centers around a one-to-many relationship. The `auctions` table stores the listings – titles, descriptions, starting prices, and end dates. The end date of an auction defaults to three days after the auction was created if not set. The `offers` table records the bids, linking back to the auction via a foreign key. You will leverage this relationship to calculate the current active price, fetch the highest offer, or retrieve an entire bid history.

This project simulates a realistic transition (refactoring) that every real backend goes through. Initially, you will trust the client. This means a request body containing `"seller": "z3r0c00l"` or `"bidder": "ac1dburn"` dictates the identity. This gets your core features running quickly. Later, you strip out this blind trust and implement proper authentication. The seller and bidder fields disappear from the API payloads. The database continues linking users to their auctions and bids, but the API will extract that identity exclusively from a verified JWT. Clients lose the ability to spoof their identity because the server validates the token signature on every protected request.

Before writing your first line of code, set up a Git repository. Version control
your work, try to commit often, write descriptive commit messages, and push your progress to GitHub.

The work breaks down into six parts:

1. Project Setup & Database
2. The Auction Module
3. The Offer Module & Bidding Logic
4. RESTful Polish
5. Authentication
6. API Documentation with Swagger
