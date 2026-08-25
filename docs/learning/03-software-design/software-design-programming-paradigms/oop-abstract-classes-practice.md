# Practice: Interface + Abstract Class + Composition

These 12 challenges all drill the same three-part OOP shape you used in
`book-library-notification-system.ts`. Re-deriving it in a new domain each time
is the point — don't just find/replace the names from the original.

## The shape, every time

1. **An interface** — always exactly 2 members: one action, one identity/label
   getter.
2. **An abstract class implementing that interface** — one method is fully
   written (shared logic, usually a string formatter). One method is
   `abstract` (varies per subclass — the real side effect, or a
   subclass-specific number/boolean). The interface's "action" method is written
   *once*, concretely, in the abstract class, and it calls the formatter then
   the abstract method. That's the **Template Method**
   pattern.
3. **An orchestrator class that does NOT extend the abstract class** — it holds
   an array typed to the interface (`items: TheInterface[]`) and loops over it.
   That's **composition**, not inheritance. Watch out: not every orchestrator
   below just "calls the same method on everything and moves on" — several use a
   different loop shape on purpose (see the note at the end of each entry).

Work through them roughly in order. 1 is a warm-up (same shape as the original,
new domain). 2–9 each bend one assumption. 10–12 remove scaffolding or combine
several twists at once.

---

## 1. Order Status Update System

*Warm-up — closest to the original.*

- `OrderNotifiable` interface:
  `notify(orderId: string, status: string, item: string): void`,
  `getChannelName(): string`.
- `BaseOrderNotifier` abstract, implements `OrderNotifiable`:
  - concrete
    `formatMessage(status: "shipped" | "cancelled", item: string): string` →
    `"Your order for 'Widget' has shipped."` /
    `"Your order for 'Widget' was cancelled."`
  - abstract `deliver(orderId: string, message: string): void`
  - concrete `notify(...)` calls `formatMessage` then `deliver`
- Subclasses: `PushNotifier` (logs `Push to order #${orderId}: ${message}`),
  `WebhookNotifier` (logs `Webhook for order #${orderId}: ${message}`).
- `OrderDispatchService` takes `OrderNotifiable[]`;
  `dispatch(orderId, status, item)` loops and calls `notify` on every channel.
- **Orchestrator shape:** plain broadcast — same as the original.
- Test: dispatch `"shipped"` for `"Widget"` to order `"ORD-9"` through both
  channels, then a second dispatch of `"cancelled"` for `"Mouse"` to order
  `"ORD-10"`.

---

## 2. Employee Payroll Deduction System

*Twist: the abstract method returns a `number`, not `void`.*

- `Deductible` interface: `apply(baseSalary: number): number`,
  `getDeductionName(): string`.
- `BaseDeduction` abstract, implements `Deductible`:
  - `private` concrete `describe(baseSalary: number): string` — builds its
    text from `this.getDeductionName()` and `baseSalary`, e.g.
    `"Applying tax Deduction to $5000"` for `TaxDeduction`. Resist hardcoding
    the deduction's name as a literal string here — if `describe` always says
    `"Tax"`, `InsuranceDeduction` will print that same wrong name too, since it
    inherits this method unchanged.
  - `protected abstract calculateAmount(baseSalary: number): number` — returns
    *the amount to deduct*, not the amount left over; keep that distinction
    straight when you write the two subclasses' formulas
  - concrete `apply(baseSalary)` logs the result of `describe`, then returns
    `baseSalary - this.calculateAmount(baseSalary)`
- Subclasses: `TaxDeduction` (10% of salary), `InsuranceDeduction` (flat $200).
- `PayrollService` takes `Deductible[]`;
  `runPayroll(remainingAmount: number): string` — runs the chain, then both
  logs and returns `` `Take home amount ${reducedAmount}` `` (a formatted
  string, not the bare number).
- **Orchestrator shape:** *chain* — each deduction's output salary feeds into
  the next deduction's input. Not a simple side-effect loop; you need a running
  variable (or `reduce`) that gets reassigned each iteration.
