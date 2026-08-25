# Software Design Patterns – Coding Challenges

*Hands-on exercises for Creational, Structural, and Behavioral Patterns*

Every challenge below links to its actual solution under `src/`, and the
numbering matches the solution filenames exactly (e.g. Challenge 1.1.1 is
`src/coding-challenges/part-1-creational/1-1-1-payment-method-factory.ts`).
A few solutions go further than the original assignment — extra practice
reps of the same pattern, written for more reps — and are marked as such.

---

## Part 1: Creational Patterns

> **Goal:** Practice separating *what* to create from *how* to create it.

---

### Warm-up – Extend the Audio Decoder Factory

The handout's own `createDecoder(format)` factory supports `mp3`, `flac`,
and `wav`. This warm-up extends that same file directly, rather than
starting a new one under `coding-challenges/` — it's practice on the
handout's example, not a standalone challenge.

**Your task:**
1. Add support for a new format, e.g. `ogg` or `aac`.
2. Write the `OggDecoder` class so it implements the `Decoder` interface.
3. Update the factory switch statement.
4. Write a small test that passes each format string through the factory and asserts the returned object has a `.decode()` method.

**Solution:** `src/patterns/creational/factory.ts` (adds `OggDecoder` and the `'ogg'` branch directly onto the handout's `createDecoder`/`Player` example).

**Focus:** The `Player` class must not change when you add the new format.

---

### Challenge 1.1.1 – Payment Method Factory

You are building a checkout system that supports multiple payment providers.

**Your task:**
1. Define a `PaymentProcessor` interface with a method `charge(amount, description, items): Promise<Receipt>`.
2. Create three concrete classes: `StripeProcessor`, `PaypalProcessor`, and `BankTransferProcessor`.
3. Write a `PaymentProcessorFactory` class whose `create(method: "stripe" | "paypal" | "bank")` returns the right processor.
4. In a `CheckoutService`, use the factory to charge a customer, with default `description`/`items` values living in the service. The service should never instantiate a processor directly.

**Solution:** `src/coding-challenges/part-1-creational/1-1-1-payment-method-factory.ts`

**Focus:** Adding a fourth provider later must require changing *only* the factory. Default values for `description`/`items` belong in `CheckoutService`, not duplicated inside every processor.

---

### Challenge 1.1.2 – Notification Service Factory *(extra practice rep)*

A notification system supports multiple delivery channels, each with its own required `Recipient` field.

**Your task:**
1. Define a `Notifier` interface with `send(recipient, message): Promise<void>`.
2. Implement `EmailNotifier`, `SmsNotifier`, `PushNotifier`, each validating that the `Recipient` field it needs (`email`/`phone`/`userId`) is present.
3. Write a `NotifierFactory` whose `create(channel: "email" | "sms" | "push")` returns the right notifier.
4. Build a `NotificationService` that asks the factory for a notifier, then sends through it — never instantiating a notifier directly.

**Solution:** `src/coding-challenges/part-1-creational/1-1-2-notification-service-factory.ts`

**Focus:** Adding a `WhatsAppNotifier` later should require changing only the factory and adding the new implementation.

---

### Challenge 1.1.3 – Logger Factory *(extra practice rep)*

An application can log to different destinations, chosen per call rather than fixed at construction.

**Your task:**
1. Define a `Logger` interface with `info(message)` and `error(message)`.
2. Implement `ConsoleLogger`, `FileLogger`, `DatabaseLogger` (the latter two take a mock destination string via their constructor).
3. Write a `createLogger(destination: "console" | "file" | "database"): Logger` factory function.
4. Build an `ApplicationService` that asks the factory for a logger *on every call* (not once at construction), so the destination can vary per call.

**Solution:** `src/coding-challenges/part-1-creational/1-1-3-logger-factory.ts`

**Focus:** Adding a `SlackLogger` later should require changing only the factory and adding the new implementation.

---

### Challenge 1.1.4 – Shipping Carrier Factory *(extra practice rep)*

An order system supports multiple shipping carriers, each with its own rate/tracking configuration.

**Your task:**
1. Define a `ShippingCarrier` interface with `calculateRate(weightKg)` and `getTrackingUrl(trackingNumber)`.
2. Implement `DhlCarrier`, `UpsCarrier`, `FedexCarrier`, each taking its own config object (rate, tracking base URL, and — for FedEx — a fuel surcharge) via its constructor.
3. Write a `createCarrier(carrier: "dhl" | "ups" | "fedex"): ShippingCarrier` factory function that owns the concrete rates and tracking URLs.
4. Build a `ShippingService` that asks the factory for a carrier, then calculates a rate and generates a tracking URL — never instantiating a carrier directly.

**Solution:** `src/coding-challenges/part-1-creational/1-1-4-shipping-carrier-factory.ts`

**Focus:** The service should operate entirely against the `ShippingCarrier` interface. Adding a `DpdCarrier` later should require changing only the factory.

---

### Challenge 1.1.5 – Report Generator Factory *(extra practice rep)*

A reporting system supports multiple output formats.

**Your task:**
1. Define a `ReportGenerator` interface with `generate(data): string`.
2. Implement `PdfReportGenerator`, `CsvReportGenerator`, `JsonReportGenerator`, each taking its own formatting config via constructor (template name, delimiter, pretty-print flag).
3. Write a `createReportGenerator(format: "pdf" | "csv" | "json"): ReportGenerator` factory function.
4. Build a `ReportService` that asks the factory for a generator on every call, then generates the report through it.

**Solution:** `src/coding-challenges/part-1-creational/1-1-5-report-generator-factory.ts`

**Focus:** Adding an `XlsxReportGenerator` later should require changing only the factory and adding the new implementation.

---

### Challenge 1.2.1 – Build a Complex Search Query

The handout introduced a `PlaylistQueryBuilder` to avoid telescoping constructors.

**Your task:**
1. Create a `ProductSearchBuilder` class.
2. Support fluent setters for: `category`, `minPrice`, `maxPrice`, `inStockOnly`, `sortBy`, and `limit`.
3. The `build()` method should validate that `minPrice <= maxPrice` and that `limit` is between 1 and 100.
4. Return an immutable `ProductSearch` object from `build()`.
5. Demonstrate chaining: `new ProductSearchBuilder().category("electronics").minPrice(50).maxPrice(500).inStockOnly().build()`.

**Solution:** `src/coding-challenges/part-1-creational/1-2-1-product-search-builder.ts`

**Focus:** Partial, messy state lives inside the builder; the finished object is clean.

---

### Challenge 1.2.2 – Email Notification Builder

You need to construct emails that have many optional fields.

**Your task:**
1. Create an `EmailBuilder` with setters for: `to`, `cc` (array, additive), `bcc` (array, additive), `subject`, `body`, `attachment` (array, additive), and `priority`.
2. Each setter returns `this` for chaining.
3. `build()` must ensure `to` and `subject` are provided; otherwise throw.
4. Return an `Email` object that has no setters (read-only).

**Solution:** `src/coding-challenges/part-1-creational/1-2-2-email-notification-builder.ts`

**Focus:** Builders shine when construction has many optional parts and cross-field validation.

---

### Challenge 1.2.3 – HTTP Request Builder *(extra practice rep)*

**Your task:**
1. Create an `HttpRequestBuilder` with fluent setters: `url`, `method` (defaults to `'GET'`), `header` (key-value map, additive), `param` (URL query params, additive), `body`, `timeout`.
2. `build()` validates: `url` must be non-empty; if `method` is `'GET'` or `'DELETE'`, throw if a `body` was set; `timeout` (if set) must be `> 0`.
3. Return an immutable `HttpRequest` object.

**Solution:** `src/coding-challenges/part-1-creational/1-2-3-http-request-builder.ts`

**Focus:** Key-value map aggregation and method-dependent validation rules.

---

### Challenge 1.2.4 – Game Character Builder *(extra practice rep)*

**Your task:**
1. Create a `CharacterBuilder` with fluent setters: `setName`, `setClass` (`'Warrior' | 'Mage' | 'Rogue'`), `setStats(strength, agility, intelligence)`, `addAbility` (array, additive, max 4 total), `equipItem` (array, additive).
2. `build()` validates: `name` and `class` are both set; `strength + agility + intelligence` must equal exactly 30; class-dependent stat minimums (`Mage` needs `intelligence >= 15`, `Warrior` needs `strength >= 15`, `Rogue` needs `agility >= 15`); ability count cannot exceed 4.
3. Return an immutable `Character` object.

**Solution:** `src/coding-challenges/part-1-creational/1-2-4-game-character-builder.ts`

**Focus:** Constrained point budgets, array caps, and class-dependent validation rules.

---

### Challenge 1.3.1 – Safe Singleton: Configuration Store

The handout showed an `AudioEngine` singleton that must be initialized once.

**Your task:**
1. Create a `ConfigStore` singleton that holds application settings (e.g. `apiUrl`, `theme`, `maxItemsPerPage`).
2. Use a private constructor and a static `initialize(settings)` method.
3. Throw if `initialize` is called twice or if `getInstance()` is called before initialization.
4. Add a `get(key)` and `set(key, value)` method on the instance.
5. Show two different modules calling `ConfigStore.getInstance()` and reading the same values.

**Solution:** `src/coding-challenges/part-1-creational/1-3-1-safe-singleton-config-store.ts`

**Focus:** Singleton is justified here because the configuration must be globally consistent.

---

### Challenge 1.3.2 – Singleton vs. Instance Passing

The handout warned against using Singleton for things that are merely convenient to access globally (like a Logger).

**Your task:**
1. Take this anti-pattern code:
   ```ts
   class OrderService {
     submit(order: Order) {
       Logger.getInstance().info(`Order submitted: ${order.id}`);
       // ...
     }
   }
   ```
2. Refactor it so `Logger` is passed through the constructor (Dependency Injection).
3. Write a test that injects a `FakeLogger` (just pushes messages to an array) and asserts the correct log was written.
4. Explain in a one-sentence comment why the injected version is easier to test.

**Solution:** `src/coding-challenges/part-1-creational/1-3-2-singleton-vs-instance-passing.ts`

**Focus:** Recognize when Singleton is a trap and when it is truly needed.

---

### Challenge 1.4 – Mini Project: Compose a Media Pipeline

**Your task:**
1. Build a tiny media pipeline using **all three** creational patterns:
   - **Factory:** `createSource(type: "file" | "network" | "microphone")` returns a `MediaSource`.
   - **Builder:** `PipelineBuilder` lets you add sources, filters, and sinks step by step, then `build()` returns a `MediaPipeline`.
   - **Singleton:** `HardwareContext` ensures only one audio device handle exists.
2. Write a `main()` function (or test) that wires everything together at a composition root.

**Solution:** `src/coding-challenges/part-1-creational/1-4-mini-project-media-pipeline.ts`

**Focus:** See how the three patterns work together in one flow.

---

## Part 2: Structural Patterns

> **Goal:** Practice connecting objects so they can be swapped, tested, and extended independently.

---

### Challenge 2.1 – Repository Interface + Two Implementations

The handout showed a `TrackRepository` with PostgreSQL and in-memory implementations (`src/patterns/structural/repository.ts`).

**Your task:**
1. Define a `UserRepository` interface with: `findById(id)`, `findByEmail(email)`, `save(user)`, and `delete(id)`.
2. Implement `SqlUserRepository` on top of a real SQL client.
3. Implement `InMemoryUserRepository` using a `Map<string, User>`.
4. Write a `UserService` that depends only on the `UserRepository` interface.
5. Show the same `UserService` being instantiated once with the SQL repo and once with the in-memory repo.

**Solution:** `src/coding-challenges/part-2-structural/2-1-repository-two-implementations.ts` — `SqlUserRepository` runs on Node's built-in `node:sqlite` (`DatabaseSync`) rather than a mocked client, and `User` was kept intentionally minimal (`id`, `username`, `email` — no `Date` fields, to sidestep SQLite/JS date round-tripping for a demo this small).

**Focus:** The service knows *what* it needs, not *how* data is stored.

---

### Challenge 2.2 – Refactor to Repository Pattern

**Your task:**
1. Start with this tightly coupled class:
   ```ts
   class InvoiceService {
     async getTotal(invoiceId: number) {
       const { rows } = await pgPool.query(
         "SELECT * FROM invoice_lines WHERE invoice_id = $1", [invoiceId]
       );
       return rows.reduce((sum, r) => sum + r.amount, 0);
     }
   }
   ```
2. Extract a repository interface and move the SQL into a `PostgresInvoiceLineRepository`.
3. Make `InvoiceService` depend on the interface.
4. Write a unit test using an in-memory repository that returns hard-coded lines.

**Solution:** `src/coding-challenges/part-2-structural/2-2-refactor-to-repository.ts` — keeps the original tightly-coupled version alongside the refactor (renamed `InvoiceServiceAntiPattern`) for a direct before/after comparison, both exercised against a real local Postgres connection so failures are genuine, not mocked.

**Focus:** The repository owns the query; the service owns the business rule (summing).

---

### Challenge 2.3 – Manual Dependency Injection

The handout introduced the composition root where objects are wired together.

**Your task:**
1. Create three classes:
   - `EmailNotifier` (implements `Notifier`) – sends emails.
   - `SmsNotifier` (implements `Notifier`) – sends SMS.
   - `AlertService` – receives a `Notifier` via constructor and calls `notify(message)`.
2. Write two composition roots:
   - `composeProduction()` returns an `AlertService` wired with `EmailNotifier`.
   - `composeTest()` returns an `AlertService` wired with `SmsNotifier`.
3. In a test, call `composeTest()`, trigger an alert, and assert the SMS notifier was used.

**Solution:** `src/coding-challenges/part-2-structural/2-3-manual-dependency-injection.ts` — `Notifier`/`EmailNotifier` are exported and reused directly by the bonus e-commerce module (Challenge 4.1) instead of being rebuilt there.

**Focus:** The class never chooses its dependency; the composition root does.

---

### Challenge 2.4 – Decorator: Retry Logic

The handout showed a `@measure` decorator for timing (`src/patterns/structural/decorator.ts`).

**Your task:**
1. Write a `@retry(maxAttempts: number, delayMs: number)` class-method decorator.
2. If the decorated method throws, catch the error, wait `delayMs`, and try again up to `maxAttempts`.
3. Apply it to a `flakyApiCall()` method that fails randomly (e.g. `Math.random() < 0.7`).
4. Log each attempt and the final outcome.

**Solution:** `src/coding-challenges/part-2-structural/2-4-decorator-retry-logic.ts` — `retry` is exported and reused directly on `SqlOrderRepository`'s methods in the bonus e-commerce module (Challenge 4.1).

**Focus:** Decorators add cross-cutting behavior without touching the original method body.

---

### Challenge 2.5 – Decorator: Result Caching

**Your task:**
1. Write a `@cache(ttlMs: number)` decorator that memoizes method results.
2. The decorator should store results in a `Map` keyed by JSON-stringified arguments.
3. If the same arguments are passed again within `ttlMs`, return the cached value instead of calling the original method.
4. Apply it to an expensive `calculatePrimes(max: number)` method and show the speed difference.

**Solution:** `src/coding-challenges/part-2-structural/2-5-decorator-result-caching.ts`

**Focus:** Reusable behavior (caching) is kept outside the business logic.

---

### Challenge 2.6 – Decorator + DI Together

**Your task:**
1. Create a `DatabaseClient` interface with a `query(sql: string)` method.
2. Implement `PostgresClient`.
3. Write a `LoggingClient` *decorator* (object wrapper, not a TypeScript decorator) that wraps any `DatabaseClient` and logs every query before forwarding it.
4. At the composition root, wrap the real `PostgresClient` with `LoggingClient` before injecting it into a `UserRepository`.
5. Show that the repository works unchanged, but queries are now logged.

**Solution:** `src/coding-challenges/part-2-structural/2-6-decorator-di-together.ts` — this `UserRepository` is a small, self-contained one scoped to this exercise (a single `findAll()` method), separate from Challenge 2.1's fuller `UserRepository`.

**Focus:** Decorators can be objects too, and they compose beautifully with DI.

---

### Challenge 2.7 – Mini Project: Pluggable Reporting Engine

**Your task:**
1. Build a reporting system using **all three** structural patterns:
   - **Repository:** `ReportRepository` with `findByDateRange(start, end)`; provide SQL and in-memory versions.
   - **Dependency Injection:** `ReportEngine` receives a `ReportRepository` and a `Formatter` via constructor.
   - **Decorator:** Write a `MetricsReportRepository` decorator that counts how many queries were executed and logs the average fetch time.
2. Write a composition root that wires the production stack (SQL repo → metrics decorator → report engine → JSON formatter) and a test stack (in-memory repo → report engine → CSV formatter).

**Solution:** `src/coding-challenges/part-2-structural/2-7-mini-project-reporting-engine.ts` — `MetricsReportRepository` records its timing in a `finally` block, so a failing query is still counted and timed, not silently skipped.

**Focus:** See how structure allows you to swap, test, and observe every layer independently.

---

## Part 3: Behavioral Patterns

> **Goal:** Practice runtime coordination: notifying, swapping algorithms, and enforcing valid state transitions.

---

### Challenge 3.1 – Event Bus for a Task Board

The handout showed a `MusicPlayer` event bus with `subscribe` and `emit` (`src/patterns/behavioural/observer.ts`).

**Your task:**
1. Create a typed `TaskBoardEvent` union with events like `{ type: "task.created"; taskId: string; title: string }`, `{ type: "task.moved"; taskId: string; column: "todo" | "doing" | "done" }`, and `{ type: "task.deleted"; taskId: string }`.
2. Build a `TaskBoardBus` class with `subscribe(listener)` and `emit(event)`.
3. Write three independent subscribers:
   - `AuditLogger` – logs every event to console.
   - `SlackNotifier` – sends a message only when a task moves to "done".
   - `AnalyticsTracker` – counts how many tasks were created.
4. Emit a few events and verify each subscriber reacted correctly.

**Solution:** `src/coding-challenges/part-3-behavioural/3-1-event-bus-task-board.ts`

**Focus:** The task board does not know its subscribers exist.

---

### Challenge 3.2 – Observer vs. Direct Calls

**Your task:**
1. Start with this tightly coupled code:
   ```ts
   class OrderProcessor {
     constructor(
       private inventory: InventoryService,
       private billing: BillingService,
       private shipping: ShippingService,
     ) {}
     complete(order: Order) {
       this.inventory.reserve(order.items);
       this.billing.charge(order.total);
       this.shipping.schedule(order.address);
     }
   }
   ```
2. Refactor it to an event bus: `OrderProcessor` emits `order.completed`, and the three services subscribe to it.
3. Show that adding a fourth reaction (e.g. `LoyaltyService` awarding points) requires zero changes to `OrderProcessor`.

**Solution:** `src/coding-challenges/part-3-behavioural/3-2-observer-vs-direct-calls.ts`

**Focus:** Observer removes the need to modify the subject when new listeners appear.

---

### Challenge 3.3 – Strategy: Shipping Cost Calculator

The handout showed `PlaybackStrategy` for swapping algorithms at runtime (`src/patterns/behavioural/strategy.ts`).

**Your task:**
1. Define a `ShippingStrategy` interface with `calculate(weight: number, distance: number): number`.
2. Implement three strategies:
   - `StandardShipping` – flat rate + per-kg fee.
   - `ExpressShipping` – higher flat rate + per-kg fee + distance surcharge.
   - `FreeShipping` – always returns 0.
3. Create a `Cart` class that holds a `ShippingStrategy` and has `setStrategy()` and `checkout()` methods.
4. Demonstrate switching strategies at runtime and show the different costs.

**Solution:** `src/coding-challenges/part-3-behavioural/3-3-strategy-shipping-cost.ts`

**Focus:** The `Cart` delegates the calculation; it does not contain the formulas.

---

### Challenge 3.4 – Strategy: Validation Rules

**Your task:**
1. Define a `PasswordValidator` interface with `validate(password: string): boolean`.
2. Implement:
   - `LengthValidator` (min length).
   - `ComplexityValidator` (requires letters, numbers, symbols).
   - `CommonPasswordValidator` (rejects passwords from a small deny-list like `["password", "123456"]`).
3. Create a `PasswordChecker` that accepts an array of strategies and runs them in order.
4. Show how a user registration form can switch between "strict" and "lenient" validation presets by passing different strategy arrays.

**Solution:** `src/coding-challenges/part-3-behavioural/3-4-strategy-validation-rules.ts`

**Focus:** Strategies are small, interchangeable, and composable.

---

### Challenge 3.5 – State Machine: Traffic Light

The handout used a state machine for a music player (`src/patterns/behavioural/state-machine.ts`). A traffic light is the classic analogy.

**Your task:**
1. Define `TrafficLightState = "red" | "red-yellow" | "green" | "yellow"`.
2. Define `TrafficLightEvent = "timer"`.
3. Build a transition table:
   - `red` → `red-yellow`
   - `red-yellow` → `green`
   - `green` → `yellow`
   - `yellow` → `red`
4. Implement a `TrafficLight` class with `state` and `transition(event)`.
5. Throw on illegal transitions (there should be none if the table is correct, but test it anyway by sending a wrong event).
6. Add a `getState()` method and write a loop that cycles through 10 transitions, printing the state each time.

**Solution:** `src/coding-challenges/part-3-behavioural/3-5-state-machine-traffic-light.ts` — since `TrafficLightEvent` only has one legal value, sending "a wrong event" requires a type cast (`'malfunction' as TrafficLightEvent`) to get an invalid event past the compiler at all.

**Focus:** The state machine enforces that only one light is on at a time and the sequence is always valid.

---

### Challenge 3.6 – State Machine: Document Approval Flow

**Your task:**
1. Define states: `draft`, `under_review`, `approved`, `rejected`, `published`.
2. Define events: `submit`, `approve`, `reject`, `revise`, `publish`.
3. Build the transition table:
   - `draft` → `submit` → `under_review`
   - `under_review` → `approve` → `approved`
   - `under_review` → `reject` → `rejected`
   - `rejected` → `revise` → `draft`
   - `approved` → `publish` → `published`
4. Implement a `DocumentWorkflow` class.
5. Write tests that verify:
   - A draft can be submitted.
   - A rejected document can be revised back to draft.
   - Calling `publish()` from `draft` throws an illegal-transition error.

**Solution:** `src/coding-challenges/part-3-behavioural/3-6-state-machine-document-approval.ts`

**Focus:** Boolean flags (`isApproved`, `isRejected`) would allow impossible combinations; the state machine does not.

---

### Challenge 3.7 – Mini Project: Smart Home Controller

**Your task:**
1. Build a small smart-home system using **all three** behavioral patterns:
   - **Observer:** A `HomeEventBus` emits events like `motion.detected`, `temperature.high`, `door.opened`. The `SecuritySystem`, `HVACController`, and `NotificationApp` subscribe independently.
   - **Strategy:** The `HVACController` uses a `ClimateStrategy` interface. Provide `EnergySavingStrategy` and `ComfortStrategy`; let the user switch at runtime.
   - **State Machine:** The `SecuritySystem` has states `disarmed`, `arming`, `armed`, `triggered`. Only valid transitions are allowed (e.g. cannot go from `disarmed` directly to `triggered`).
2. Write a simulation script that emits events, switches climate strategies, and triggers security state transitions.

**Solution:** `src/coding-challenges/part-3-behavioural/3-7-mini-project-smart-home.ts`

**Focus:** See how behavioral patterns keep runtime coordination clean, flexible, and safe.

---

## Bonus: Integration Challenge

### Challenge 4.1 – Build a Tiny E-Commerce Module

Combine patterns from **all three categories** into one coherent module:

1. **Creational:**
   - Use a **Factory** to create the right `PaymentProcessor`.
   - Use a **Builder** to construct a complex `Order` object with many optional fields (gift wrap, discount code, shipping method).
   - Use a **Singleton** for the `RateLimiter` that guards the payment API.

2. **Structural:**
   - Use a **Repository** for `OrderRepository` (SQL + in-memory).
   - Use **Dependency Injection** to wire `OrderService` with its repository, payment processor, and notifier.
   - Use a **Decorator** to add logging and retry logic to the repository methods.

3. **Behavioral:**
   - Use **Observer** so `OrderService` emits `order.placed` and `InventoryService`, `EmailService`, and `AnalyticsService` react independently.
   - Use **Strategy** so the `PricingService` can switch between `StandardPricing` and `BlackFridayPricing`.
   - Use a **State Machine** for the `Order` lifecycle: `pending` → `paid` → `shipped` → `delivered` (with cancellation rules).

4. Write a `main()` composition root that wires everything for production, and a separate test composition root that uses in-memory fakes.

**Solution:** `src/coding-challenges/bonus/4-1-tiny-ecommerce-module.ts` — deliberately reuses rather than rebuilds where an earlier challenge already solved the same piece:
- **Factory** → `PaymentProcessorFactory` from Challenge 1.1.1.
- **Decorators** (logging + retry) → `measure` (from `src/patterns/structural/decorator.ts`) and `retry` (from Challenge 2.4), stacked directly on `SqlOrderRepository`'s methods.
- **Notifier** → `Notifier`/`EmailNotifier` from Challenge 2.3.

Everything else (`OrderBuilder`, `RateLimiter`, `OrderRepository`, `OrderService`, the Observer/Strategy/State Machine pieces) is new to this module, since no earlier challenge modeled an `Order`.

**Focus:** See both halves of good structure — building something new where nothing fits yet, and reusing what already does.

---

## Tips Before You Start

- **Do not over-engineer.** If a challenge can be solved in 20 lines, write 20 lines. Patterns are tools, not trophies.
- **Write tests.** Every challenge is easier to verify with a small test or a `console.log` simulation.
- **Read the error messages.** State machines should throw clear errors on illegal transitions. Factories should throw on unknown types. Builders should throw on invalid combinations.
- **Refactor, don’t rewrite.** Several challenges start with “bad" code and ask you to refactor it. Keep the original behavior intact while improving the structure.
- **Reuse before rewriting.** If an earlier challenge already built the interface/class a later one needs (see Challenge 4.1), import and export it rather than duplicating it — that's the same instinct these patterns are teaching in the first place.

Happy coding!
