# Software Design Patterns – Coding Challenges

*Hands-on exercises for Creational, Structural, and Behavioral Patterns*

---

## Part 1: Creational Patterns

> **Goal:** Practice separating *what* to create from *how* to create it.

---

### Challenge 1.1 – Extend the Audio Decoder Factory

The handout showed a `createDecoder(format)` factory that supports `mp3`, `flac`, and `wav`.

**Your task:**
1. Add support for a new format, e.g. `ogg` or `aac`.
2. Write the `OggDecoder` class so it implements the `Decoder` interface.
3. Update the factory switch statement.
4. Write a small test that passes each format string through the factory and asserts the returned object has a `.decode()` method.

**Focus:** The `Player` class must not change when you add the new format.

---

### Challenge 1.2 – Payment Method Factory

You are building a checkout system that supports multiple payment providers.

**Your task:**
1. Define a `PaymentProcessor` interface with a method `charge(amount: number): Promise<Receipt>`.
2. Create three concrete classes: `StripeProcessor`, `PayPalProcessor`, and `BankTransferProcessor`.
3. Write a factory function `createProcessor(method: "stripe" | "paypal" | "bank"): PaymentProcessor`.
4. In a `CheckoutService`, use the factory to charge a customer. The service should never instantiate a processor directly.

**Focus:** Adding a fourth provider later must require changing *only* the factory.

---

### Challenge 1.3 – Build a Complex Search Query

The handout introduced a `PlaylistQueryBuilder` to avoid telescoping constructors.

**Your task:**
1. Create a `ProductSearchBuilder` class.
2. Support fluent setters for: `category`, `minPrice`, `maxPrice`, `inStockOnly`, `sortBy`, and `limit`.
3. The `build()` method should validate that `minPrice <= maxPrice` and that `limit` is between 1 and 100.
4. Return an immutable `ProductSearch` object from `build()`.
5. Demonstrate chaining: `new ProductSearchBuilder().category("electronics").minPrice(50).maxPrice(500).inStockOnly().build()`.

**Focus:** Partial, messy state lives inside the builder; the finished object is clean.

---

### Challenge 1.4 – Email Notification Builder

You need to construct emails that have many optional fields.

**Your task:**
1. Create an `EmailBuilder` with setters for: `to`, `cc` (array, additive), `bcc` (array, additive), `subject`, `body`, `attachment` (array, additive), and `priority`.
2. Each setter returns `this` for chaining.
3. `build()` must ensure `to` and `subject` are provided; otherwise throw.
4. Return an `Email` object that has no setters (read-only).

**Focus:** Builders shine when construction has many optional parts and cross-field validation.

---

### Challenge 1.5 – Safe Singleton: Configuration Store

The handout showed an `AudioEngine` singleton that must be initialized once.

**Your task:**
1. Create a `ConfigStore` singleton that holds application settings (e.g. `apiUrl`, `theme`, `maxItemsPerPage`).
2. Use a private constructor and a static `initialize(settings)` method.
3. Throw if `initialize` is called twice or if `getInstance()` is called before initialization.
4. Add a `get(key)` and `set(key, value)` method on the instance.
5. Show two different modules calling `ConfigStore.getInstance()` and reading the same values.

**Focus:** Singleton is justified here because the configuration must be globally consistent.

---

### Challenge 1.6 – Singleton vs. Instance Passing

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

**Focus:** Recognize when Singleton is a trap and when it is truly needed.

---

### Challenge 1.7 – Mini Project: Compose a Media Pipeline

**Your task:**
1. Build a tiny media pipeline using **all three** creational patterns:
   - **Factory:** `createSource(type: "file" | "network" | "microphone")` returns a `MediaSource`.
   - **Builder:** `PipelineBuilder` lets you add sources, filters, and sinks step by step, then `build()` returns a `MediaPipeline`.
   - **Singleton:** `HardwareContext` ensures only one audio device handle exists.
2. Write a `main()` function (or test) that wires everything together at a composition root.

**Focus:** See how the three patterns work together in one flow.

---

## Part 2: Structural Patterns

> **Goal:** Practice connecting objects so they can be swapped, tested, and extended independently.

---

### Challenge 2.1 – Repository Interface + Two Implementations

The handout showed a `TrackRepository` with PostgreSQL and in-memory implementations.

**Your task:**
1. Define a `UserRepository` interface with: `findById(id)`, `findByEmail(email)`, `save(user)`, and `delete(id)`.
2. Implement `SqlUserRepository` that uses a fake SQL client (a mock object is fine).
3. Implement `InMemoryUserRepository` using a `Map<number, User>`.
4. Write a `UserService` that depends only on the `UserRepository` interface.
5. Show the same `UserService` being instantiated once with the SQL repo and once with the in-memory repo.

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
2. Extract a repository interface and move the SQL into a `PostgresInvoiceRepository`.
3. Make `InvoiceService` depend on the interface.
4. Write a unit test using an in-memory repository that returns hard-coded lines.

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

**Focus:** The class never chooses its dependency; the composition root does.

---

### Challenge 2.4 – Decorator: Retry Logic

The handout showed a `@measure` decorator for timing.

**Your task:**
1. Write a `@retry(maxAttempts: number, delayMs: number)` class-method decorator.
2. If the decorated method throws, catch the error, wait `delayMs`, and try again up to `maxAttempts`.
3. Apply it to a ` flakyApiCall()` method that fails randomly (e.g. `Math.random() < 0.7`).
4. Log each attempt and the final outcome.

