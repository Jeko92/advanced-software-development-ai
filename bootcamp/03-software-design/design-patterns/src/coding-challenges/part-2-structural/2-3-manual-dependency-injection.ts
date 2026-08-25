/**
 * Challenge 2.3 — Manual Dependency Injection
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 2, Challenge 2.3)
 *
 * TODO:
 * - `Notifier` interface, `EmailNotifier implements Notifier`,
 *   `SmsNotifier implements Notifier`
 * - `AlertService` receiving a `Notifier` via constructor, with a
 *   `notify(message)` method
 * - two composition roots: `composeProduction()` returns an `AlertService`
 *   wired with `EmailNotifier`; `composeTest()` returns one wired with
 *   `SmsNotifier`
 * - call `composeTest()`, trigger an alert, and confirm the SMS notifier
 *   was the one used
 *
 * Focus: the class never chooses its dependency; the composition root does.
 */
import assert from 'node:assert';

interface Notifier {
  send(message: string): void;
}

class EmailNotifier implements Notifier {
  send(message: string): void {
    console.log(`[Email] ${message}`);
  }
}

class SmsNotifier implements Notifier {
  send(message: string): void {
    console.log(`[SMS] ${message}`);
  }
}

// AlertService never chooses its Notifier — it only knows the interface.
class AlertService {
  constructor(private readonly notifier: Notifier) {}

  notify(message: string): void {
    this.notifier.send(message);
  }
}

// ---- Composition roots -----------------------------------------------------

function composeProduction(): AlertService {
  return new AlertService(new EmailNotifier());
}

function composeTest(): AlertService {
  return new AlertService(new SmsNotifier());
}

// ---- Demonstration ----------------------------------------------------------

function main(): void {
  composeProduction().notify('Disk usage above 90%');

  const logged: string[] = [];
  const originalLog = console.log;
  console.log = (message: string) => logged.push(message);

  try {
    composeTest().notify('Server unreachable');
  } finally {
    console.log = originalLog;
  }

  const [firstLoggedMessage] = logged;
  assert.strictEqual(logged.length, 1);
  assert.ok(firstLoggedMessage?.startsWith('[SMS]'));
  console.log(firstLoggedMessage);
  console.log('Test passed: composeTest() used SmsNotifier, not EmailNotifier');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
