# Software Design Patterns - Creational Patterns

Creating an object looks easy at first. You call `new SomeClass(...)` and you
are done. Creational patterns help you to improve on this fundamental principle.
They split the job in two. One part of the program says "I need this kind of
thing". A different part decides which concrete class to build and how to wire
it up. That separation has three practical benefits:

- The decision about which version of an object to use can wait until the
  program is running, when it has the information needed to choose.
- Complicated setup steps live in one place instead of being repeated wherever
  the object is needed.
- Shared or limited resources (database pools, hardware handles) can be reused
  instead of being constructed over and over.

This file covers the three creational patterns you will run into most often:

| Pattern   | Solves                                              | Mental model                                 |
|:----------|:----------------------------------------------------|:---------------------------------------------|
| Factory   | Picking between several concrete classes at runtime | Ordering from a menu                         |
| Builder   | Constructing an object with many optional parts     | Building a sandwich one ingredient at a time |
| Singleton | Guaranteeing exactly one instance of something      | One key for one lock                         |

## Factory

A factory is a function or class whose only job is to build other objects. The
code that needs the object asks the factory, and the factory decides which
concrete class to return.

The reason you would want this becomes obvious after seeing what happens without
it. Imagine a music player that has to decode different audio formats. Each
format (`mp3`, `flac`, `wav`) needs a different decoder class:

```typescript
class Player {
  load(file: AudioFile) {
    let decoder: Decoder;
    if (file.format === "mp3") decoder = new Mp3Decoder();
    else if (file.format === "flac") decoder = new FlacDecoder();
    else if (file.format === "wav") decoder = new WavDecoder();
    else throw new Error(`Unsupported format: ${file.format}`);

    decoder.decode(file.buffer);
  }
}
```

The `Player` class only wants to play audio. It is now also responsible for
knowing every decoder class that exists. The next time someone adds support for
`.ogg` files, the `Player` class has to change. This breaks a rule called the
**Open/Closed Principle**, which says that classes should be open to new
features (like a new audio format) without needing changes to existing code.

Pulling the decision into a factory function fixes that. The factory takes the
format and returns a `Decoder`. A `Decoder` is an _interface_, which here means
a contract describing what methods a decoder must have. Every concrete decoder
class implements that exact interface, so the `Player` only has to know about
the interface.

```typescript
export interface Decoder {
  decode ( buffer: Buffer ): AudioFrame[];
}

export function createDecoder ( format: AudioFormat ): Decoder {
  switch ( format ) {
    case "mp3":
      return new Mp3Decoder();
    case "flac":
      return new FlacDecoder();
    case "wav":
      return new WavDecoder();
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

class Player {
  load ( file: AudioFile ) {
    const decoder = createDecoder(file.format);
    decoder.decode(file.buffer);
  }
}
```

Adding `.ogg` support is now two changes: write an `OggDecoder` class and add
one case to the factory. The `Player` class stays exactly as it was.

## Builder

A builder is a separate object whose job is to assemble another object step by
step. You call methods on the builder to set each piece, and then a final
`build()` method hands you the finished result.

The problem builders solve is the _telescoping constructor_. That is the name
for a constructor that takes a long list of optional arguments, where most calls
pass `undefined` for the values they do not need:

```typescript
const query = new PlaylistQuery(
  undefined, // year
  "Daft Punk", // artist
  undefined, // minDuration
  240, // maxDuration
  true, // shuffle
);
```

Reading that call site means counting commas. What does `240` mean? What does
`true` mean? You have to look at the constructor definition to find out.

A builder replaces the long argument list with a series of well-named method
calls. Each method records one piece of state and returns the builder itself. By
this, you can chain these calls together which makes the code more readable.