**Focus:** Decorators add cross-cutting behavior without touching the original method body.

---

### Challenge 2.5 – Decorator: Result Caching

**Your task:**
1. Write a `@cache(ttlMs: number)` decorator that memoizes method results.
2. The decorator should store results in a `Map` keyed by JSON-stringified arguments.
3. If the same arguments are passed again within `ttlMs`, return the cached value instead of calling the original method.
4. Apply it to an expensive `calculatePrimes(max: number)` method and show the speed difference.

**Focus:** Reusable behavior (caching) is kept outside the business logic.

---

### Challenge 2.6 – Decorator + DI Together

**Your task:**
1. Create a `DatabaseClient` interface with a `query(sql: string)` method.
2. Implement `PostgresClient`.
3. Write a `LoggingClient` *decorator* (object wrapper, not a TypeScript decorator) that wraps any `DatabaseClient` and logs every query before forwarding it.
4. At the composition root, wrap the real `PostgresClient` with `LoggingClient` before injecting it into a `UserRepository`.
5. Show that the repository works unchanged, but queries are now logged.

**Focus:** Decorators can be objects too, and they compose beautifully with DI.

---

### Challenge 2.7 – Mini Project: Pluggable Reporting Engine

**Your task:**
1. Build a reporting system using **all three** structural patterns:
   - **Repository:** `ReportRepository` with `findByDateRange(start, end)`; provide SQL and in-memory versions.
   - **Dependency Injection:** `ReportEngine` receives a `ReportRepository` and a `Formatter` via constructor.
   - **Decorator:** Write a `MetricsReportRepository` decorator that counts how many queries were executed and logs the average fetch time.
2. Write a composition root that wires the production stack (SQL repo → metrics decorator → report engine → JSON formatter) and a test stack (in-memory repo → report engine → CSV formatter).

**Focus:** See how structure allows you to swap, test, and observe every layer independently.

---

## Part 3: Behavioral Patterns

> **Goal:** Practice runtime coordination: notifying, swapping algorithms, and enforcing valid state transitions.

---

### Challenge 3.1 – Event Bus for a Task Board

The handout showed a `MusicPlayer` event bus with `subscribe` and `emit`.

**Your task:**
1. Create a typed `TaskBoardEvent` union with events like `{ type: "task.created"; taskId: string; title: string }`, `{ type: "task.moved"; taskId: string; column: "todo" | "doing" | "done" }`, and `{ type: "task.deleted"; taskId: string }`.
2. Build a `TaskBoardBus` class with `subscribe(listener)` and `emit(event)`.
3. Write three independent subscribers:
   - `AuditLogger` – logs every event to console.
   - `SlackNotifier` – sends a message only when a task moves to "done".
   - `AnalyticsTracker` – counts how many tasks were created.
4. Emit a few events and verify each subscriber reacted correctly.

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

**Focus:** Observer removes the need to modify the subject when new listeners appear.

---

### Challenge 3.3 – Strategy: Shipping Cost Calculator

The handout showed `PlaybackStrategy` for swapping algorithms at runtime.

**Your task:**
1. Define a `ShippingStrategy` interface with `calculate(weight: number, distance: number): number`.
2. Implement three strategies:
   - `StandardShipping` – flat rate + per-kg fee.
   - `ExpressShipping` – higher flat rate + per-kg fee + distance surcharge.
   - `FreeShipping` – always returns 0.
3. Create a `Cart` class that holds a `ShippingStrategy` and has `setStrategy()` and `checkout()` methods.
4. Demonstrate switching strategies at runtime and show the different costs.

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

**Focus:** Strategies are small, interchangeable, and composable.

---

### Challenge 3.5 – State Machine: Traffic Light

The handout used a state machine for a music player. A traffic light is the classic analogy.

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

**Focus:** Boolean flags (`isApproved`, `isRejected`) would allow impossible combinations; the state machine does not.

---

### Challenge 3.7 – Mini Project: Smart Home Controller

**Your task:**
1. Build a small smart-home system using **all three** behavioral patterns:
   - **Observer:** A `HomeEventBus` emits events like `motion.detected`, `temperature.high`, `door.opened`. The `SecuritySystem`, `HVACController`, and `NotificationApp` subscribe independently.
   - **Strategy:** The `HVACController` uses a `ClimateStrategy` interface. Provide `EnergySavingStrategy` and `ComfortStrategy`; let the user switch at runtime.
   - **State Machine:** The `SecuritySystem` has states `disarmed`, `arming`, `armed`, `triggered`. Only valid transitions are allowed (e.g. cannot go from `disarmed` directly to `triggered`).
2. Write a simulation script that emits events, switches climate strategies, and triggers security state transitions.

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

---

## Tips Before You Start

- **Do not over-engineer.** If a challenge can be solved in 20 lines, write 20 lines. Patterns are tools, not trophies.
- **Write tests.** Every challenge is easier to verify with a small test or a `console.log` simulation.
- **Read the error messages.** State machines should throw clear errors on illegal transitions. Factories should throw on unknown types. Builders should throw on invalid combinations.
- **Refactor, don’t rewrite.** Several challenges start with “bad" code and ask you to refactor it. Keep the original behavior intact while improving the structure.

Happy coding!
