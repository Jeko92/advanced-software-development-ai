# Software Design Patterns - Structural Patterns

The creational patterns dealt with _building_ objects. Structural patterns deal
with _connecting_ them. The problems show up the moment a class hardcodes which
other class it works with: a service that creates its own database client, a
method that calls a specific logger, a class that has to be rewritten to swap
one piece for another. The class works, but it can only work in exactly one
configuration. Some code bases look like a drawer full of cables tangled
together: pulling on one drags the entire bundle with it. Structural patterns
help you to sort everything neatly and decouple the individual moving parts.

If you don't use structural patterns, two main consequences arise:

- The class is hard to test. To test a method that creates its own database
  client, you have to provide a real database. There is no seam in the code
  where you can slip a fake one in.
- The class is hard to change. Swapping the database, the logger, or the
  formatter means editing the class itself, even though the change has nothing
  to do with what the class is trying to do.

Structural patterns introduce small connecting points between objects, so the
parts can be replaced one at a time. The patterns covered here are:

| Pattern              | Solves                                                                   | Mental Model                                                    |
|:---------------------|:-------------------------------------------------------------------------|:----------------------------------------------------------------|
| Repository           | Hiding the details of how data is stored behind a clean method surface   | A librarian: you ask for a book, not for a shelf coordinate     |
| Dependency Injection | Letting outside code decide which concrete pieces a class will work with | Ordering the Chef's menu. The chef decides which dish to serve. |
| Decorator            | Adding extra behaviour around a method without modifying the method      | Toppings on a pizza: the base stays the same                    |

## Repository

A repository is an object that hides the details of how data is stored. The rest
of the program asks it for things using domain language (`findById`,
`findByArtist`), and the repository figures out how to fetch them.

Without a repository, the data access code leaks straight into your business
logic. The class below talks directly to PostgreSQL, knows the SQL it needs, and
assumes a particular table schema:

```typescript
class PlayerService {
  async play(trackId: number) {
    const { rows } = await pgPool.query(
      "SELECT id, title, artist, format FROM tracks WHERE id = $1",
      [trackId],
    );

    const track = rows[0];
    if (!track) throw new Error(`Track ${trackId} not found`);
    AudioEngine.getInstance().play(track);
  }
}
```

A few problems are baked into that:

- `PlayerService` is bound to PostgreSQL. Moving to a different database means
  rewriting every method like this one.
- Testing this method requires a real PostgreSQL instance.
- The SQL query mixes a data concern with the player concern in one place.

The repository pattern starts by writing down the data access contract as a
TypeScript interface:

```typescript
export interface Track {
  id: number;
  title: string;
  artist: string;
  format: AudioFormat;
}

export interface TrackRepository {
  findById(id: number): Promise<Track | null>;
  findByArtist(artist: string): Promise<Track[]>;
  save(track: Track): Promise<void>;
}
```

The interface lists what the rest of the program needs from the data layer, in
domain terms. No SQL appears in it.

You then write one or more concrete implementations of that interface. A real
one for production, and usually a simple in-memory one for tests:

```typescript
export class PostgresTrackRepository implements TrackRepository {
  constructor(private readonly pg: Pool) {}

  async findById(id: number) {
    const { rows } = await this.pg.query(
      "SELECT id, title, artist, format FROM tracks WHERE id = $1",
      [id],
    );
    return rows[0] ?? null;
  }
  // ... other methods
}

export class InMemoryTrackRepository implements TrackRepository {
  private tracks = new Map<number, Track>();

  async findById(id: number) {
    return this.tracks.get(id) ?? null;
  }
  // ... other methods
}
```

Code that depends only on the `TrackRepository` interface does not care which
implementation it gets. In production it gets the PostgreSQL one. In tests it
gets the in-memory one, which starts in a fresh known state and answers in
microseconds.

Looking back at the MVC pattern, one might confuse the Model with the
Repository. The key distinction is that a model object is your data and rules
(_what_ a user is), while a repository manages how that data is stored and
retrieved (_how_ you find a user). You could swap your repository from SQL to an
API without touching the model at all.

## Dependency Injection