- Test: run payroll for a $5000 base salary through both deductions, log the
  final take-home amount.

---

## 3. File Export System

*Twist: the concrete method returns a string instead of only logging.*

- `Exportable` interface: `export(recordCount: number): string`,
  `getFormatName(): string`.
- `BaseExporter` abstract, implements `Exportable`:
  - concrete `wrapHeader(recordCount: number): string` — builds its text from
    `this.getFormatName()`, e.g. `"Exporting 12 records as json"` for
    `JsonExporter`. Same trap as Challenge 2's `describe`: hardcode the literal
    word `"JSON"` here instead of calling `getFormatName()`, and `CsvExporter`
    will claim to be exporting JSON too.
  - abstract `serialize(recordCount: number): string` (no `protected` here —
    it's implicitly public, unlike the `protected abstract` methods in the
    other challenges)
  - concrete `export(recordCount)` calls both and **returns** the combined
    string (no `console.log` here — the caller decides what to do with it)
- Subclasses: `JsonExporter`, `CsvExporter` — each `serialize` fabricates a
  short mock string.
- `ExportManager` takes `Exportable[]`;
  `exportAll(recordCount: number): string[]` — returns an array of results.
- **Orchestrator shape:** *collect* — map each channel's return value into an
  output array instead of using them for side effects.
- Test: export 12 records through both formats and print the resulting array.

---

## 4. Game Character Attack System

*Twist: the tempting first draft threads `damageType` through as a parameter on
`attack`/`attackAll`, the same way `event`/`status` were genuine per-call input
in Challenges 1 and 2. Here it isn't — a `damageType` argument on `attackAll`
lets a caller broadcast `'ranged'` to every attacker in the array, including a
`Sword`, which then gets described as shooting. Run the "is this identity or is
this input" test from Challenge 2 again: a `Sword` is always melee, for its
entire lifetime — that's identity, not input, so it shouldn't be a parameter at
all.*

- `Attacker` interface: `attack(targetName: string): void`,
  `getWeaponName(): string`.
- `BaseWeapon` abstract, implements `Attacker`:
  - `protected abstract formatAttackMessage(targetName: string): string` — each
    subclass builds its *entire* message itself, interpolating
    `this.getWeaponName()` into its own text (so the message includes the
    weapon's name, e.g. `"You slash Goblin with sword in melee combat!"` /
    `"You shoot Goblin with bow from range!"`). There isn't enough genuinely
    shared structure between those two sentences to justify one shared method
    branching on a damage-type flag — same reasoning as
    `calculateAmount`/`serialize` in Challenges 2 and 3: when the "shared"
    method is really just picking between two unrelated literals, let each
    subclass own its literal directly instead.
  - `protected abstract computeDamage(): number`
  - concrete `attack(targetName)` calls `formatAttackMessage`, then logs the
    message and the damage together in a single `console.log`:
    `` `${message}. Dealt ${this.computeDamage()} damage` `` — one combined
    line, not two separate logs
- Subclasses: `Sword` (melee, fixed damage), `Bow` (ranged, random damage in a
  range) — each `formatAttackMessage` should call `this.getWeaponName()` to
  interpolate its own name rather than hardcoding it a second time alongside the
  existing `getWeaponName()` implementation.
- `Battle` service takes `Attacker[]`; `attackAll(targetName: string): void`
  loops and calls `attack` on each — no shared damage type broadcast to the
  array, since every weapon already knows what it is.
- **Orchestrator shape:** plain broadcast.
- Test: attack `"Goblin"` (and try a second target, e.g. `"Cyclops"`) with both
  weapons.

---

## 5. Monitoring Alert System

*Twist: none — deliberately close to the original wording. Good test of careful
reading over pattern memorization.*

- `Alertable` interface:
  `alert(serviceId: string, severity: string, message: string): void`,
  `getSinkName(): string`.
