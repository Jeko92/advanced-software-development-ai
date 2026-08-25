# Software Design Paradigms

This project contains my solutions for the **neuefische Advanced Software Development with AI** bootcamp **Software Design Paradigms** module — functional programming, JavaScript/TypeScript classes, OOP (interfaces, abstract classes, composition), and design principles (SRP, DRY, separation of concerns), built around a small library/order/notification domain.

There is no HTTP server or UI here — every file logs its result straight to the console when it runs. That console output is the point: read it alongside the source to see each pattern in action.

## Running it

From the repository root:

```bash
pnpm --filter programming-paradigms dev
```

Or from this folder:

```bash
cd bootcamp/03-software-design/programming-paradigms
pnpm dev
```

`pnpm dev` builds the TypeScript, then runs `dist/index.js` (which imports every file below in order) and watches for changes. For a single one-off run without the watcher:

```bash
pnpm exec tsx src/index.ts
```

`code-along.ts` opens a throwaway SQLite connection on startup (see below); everything else is pure console output.

## Implemented challenges

**Core challenges** (`docs/learning/.../software-design-programming-paradigms/challenges.md`):

- `functional-transformation-in-a-service-layer.ts` — filter/map a book catalogue into a response shape without mutating the source array
- `book-library-reservations.ts` — `BookReservation` class with a private, method-guarded status (`reserved` → `returned`/`cancelled`)
- `book-library-notification-system.ts` — `Notifiable` interface + `BaseNotifier` abstract class + `NotificationService`, the original Interface/Abstract-Class/Composition template

**Practice set** (`docs/learning/.../oop-abstract-classes-practice.md`) — the same interface/abstract-class/composition shape re-derived across 12 domains, `src/01-*.ts` through `src/12-*.ts`:

1. Order Status Update System
2. Employee Payroll Deduction System
3. File Export System
4. Game Character Attack System
5. Monitoring Alert System
6. Subscription Billing Reminder System
7. Checkout Discount Engine
8. Shipping Carrier Rate Comparator
9. IoT Sensor Threshold Watcher
10. Chat Message Filter Pipeline
11. Recipe Nutrition Calculator
12. Multi-Provider Payment Router

**`code-along.ts`** — session-following code snippets covering every concept from the handout docs (pure functions, immutability, classes, access modifiers, abstract classes, SRP/DRY/SoC).

## Database

`code-along.ts` needs a SQLite connection at the top for the DB-related functional-programming examples, but nothing in this package actually reads or writes real data. No `.db` file is checked in — `db/` and `db/blog.db` are created automatically (and gitignored) the first time the code runs.
