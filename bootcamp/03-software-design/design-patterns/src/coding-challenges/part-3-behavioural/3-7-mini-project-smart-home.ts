/**
 * Challenge 3.7 — Mini Project: Smart Home Controller
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 3, Challenge 3.7)
 *
 * Combines all three behavioural patterns from this part.
 *
 * TODO:
 * - Observer: `HomeEventBus` emitting events like `motion.detected`,
 *   `temperature.high`, `door.opened`; `SecuritySystem`, `HVACController`,
 *   `NotificationApp` each subscribe independently
 * - Strategy: `HVACController` uses a `ClimateStrategy` interface —
 *   `EnergySavingStrategy` and `ComfortStrategy`, switchable at runtime
 * - State Machine: `SecuritySystem` has states `disarmed`, `arming`,
 *   `armed`, `triggered`, with only valid transitions allowed (e.g. no
 *   direct `disarmed` → `triggered`)
 * - a simulation script that emits events, switches climate strategies, and
 *   triggers security transitions
 *
 * Focus: see how behavioral patterns keep runtime coordination clean,
 * flexible, and safe.
 */
import assert from 'node:assert';

// ---- Observer: HomeEventBus -------------------------------------------------

type HomeEvent =
  | { type: 'motion.detected'; room: string }
  | { type: 'temperature.high'; celsius: number }
  | { type: 'door.opened'; door: string };

type Listener = (event: HomeEvent) => void;

class HomeEventBus {
  private listeners: Listener[] = [];

  subscribe(listener: Listener): void {
    this.listeners.push(listener);
  }

  emit(event: HomeEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

// ---- Strategy: HVACController's climate behavior ---------------------------

interface ClimateStrategy {
  adjust(currentCelsius: number): string;
}

class EnergySavingStrategy implements ClimateStrategy {
  private readonly target = 26;

  adjust(currentCelsius: number): string {
    if (currentCelsius > this.target) {
      return `nudging fan on toward ${this.target}°C (currently ${currentCelsius}°C)`;
    }
    return `holding steady at ${currentCelsius}°C`;
  }
}

class ComfortStrategy implements ClimateStrategy {
  private readonly target = 22;

  adjust(currentCelsius: number): string {
    if (currentCelsius > this.target) {
      return `full AC toward ${this.target}°C (currently ${currentCelsius}°C)`;
    }
    return `holding steady at ${currentCelsius}°C`;
  }
}

class HVACController {
  constructor(private strategy: ClimateStrategy) {}

  setStrategy(strategy: ClimateStrategy): void {
    this.strategy = strategy;
  }

  // Subscribed to HomeEventBus — reacts only to temperature.high, delegates
  // the actual decision to whichever ClimateStrategy is currently active.
  handle = (event: HomeEvent): void => {
    if (event.type === 'temperature.high') {
      console.log(`[hvac] ${this.strategy.adjust(event.celsius)}`);
    }
  };
}

// ---- State Machine: SecuritySystem ------------------------------------------

type SecurityState = 'disarmed' | 'arming' | 'armed' | 'triggered';
type SecurityEvent = 'arm' | 'armed' | 'disarm' | 'trigger' | 'reset';

const securityTransitions: Record<
  SecurityState,
  Partial<Record<SecurityEvent, SecurityState>>
> = {
  disarmed: { arm: 'arming' },
  arming: { armed: 'armed', disarm: 'disarmed' },
  armed: { trigger: 'triggered', disarm: 'disarmed' },
  triggered: { reset: 'disarmed' },
};

class SecuritySystem {
  private state: SecurityState = 'disarmed';

  getState(): SecurityState {
    return this.state;
  }

  transition(event: SecurityEvent): void {
    const next = securityTransitions[this.state][event];
    if (!next) {
      throw new Error(`Illegal transition: ${event} from ${this.state}`);
    }
    console.log(`[security] ${this.state} --${event}--> ${next}`);
    this.state = next;
  }

  // Subscribed to HomeEventBus — motion or an opened door while armed
  // trips the alarm, going through the same transition table (and its
  // guardrails) as a manual transition() call would.
  handle = (event: HomeEvent): void => {
    const intruderSignal =
      event.type === 'motion.detected' || event.type === 'door.opened';

    if (intruderSignal && this.state === 'armed') {
      this.transition('trigger');
    }
  };
}

// ---- Observer: a third, independent subscriber -----------------------------

class NotificationApp {
  readonly notifications: string[] = [];

  handle = (event: HomeEvent): void => {
    let message: string;
    switch (event.type) {
      case 'motion.detected':
        message = `Motion detected in ${event.room}`;
        break;
      case 'temperature.high':
        message = `Temperature is high: ${event.celsius}°C`;
        break;
      case 'door.opened':
        message = `Door opened: ${event.door}`;
        break;
    }
    this.notifications.push(message);
    console.log(`[notify] ${message}`);
  };
}

// ---- Simulation --------------------------------------------------------------

function main(): void {
  const bus = new HomeEventBus();
  const security = new SecuritySystem();
  const hvac = new HVACController(new EnergySavingStrategy());
  const notifications = new NotificationApp();

  bus.subscribe(security.handle);
  bus.subscribe(hvac.handle);
  bus.subscribe(notifications.handle);

  console.log('--- Door opens while disarmed: just a notification ---');
  bus.emit({ type: 'door.opened', door: 'front' });
  assert.strictEqual(security.getState(), 'disarmed');

  console.log('\n--- Arming the security system ---');
  security.transition('arm');
  assert.strictEqual(security.getState(), 'arming');
  security.transition('armed');
  assert.strictEqual(security.getState(), 'armed');

  console.log('\n--- Hot day while armed: HVAC reacts, security stays armed ---');
  bus.emit({ type: 'temperature.high', celsius: 28 });
  assert.strictEqual(security.getState(), 'armed');

  console.log('\n--- Motion detected while armed: security auto-triggers ---');
  bus.emit({ type: 'motion.detected', room: 'living room' });
  assert.strictEqual(security.getState(), 'triggered');
  console.log(
    'Test passed: motion while armed triggered the alarm — HomeEventBus never knew SecuritySystem existed',
  );

  security.transition('reset');
  assert.strictEqual(security.getState(), 'disarmed');

  console.log('\n--- Direct disarmed -> triggered is illegal ---');
  assert.throws(
    () => security.transition('trigger'),
    /Illegal transition: trigger from disarmed/,
  );
  console.log('Test passed: cannot jump straight from disarmed to triggered');

  console.log('\n--- Switching HVAC strategy at runtime ---');
  hvac.setStrategy(new ComfortStrategy());
  bus.emit({ type: 'temperature.high', celsius: 24 });

  assert.strictEqual(notifications.notifications.length, 4);
  console.log(
    '\nTest passed: NotificationApp independently logged all 4 events',
  );

  console.log(
    '\n🎉 Observer, Strategy, and State Machine all coordinated safely',
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
