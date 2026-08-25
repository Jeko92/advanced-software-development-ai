/**
 * Challenge 3.5 — State Machine: Traffic Light
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 3, Challenge 3.5)
 *
 * Same shape as ../../patterns/behavioural/state-machine.ts's player
 * example, applied to the classic traffic-light analogy.
 *
 * TODO:
 * - `TrafficLightState` — `'red' | 'red-yellow' | 'green' | 'yellow'`
 * - `TrafficLightEvent` — `'timer'`
 * - transition table: `red → red-yellow → green → yellow → red`
 * - `TrafficLight` class with `state` and `transition(event)`, throwing on
 *   an illegal transition
 * - `getState()` method
 * - a loop that cycles through 10 transitions, printing the state each time
 * - also send a deliberately wrong event and confirm it throws
 *
 * Focus: the state machine enforces that only one light is on at a time and
 * the sequence is always valid.
 */
import assert from 'node:assert';

type TrafficLightState = 'red' | 'red-yellow' | 'green' | 'yellow';
type TrafficLightEvent = 'timer';

const transitions: Record<
  TrafficLightState,
  Partial<Record<TrafficLightEvent, TrafficLightState>>
> = {
  red: { timer: 'red-yellow' },
  'red-yellow': { timer: 'green' },
  green: { timer: 'yellow' },
  yellow: { timer: 'red' },
};

class TrafficLight {
  private state: TrafficLightState = 'red';

  getState(): TrafficLightState {
    return this.state;
  }

  transition(event: TrafficLightEvent): void {
    const next = transitions[this.state][event];
    if (!next) {
      throw new Error(`Illegal transition: ${event} from ${this.state}`);
    }
    this.state = next;
  }
}

// ---- Demonstration ----------------------------------------------------------

function main(): void {
  const light = new TrafficLight();

  console.log('--- 10 timer transitions ---');
  for (let i = 1; i <= 10; i++) {
    light.transition('timer');
    console.log(`${i}: ${light.getState()}`);
  }

  // red -(1)-> red-yellow -(2)-> green -(3)-> yellow -(4)-> red -(5)-> ...
  // The cycle length is 4, so after 10 transitions from 'red' the light is
  // on 'green' (transition #2, #6, and #10 all land there).
  assert.strictEqual(light.getState(), 'green');
  console.log('Test passed: after 10 transitions the light is on green\n');

  // TrafficLightEvent only has one legal value ('timer'), so there should
  // be no illegal transitions in a correct table — send a wrong event
  // anyway (cast past the type system, since TS wouldn't let this compile
  // otherwise) and confirm the machine still rejects it.
  assert.throws(
    () => light.transition('malfunction' as TrafficLightEvent),
    /Illegal transition: malfunction from green/,
  );
  console.log('Test passed: an unknown event throws a clear error');

  console.log(
    '🎉 Only one light is on at a time, and the sequence never breaks',
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
