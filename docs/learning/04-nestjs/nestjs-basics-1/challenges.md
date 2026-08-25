# NestJS Basics 1 - Challenges

## Quote API

Build a NestJS application that serves quotes from a static dataset.

### Requirements

- Use NestJS with a Controller, a Service, and a Module
- `GET /quotes` returns all quotes
- `GET /quotes/random` returns a single randomly selected quote

The Service holds and manages the quote data. The Controller handles the routes
and calls the Service. Both are registered in the root Module.

### Seed data

```json
[
  {
    "id": 1,
    "quote": "The only way to do great work is to love what you do.",
    "author": "Steve Jobs"
  },
  {
    "id": 2,
    "quote": "Be the change that you wish to see in the world.",
    "author": "Mahatma Gandhi"
  },
  {
    "id": 3,
    "quote": "Innovation distinguishes between a leader and a follower.",
    "author": "Steve Jobs"
  },
  {
    "id": 4,
    "quote": "The future belongs to those who believe in the beauty of their dreams.",
    "author": "Eleanor Roosevelt"
  },
  {
    "id": 5,
    "quote": "Strive not to be a success, but rather to be of value.",
    "author": "Albert Einstein"
  },
  {
    "id": 6,
    "quote": "Life is what happens when you're busy making other plans.",
    "author": "John Lennon"
  },
  {
    "id": 7,
    "quote": "The only impossible journey is the one you never begin.",
    "author": "Tony Robbins"
  },
  {
    "id": 8,
    "quote": "The mind is everything. What you think you become.",
    "author": "Buddha"
  },
  {
    "id": 9,
    "quote": "Believe you can and you're halfway there.",
    "author": "Theodore Roosevelt"
  },
  {
    "id": 10,
    "quote": "The best way to predict the future is to create it.",
    "author": "Peter Drucker"
  }
]
```

### Optional

- Add a `GET /quotes?author=<name>` query parameter to filter quotes by author
- Build a simple HTML/CSS/vanilla JS frontend that fetches and displays quotes