- `BaseAlertSink` abstract, implements `Alertable`:
  - concrete
    `formatAlert(severity: "warning" | "critical", message: string): string` →
    `"[WARNING] message"` / `"[CRITICAL] message"`
  - abstract `dispatch(serviceId: string, formatted: string): void`
  - concrete `alert(...)` calls `formatAlert` then `dispatch`
- Subclasses: `SlackSink` (logs
  `Posting to #alerts for service ${serviceId}: ${formatted}`), `PagerDutySink`
  (logs `Paging on-call for service ${serviceId}: ${formatted}`).
- `AlertRouter` takes `Alertable[]`; `broadcast(serviceId, severity, message)`
  loops.
- **Orchestrator shape:** plain broadcast.
- Test: broadcast a `"critical"` alert for service `"payments-api"` through both
  sinks, then a second `"warning"` broadcast for service `"orders-api"`.

---

## 6. Subscription Billing Reminder System

*Twist: write a 3rd subclass yourself, unscaffolded.*

- `Remindable` interface:
  `remind(customerId: string, billingEvent: string, planName: string): void`,
  `channelLabel(): string`.
- `BaseReminder` abstract, implements `Remindable`:
  - concrete
    `craftMessage(billingEvent: "renewal" | "failed_payment", planName: string): string` →
    `"Your 'Pro' plan renews soon."` / `"Payment failed for your 'Pro' plan."`
  - abstract `deliver(customerId: string, message: string): void`
  - concrete `remind(...)` calls `craftMessage` then `deliver`
- Subclasses: `EmailReminder`, `InAppReminder` — then add a **third**,
  `PushReminder`, entirely on your own. No more guidance than that.
- `ReminderCenter` takes `Remindable[]`;
  `sendReminders(customerId, billingEvent, planName)` loops over all three.
- **Orchestrator shape:** plain broadcast.
- Test: send a `"failed_payment"` reminder for plan `"Pro"` to customer `"C-3"`
  through all three channels, then a second `"renewal"` reminder for plan
  `"Basic"` to customer `"C-4"`.

---

## 7. Checkout Discount Engine

*Twist: constructor arguments on the subclasses, plus a chained (not summed)
orchestrator.*

- `Discountable` interface: `apply(price: number): number`,
  `describe(): string`.
- `BaseDiscount` abstract, implements `Discountable`. This one has three
  abstract members instead of the usual one, because `describe()` — the
  interface's second member — is given a full concrete body here rather than
  being left to each subclass:
  - `private` concrete `#formatDescription(kind: "percentage" | "flat", value: number): string` →
    `"10% off."` / `"$5 off."`
  - concrete `describe(): string` — reads `this.getDiscountType()` and
    `this.getDiscountValue()` and passes them into `#formatDescription`
  - `abstract getDiscountType(): "percentage" | "flat"` and
    `abstract getDiscountValue(): number` — each subclass reports its own kind
    and value instead of implementing `describe()` itself
  - `protected abstract computeDiscount(price: number): number`
  - concrete `apply(price)` logs `this.describe()`, then returns
    `price - this.computeDiscount(price)`
- Subclasses: `PercentageDiscount(percent: number)`,
  `FlatDiscount(amount: number)` — both take a constructor argument this time.
  Think about how that argument gets stored and read inside `computeDiscount`,
  `getDiscountType`, and `getDiscountValue`.
- `CheckoutService` takes `Discountable[]`;
  `calculateFinalPrice(price: number): number`.
- **Orchestrator shape:** *chain* — every discount applies to the *previous*
  discount's output price, in sequence.
- Test: start with a $100 item and run it through a `PercentageDiscount(10)`
  then `FlatDiscount(5)` chain (final price $85), then run a fresh $100 item
  through the same discounts in the opposite order with different values —
  `FlatDiscount(5)` then `PercentageDiscount(20)` (final price $76) — to show
  that chain order changes the result. Log both final prices.

---

