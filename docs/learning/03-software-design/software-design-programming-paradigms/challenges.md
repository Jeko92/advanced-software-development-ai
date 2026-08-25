# Software Design Paradigms - Challenges

You are building parts of a library management system. The exercises below ask you to apply functional, object-oriented, and design-principle thinking to the same domain, in order.

## Functional transformation in a service layer

You receive an array of SQL result rows for the book catalogue. Each row contains `id`, `title`, `author_name`, `is_available`, and `added_at`.

Write TypeScript code that:

- filters the array so only available books remain
- maps each row into a response shape with `id`, `title`, `authorName`, and `addedAt`
- keeps the original array unchanged

After you finish, explain which part of your solution is pure and where side effects (e.g. DB writes) would belong in an Express application.

## Book Library Reservations

Your local library wants to create a reservation system for book reservations. Members of the library should be able to reserve books, mark them as returned, and cancel reservations through their online account. Create a `BookReservation` class in TypeScript that implements the following criteria:

- accept a member name and a book title in the constructor
- store the reservation status so it cannot be changed directly from outside the class. The status can only be "reserved", "returned", or "cancelled".
- provide a `markReturned` method that rejects the action if the reservation is already returned or cancelled
- provide a `cancel` method that rejects the action if the book has already been returned
- provide a way to read the current status safely

## Book Library Notification System

Model the notification system for a library app. When a reservation is created or a book becomes overdue, members get notified through one or more channels (e.g. email, SMS).

Your solution must satisfy these specific requirements:

**The `Notifiable` interface** must declare:

- `notify(memberId: string, event: string, title: string): void` — sends a notification to a member
- `getChannelName(): string` — returns the name of the channel (e.g. `"email"`)

**The `BaseNotifier` abstract class** must implement `Notifiable` and provide:

- A `formatMessage(event: "reservation" | "overdue", title: string): string` concrete method that returns a full message string, e.g. `"Reminder: 'Dune' is overdue."` or `"Your reservation for 'Dune' is confirmed."`
- An abstract `send(memberId: string, message: string): void` that subclasses must implement
- A concrete `notify(memberId: string, event: "reservation" | "overdue", title: string): void` that calls `formatMessage` then `send`

**Two concrete classes** extending `BaseNotifier`:

- `EmailNotifier`: implements a mock Email `send` by logging: `Sending email to member #${memberId}: ${message}`
- `SmsNotifier`: implements a mock SMS `send` by logging: `Sending SMS to member #${memberId}: ${message}`

**A `NotificationService` class** that:

- Accepts an array of `Notifiable` channels in its constructor (think of these as the notification channels that the user already has enabled)
- Has a `dispatch(memberId: string, event: "reservation" | "overdue", title: string): void` method that calls `notify` on every channel

Test your solution by creating a `NotificationService` with both an `EmailNotifier` and `SmsNotifier`, then dispatching a `"reservation"` event for `"Dune"` to member `"42"`.

## Refactor Your Recap 2 App

Go back to the code base from the previous recap project. Inspect it with SRP, DRY, and SOC in mind, and refactor it to improve its design. Do you see any opportunities for implementing a class?