Repositories solve one half of the coupling problem. The other half is how the
calling class gets hold of one. If `PlayerService` constructs its own
`PostgresTrackRepository` inside, the class is still locked to PostgreSQL:

```typescript
class PlayerService {
  private repo = new PostgresTrackRepository(pgPool);
  private engine = AudioEngine.getInstance();

  async play(trackId: number) {
    const track = await this.repo.findById(trackId);
    if (track) this.engine.play(track);
  }
}
```

Dependency Injection (DI) is the rule that a class should never create its own
dependencies. They are passed in from outside, almost always through the
constructor. The class declares what it needs by type, and somebody else decides
which concrete object to provide. This can be done by the developer manually in
simple cases, or by a so called DI framework in complex ones, which adds the
correct dependencies automatically.

```typescript
class PlayerService {
  constructor(
    private readonly tracks: TrackRepository,
    private readonly engine: AudioEngine,
  ) {}

  async play(trackId: number) {
    const track = await this.tracks.findById(trackId);
    if (track) this.engine.play(track);
  }
}
```

Notice that the parameter types are interfaces (`TrackRepository`) rather than
concrete classes. `PlayerService` knows the contract it depends on, and nothing
else.

The decision about which concrete classes to actually use is moved to a single
place at program startup, usually called the **composition root**. The
composition root is the spot where the program builds and wires together its
main objects, before the rest of the code starts running.

```typescript
const service = new PlayerService(
  new PostgresTrackRepository(pgPool),
  AudioEngine.getInstance(),
);

const fakeEngine = { play: () => {} } as AudioEngine;
const testService = new PlayerService(
  new InMemoryTrackRepository(),
  fakeEngine,
);
```

The production wiring uses real implementations. The test wiring uses cheap,
isolated ones. The class itself does not change between the two.

## Decorators

A decorator wraps an existing method or object and adds behaviour around it. The
wrapped method still does its original work, with extra behaviour layered on
top.

This is useful for concerns that apply to many methods but do not belong inside
any of them: logging, timing, caching, retrying, permission checks. Putting
these inline buries the actual business logic under boilerplate. A decorator
keeps the original method clean and adds the extra behaviour as a separate,
reusable piece. Another important usecase are DI frameworks, which often make
use of decorators to add the correct dependencies automatically.

TypeScript has built-in syntax for class method decorators. A decorator is a
function that receives the original method and returns a replacement method. The
replacement can do anything before or after calling the original. The code below
shows the inner workings of a decorator. In practice, you generelly would only
use decorators, not write them yourself.

```typescript
function measure(originalMethod: any, context: ClassMethodDecoratorContext) {
  const name = String(context.name);
  return function (this: any, ...args: any[]) {
    const start = performance.now();
    const result = originalMethod.call(this, ...args);
    const elapsed = performance.now() - start;
    console.log(`[measure] ${name} took ${elapsed.toFixed(2)}ms`);
    return result;
  };
}

@measure
function countToMillion() {
  let count = 0;
  console.log("starting.");
  while (count < 1000000) {
    count++;
  }
  console.log("finished.");
}

countToMillion(); // logs "starting." and "finished." and "[measure] countToMillion took x ms"
```

Reading the function top to bottom: `measure` is called once when the class or
function is defined. It returns a new function that takes the same arguments as
the original. That returned function records the time, calls the original with
`originalMethod.call(this, ...args)`, then logs how long the call took.

This is how you would apply a `@measure` decorator to a method:

```typescript
class PostgresTrackRepository implements TrackRepository {
  constructor(private readonly pg: Pool) {}

  @measure
  async findById(id: number) {
    const { rows } = await this.pg.query(
      "SELECT id, title, artist, format FROM tracks WHERE id = $1",
      [id],
    );
    return rows[0] ?? null;
  }
}
```

The end result is that `findById` only contains the database query. The timing
behaviour lives in a separate, reusable function that can be attached to any
other method that needs them.

## Resources

- [Structural patterns on Refactoring Guru](https://refactoring.guru/design-patterns/structural-patterns)
- [Inversion of Control Containers and the Dependency Injection pattern (Martin Fowler)](https://martinfowler.com/articles/injection.html)
