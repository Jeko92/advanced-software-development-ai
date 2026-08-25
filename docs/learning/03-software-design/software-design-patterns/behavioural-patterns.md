# Software Design Patterns - Behavioural Patterns

After looking at how class instances can be created in a clean and maintainable
way, behavioural patterns deal with what those parts do at runtime, and how they
coordinate. The typical symptoms behavioural patterns address are familiar from
any growing codebase:

- A core class collects more and more references to other systems, because every
  new feature needs to be notified when something happens.
- A method picks between several algorithms using a flag, and grows a longer
  `if/else` chain every time a new option is added.
- A class tracks its current situation with several boolean fields, and nothing
  stops those fields from ending up in nonsensical combinations.

Each of the three patterns in this file targets one of those symptoms.

| Pattern       | Solves                                                                | Mental hook                                                                                                               |
|:--------------|:----------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------|
| Observer      | Notifying several systems about an event without naming them directly | A radio station: anyone can tune in                                                                                       |
| Strategy      | Swapping the algorithm a class uses while the program is running      | A power tool that takes different drill bits                                                                              |
| State Machine | Making the available methods depend on the object's current state     | A book reservation system: a book can only be reserved if it's available, and it can only be returned if it's checked out |

## Observer

An analogy for the Observer Pattern would be a Newsletter or a YouTube Channel.

One object (the "Subject") maintains a list of interested parties (the
"Observers"). When something happens, the Subject sends a broadcast to everyone
on that list. The Subject doesn't care what the Observers actually do with the
information; it just sends the update. The Observer pattern lets one object
announce that something happened, and any number of other objects, the observers
subscribers, to it, without the announcer knowing who they are.

The pattern earns its place in the moment a class starts collecting unrelated
dependencies just to keep them informed. Below, the `Player` knows about
scrobbling, recommendations, and analytics, even though its real job is to play
music:

```typescript
class Player {
  constructor(
    private readonly scrobbler: Scrobbler,
    private readonly recommender: RecommendationEngine,
    private readonly analytics: Analytics,
  ) {}

  play(track: Track) {
    AudioEngine.getInstance().play(track);
    this.scrobbler.recordPlay(track);
    this.recommender.update(track);
    this.analytics.track("track.played", { id: track.id });
  }
}
```

Every new feature that wants to react to playback (pausing background downloads,
dimming the screensaver, anything) means a new constructor argument and a new
method call inside `play`. The `Player` slowly turns into a control panel for
half the application.

The Observer pattern flips the relationship around. The `Player` does not call
the other systems. It just announces what happened to a pool of subscribers. The
other systems subscribe to the events they care about. In computing such a
shared communication pathway can be called a bus.

```typescript
type PlayerEvent =
  | { type: "track.played"; track: string }
  | { type: "track.finished"; track: string };

type Listener = (event: PlayerEvent) => void;

class MusicPlayer {
  private listeners: Listener[] = [];

  subscribe(listener: Listener) {
    this.listeners.push(listener);
  }

  emit(event: PlayerEvent) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

// Usage
const player = new MusicPlayerBus();

player.subscribe((event: PlayerEvent) => {
  if (event.type === "track.played") {
    console.log("Now playing:", event.track);
  } else if (event.type === "track.finished") {
    console.log("Track finished:", event.track);
  }
});

player.emit({ type: "track.played", track: "Bohemian Rhapsody" });
```

The two methods on this bus are:

- `subscribe(handler)` registers a function to be called whenever an event is
  emitted.
- `emit(event)` calls all registered listeners with the given event.

Wiring up the subscribers happens once, at the composition root. Adding or
removing a listener is now a change in the wiring code, not in the `Player`.

## Strategy

The Strategy pattern stores an algorithm inside an object, so the caller can
swap one algorithm for another at runtime.

The pattern targets the case where a method picks between several behaviours
based on a mode flag. Each new mode means another branch in the same method:

```typescript
class Player {
  mode: "sequential" | "shuffle" | "repeat-one" = "sequential";

  nextTrack(currentIndex: number, playlistLength: number): number {
    if (this.mode === "sequential") {
      return currentIndex + 1 < playlistLength ? currentIndex + 1 : -1;
    } else if (this.mode === "shuffle") {
      return Math.floor(Math.random() * playlistLength);
    } else {
      return currentIndex;
    }
  }
}
```

Strategy moves each branch into its own small class that implements a shared
interface. The interface lists what every strategy must be able to do:

