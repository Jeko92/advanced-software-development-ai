# Software Design Patterns - Challenges

These exercises test your ability to apply design patterns in realistic
scenarios. The first three ask you to design a solution from scratch. The last
one gives you existing, tightly coupled code that you should refactor using the
concepts from this session.

## Summoning Circle

Imagining implementing a creature summoning feature for a fantasy game. The
player can interact with a summoning circle, injects ingredients of a specific
type and the summoning circle creates a magic creature of that type.

Implement the `SummoningCirclce` with the factory pattern:

1. define an interface `Creature` with `name`: string and a method `useAbility`:
   which prints a message what the creature does.
2. Create multiple classes which implement the creature interface. Some
   suggestions: a `Dragon` class with the ability breathing fire, a `Phoenix`
   class with ability `Reborn`, a `Unicorn` class with ability
   `Dancing on rainbow`.
3. Create the Factory class `SummoningCircle` with a method called
   `summon(ingredientType: string)`. Depending on the ingridient type (`fire`,
   `air`, `sparkles`, etc) a different Creature class is created and returned.
4. Use the Summoning circle with different ingredients.

## The API request builder

Design a flexible way to construct HTTP requests without a single,
optional-heavy configuration object.

1. Implement a `RequestBuilder` class that allows method chaining for setting
   the HTTP method, URL, headers, query parameters, and a JSON body.
2. The `build()` method must validate the configuration before returning the
   final immutable `Request` object. It should throw an error if the method is
   `POST` but no body was provided, or if the URL has not been set.

## E-commerce state machine

Build an `Order` class that manages its lifecycle using a state machine.

1. Define the exact states: `Draft`, `Paid`, `Shipped`, `Delivered`,
   `Cancelled`.
2. Define the legal events: `checkout`, `payment_received`, `dispatch`,
   `confirm_delivery`, `cancel`.
3. Implement the following possible state changes:

- `Draft` can change to `Paid` and `Cancelled`,
- `Paid` can change to `Shipped` and `Cancelled`
- `Shipped can change to `Delivered`

## The monolithic log exporter

The class below violates the Single Responsibility Principle by managing its own
database connection, and violates the Open/Closed Principle by using a hardcoded
`if/else` chain to pick the output format.

```typescript
function getMockDB() {
  return {
    query(select: string): string[] {
      return ["lorem", "ipsum", "dolor"];
    },
  };
}

class LogExporter {
  async exportLogs(format: "json" | "csv" | "xml") {
    const db = getMockDB();
    const logs = await db.query("SELECT * FROM system_logs");

    if (format === "json") {
      return JSON.stringify(logs);
    } else if (format === "csv") {
      return logs
        .map((l) => `${l.timestamp},${l.level},${l.message}`)
        .join("\n");
    } else if (format === "xml") {
      return `<logs>${logs.map((l) => `<log>${l.message}</log>`).join("")}</logs>`;
    } else {
      throw new Error("Unknown format");
    }
  }
}
```

Refactor in two steps:

1. Repository and DI: Extract a `LogRepository` interface. Inject it into
   `LogExporter` so the class no longer knows about the database connection.
2. Factory: Extract the formatting logic into an `ExporterFactory` function or
   class. It should take the `format` string and return a concrete formatter
   instance (`JsonFormatter`, `CsvFormatter`, `XmlFormatter`). Update
   `LogExporter` to rely on the factory instead of inline conditionals.