```typescript
export class PlaylistQueryBuilder {
  private filters: Partial<QueryFilters> = {};

  releasedAfter ( year: number ): this {
    this.filters.year = year;
    return this;
  }

  byArtist ( name: string ): this {
    this.filters.artist = name;
    return this;
  }

  shorterThan ( seconds: number ): this {
    this.filters.maxDuration = seconds;
    return this;
  }

  shuffled (): this {
    this.filters.shuffle = true;
    return this;
  }

  build (): PlaylistQuery {
    if ( this.filters.minDuration && this.filters.maxDuration ) {
      if ( this.filters.minDuration > this.filters.maxDuration ) {
        throw new Error("Invalid duration range");
      }
    }
    return new PlaylistQuery(this.filters);
  }
}

const query = new PlaylistQueryBuilder()
  .byArtist("Daft Punk")
  .shorterThan(240)
  .shuffled()
  .build();
```

Three things are worth noting in the builder above:

- Each setter returns `this` which enables the method chaining. The return type
  `this` is what makes the chained calls type-check correctly.
- `build()` is the only place a `PlaylistQuery` is actually constructed. That
  makes it the right place to run validation that depends on more than one
  field, like checking that `minDuration` is not greater than `maxDuration`.
- The finished `PlaylistQuery` can be immutable. Any messy partial state stays
  inside the builder.

> **Note:** TypeScript already has a lighter option for this problem. Passing a
> single configuration object, like
> `new PlaylistQuery({ artist: "Daft Punk", shuffle: true })`, gives you named
> arguments and optional fields without writing a builder class. Reach for a
> real
> builder when construction needs to happen in sequential steps, when validation
> rules cross multiple fields, or when you need to pass a half-built object
> around
> to other functions before finalising it.

## Singleton

A singleton is a class that allows only one instance to exist for the whole
program. Code anywhere can ask the class for that instance through a static
method, usually called `getInstance()`.

A genuine use case is something that owns a real-world resource that cannot be
shared. A sound card, for example, can only be opened by one process at a time.
If two different parts of the program each tried to claim it, the audio output
would crash or play garbage. The audio engine that talks to the sound card is a
good fit for a singleton:

```typescript
export class AudioEngine {
  private static instance: AudioEngine | null = null;

  private constructor ( private readonly sampleRate: number ) {
  }

  static initialize ( sampleRate: number ): AudioEngine {
    if ( this.instance ) {
      throw new Error("AudioEngine is already initialized");
    }
    this.instance = new AudioEngine(sampleRate);
    return this.instance;
  }

  static getInstance (): AudioEngine {
    if ( !this.instance ) {
      throw new Error("AudioEngine must be initialized first");
    }
    return this.instance;
  }

  play ( buffer: AudioFrame[] ): void {
    // talks to the sound card
  }
}
```

A few details in the example:

- The `constructor` is `private`, so nobody outside the class can call
  `new AudioEngine()`. The class controls how its own instance is created.
- The `static instance` field holds the single copy. The first call to
  `initialize` fills it. Every later call to `getInstance` returns the same
  object.
- The static helpers throw clear errors if the engine is used before it is
  initialised, or initialised twice.

Any part of the program can now call `AudioEngine.getInstance().play(...)`, and
every call ends up at the same engine.

### Where Singleton goes wrong

The trap is using Singleton for things that are merely convenient to access
globally. A common offender is a logger:

```typescript
class TrackService {
  play(track: Track) {
    Logger.getInstance().info(`Played ${track.title}`);
    // ...
  }
}
```

Looking at `TrackService` from the outside, you cannot tell that it depends on a
logger. Its constructor takes nothing. The dependency is hidden inside the
method body. When you write a unit test for `TrackService`, the real `Logger`
runs underneath, and it might write to disk or send network requests during the
test.

The better default is to pass dependencies in through the constructor (the next
chapter covers exactly that, under Dependency Injection). Save Singleton for
cases where having two instances would actually break something.

## Resources

- [Creational patterns on Refactoring Guru](https://refactoring.guru/design-patterns/creational-patterns)