```typescript
export interface PlaybackStrategy {
  next(currentIndex: number, playlistLength: number): number;
}

export class Sequential implements PlaybackStrategy {
  next(currentIndex: number, playlistLength: number) {
    return currentIndex + 1 < playlistLength ? currentIndex + 1 : -1;
  }
}

export class Shuffle implements PlaybackStrategy {
  next(_currentIndex: number, playlistLength: number) {
    return Math.floor(Math.random() * playlistLength);
  }
}
```

The `Player` holds a reference to whichever strategy is currently active and
delegates the calculation to it:

```typescript
class Player {
  constructor(private strategy: PlaybackStrategy) {}

  setStrategy(strategy: PlaybackStrategy) {
    this.strategy = strategy;
  }

  nextTrack(currentIndex: number, playlistLength: number): number {
    return this.strategy.next(currentIndex, playlistLength);
  }
}
```

Toggling shuffle from the UI is now one line:
`player.setStrategy(new Shuffle())`. Adding a new playback mode means writing
one new class. The `Player` does not change.

## State Machines

A State Machine pins an object to exactly one state at a time, from a fixed list
of allowed states, and writes down which transitions between those states are
legal. Anything else is rejected.

The State Machine can be roughly imaginged as a Traffic Light. It can only be
one color at a time (Red, Yellow, or Green). You also can’t jump from Red
directly to Green without following the rules of the road. In code, this pattern
stops an object from doing things it shouldn't be doing based on its current
situation.

The motivation is that loose boolean flags allow combinations the code never
intended:

```typescript
class Player {
  isLoading = false;
  isPlaying = false;
  isPaused = false;

  pause() {
    this.isPlaying = false;
    this.isPaused = true;
  }
}
```

Three booleans describe eight combinations, but only a few of them make sense.
There is no rule preventing `isPlaying` and `isPaused` from both being `true` at
the same time. Calling `pause()` while the player is still loading silently sets
`isPaused = true` even though the player has not actually started playing yet.

A state machine replaces those booleans with a single field that can only hold
one of a few values, plus a table describing which events are legal in each
state:

```typescript
type PlayerState = "idle" | "loading" | "playing" | "paused";
type PlayerEvent = "load" | "ready" | "pause" | "resume" | "stop" | "error";

const transitions: Record<
  PlayerState,
  Partial<Record<PlayerEvent, PlayerState>>
> = {
  idle: { load: "loading" },
  loading: { ready: "playing", error: "idle" },
  playing: { pause: "paused", stop: "idle" },
  paused: { resume: "playing", stop: "idle" },
};

class Player {
  private state: PlayerState = "idle";

  transition(event: PlayerEvent) {
    const next = transitions[this.state][event];
    if (!next)
      throw new Error(`Illegal transition: ${event} from ${this.state}`);
    this.state = next;
  }

  pause() {
    this.transition("pause");
  }
}
```

The transition table reads like a small specification. From `idle`, the only
allowed event is `load`, which moves the player into `loading`. From `loading`,
only `ready` or `error` is allowed, and so on. Any event that does not appear in
the current row throws an error.

Calling `pause()` while the player is `idle` no longer silently corrupts the
state. It throws a clear runtime error, naming exactly the illegal transition
that was attempted. The set of impossible states stops being something the team
has to remember and starts being something the code enforces.

## Final thoughts on design patterns

Learning patterns comes with a real risk: once you know the vocabulary, every
problem starts to look like it needs a pattern. Three rules of thumb to push
back against that:

1. **Do not abstract for an imagined future.** A 30-line script that talks to
   one SQLite file does not need a Repository. Two tightly coupled consumers do
   not need an Observer. Wait until the code shows you it needs the abstraction.
   Reversing course is usually cheap; removing a wrong abstraction is not.

2. **Solve the actual pain.** It is tempting to reach for whichever pattern you
   have just learned. Six new decorators rarely fix a method that nobody
   understands any more. If you cannot name the specific problem in one
   sentence, the pattern is probably the wrong move.

3. **Avoid complexity for the sake of complexity.** Adding structure to your
   code can feel save, but every added complexity comes with its own cost. If
   you cannot find good reasons for the abstraction, it has not earned its place
   in the codebase.

## Resources

- [Behavioural patterns on Refactoring Guru](https://refactoring.guru/design-patterns/behavioral-patterns)