## 8. Shipping Carrier Rate Comparator

*Twist: the orchestrator picks a "winner" instead of using every result.*

- `RateQuotable` interface:
  `getQuote(weightKg: number, destination: string): number`,
  `getCarrierName(): string`.
- `BaseCarrier` abstract, implements `RateQuotable`:
  - concrete `formatQuoteLog(weightKg: number, destination: string): string` →
    `"Quoting DHL for 3kg to Berlin"`
  - abstract `calculateRate(weightKg: number): number`
  - concrete `getQuote(weightKg, destination)` logs the formatted quote, then
    returns `calculateRate(weightKg)`
- Subclasses: `DhlCarrier`, `UpsCarrier` — each with a different mock per-kg
  rate formula.
- `ShippingComparator` takes `RateQuotable[]`;
  `findCheapest(weightKg: number, destination: string): { carrier: string; price: number }`
  — throws if constructed with an empty array, since there'd be no quote to
  return.
- **Orchestrator shape:** *find-min* — loop through all quotes and keep track of
  the lowest one seen so far, plus which carrier produced it. (The
  implementation does this with `map` + `reduce` rather than a manual loop —
  either is a valid find-min.)
- Test: compare both carriers for a 3kg package to `"Berlin"`, log the cheapest
  option.

---

## 9. IoT Sensor Threshold Watcher

*Twist: the abstract method returns a `boolean`, and the concrete method
branches on it — here by picking which structured log call to make, not by
building a plain-text sentence.*

- `ThresholdWatcher` interface: `check(sensorId: string, value: number): void`,
  `getWatcherName(): string`.
- `BaseWatcher` abstract, implements `ThresholdWatcher`. There's no separate
  formatter method here — `check` does everything itself:
  - abstract `isBreach(value: number): boolean`
  - abstract `getWatcherName(): string`
  - concrete `check(sensorId, value)` computes `isBreach(value)`, builds one
    structured payload object —
    `{ timestamp, watcher: this.getWatcherName(), sensorId, value, status: breach ? 'BREACH' : 'OK' }`
    — and logs it **once**, as JSON: `console.error('⚠️ [SENSOR_ALERT]', JSON.stringify(payload))`
    if `isBreach(value)` is true, otherwise `console.info('✅ [SENSOR_INFO]', JSON.stringify(payload))`.
    There's no separate "reading" line followed by an "OK"/alert line — the
    breach check decides which single log call runs.
- Subclasses: `TemperatureWatcher` (breach if `value > 90`), `HumidityWatcher`
  (breach if `value < 20`).
- `SensorHub` takes `ThresholdWatcher[]`;
  `monitorAll(sensorId: string, value: number): void` loops and calls `check` on
  each.
- **Orchestrator shape:** plain broadcast — but notice the *branching* now lives
  inside the abstract class's concrete method, not the orchestrator. This is a
  different place to put an `if` than any earlier example.
- Test: monitor sensor `"S1"` with value `92` through both watchers via
  `SensorHub` (temperature breaches, humidity doesn't), then exercise each
  watcher individually with one passing and one failing value
  (`92`/`89` for temperature, `15`/`22` for humidity).

---

## 10. Chat Message Filter Pipeline

*Twist: chained string transforms, no numbers involved.*

- `Filterable` interface: `filter(text: string): string`,
  `getFilterName(): string`.
- `BaseFilter` abstract, implements `Filterable`:
  - `protected` concrete `logApplication(text: string): void` → logs
    `` `Applying ${this.getFilterName()} to: ...` `` followed by the raw
    `text` as a second `console.log` argument. It uses the lowercase filter
    name from `getFilterName()` (e.g. `"profanity"`, `"trim"`), not the class
    name.
  - abstract `transform(text: string): string`
  - concrete `filter(text)` calls `logApplication`, then returns
    `transform(text)`
- Subclasses: `ProfanityFilter` (checks each word against a small hardcoded
  list of banned words — `darn`, `heck`, `crap`, `shoot` — and replaces any
  match with `*` repeated to the word's length), `TrimFilter` (trims leading/
  trailing whitespace).
- `FilterPipeline` takes `Filterable[]`; `run(text: string): string`.
- **Orchestrator shape:** *chain*, like #2 and #7, but over strings instead of
  numbers — each filter's output text becomes the next filter's input text.
- Test: run `" darn this is broken "` through `TrimFilter` then
  `ProfanityFilter`, in that order, log the final cleaned text
  (`"darn this is broken"` → `"**** this is broken"`).

---

## 11. Recipe Nutrition Calculator

*Twist: sum aggregation — each ingredient calculates independently and the recipe adds the results together.*

* `NutrientSource` interface:

  * `getCalories(servings: number): number`
  * `getSourceName(): string`

* `BaseIngredient` abstract class:

  * abstract `caloriesPerServing(): number`
  * abstract `getSourceName(): string`
  * concrete `getCalories(servings)` → returns `caloriesPerServing() * servings`
  * protected `describePortion(servings)` helper — defined but not currently
    called anywhere (the call inside `getCalories` is commented out); it's
    there for a subclass or future log line to use.

* `ProteinIngredient` and `CarbIngredient`:

  * receive their name and calories per serving through the constructor.
  * implement `caloriesPerServing()` and `getSourceName()`.

* `RecipeBuilder`:

  * receives a recipe name and `NutrientSource[]`.
  * `totalCalories(servings)` displays the recipe and ingredients, calculates each ingredient independently, sums the results, and returns the total.

* **Orchestrator shape:** *sum* — ingredient results are independent and combined by addition, not chained.

### Test

Build a recipe with several protein and carbohydrate ingredients and calculate it for 3 servings.

Example:

```text
Pasta with Chicken
Ingredients: Chicken Breast, Salmon, Eggs, Rice, Potatoes, Pasta
3 servings — 4440 calories
```


---

## 12. Multi-Provider Payment Router

*Hardest — combines a boolean-returning abstract method with a short-circuiting
orchestrator.*

- `PaymentProcessor` interface:
  `charge(customerId: string, amount: number): boolean`,
  `getProviderName(): string`.
- `BasePaymentProcessor` abstract, implements `PaymentProcessor`:
  - concrete `logAttempt(customerId: string, amount: number): void` → logs
    `"Attempting to charge customer #C1 $50 via Stripe"`
  - abstract `executeCharge(customerId: string, amount: number): boolean`
  - concrete `charge(customerId, amount)` logs the attempt, calls
    `executeCharge`, logs whether it succeeded or failed, and returns that
    boolean
- Subclasses: `StripeProcessor` (always succeeds, mock), `PaypalProcessor` (mock
  rule: fails if `amount > 500`).
- `PaymentRouter` takes `PaymentProcessor[]`;
  `chargeFirstAvailable(customerId: string, amount: number): boolean`.
- **Orchestrator shape:** *first-success-wins* — try each processor in order,
  stop and return `true` as soon as one succeeds; only return `false` if every
  processor was tried and all failed. This is a genuinely different control flow
  from every earlier example (it needs an early `return`, not a loop that always
  runs to completion).
- Test: charge customer
  `"C1"` $50 through a router holding both processors (should succeed on the first one); then try charging $
  600 and reason through what should happen if you swap the processor order.

---

## Self-check for every challenge

Once you've written one, ask yourself these three questions before moving on —
they're the same three that came up debugging the original:

1. Does my abstract class actually say `implements TheInterface`, and does every
   interface member have either a concrete body or an `abstract`
   declaration in that class? (Not just "does it compile because the subclasses
   happen to cover it.")
2. Does my orchestrator class avoid `extends BaseSomething`? It should only ever
   hold an array of the *interface* type and call the interface's method on each
   item.
3. If I run the file, does the printed output actually match the exact strings
   the spec describes — not just "close enough"?
