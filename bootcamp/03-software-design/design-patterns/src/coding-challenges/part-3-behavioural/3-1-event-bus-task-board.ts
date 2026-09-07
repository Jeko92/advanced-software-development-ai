/**
 * Challenge 3.1 — Event Bus for a Task Board
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 3, Challenge 3.1)
 *
 * TODO:
 * - `TaskBoardEvent` union — e.g. `{ type: 'task.created'; taskId: string;
 *   title: string }`, `{ type: 'task.moved'; taskId: string; column: 'todo'
 *   | 'doing' | 'done' }`, `{ type: 'task.deleted'; taskId: string }`
 * - `TaskBoardBus` with `subscribe(listener)` and `emit(event)`
 * - three independent subscribers: `AuditLogger` (logs every event),
 *   `SlackNotifier` (only reacts when a task moves to `'done'`),
 *   `AnalyticsTracker` (counts `task.created` events)
 * - emit a handful of events and confirm each subscriber reacted correctly
 *
 * Focus: the task board doesn't know its subscribers exist.
 */
import assert from 'node:assert';

type TaskColumn = 'todo' | 'doing' | 'done';

type TaskBoardEvent =
  | { type: 'task.created'; taskId: string; title: string }
  | { type: 'task.moved'; taskId: string; column: TaskColumn }
  | { type: 'task.deleted'; taskId: string };

type Listener = (event: TaskBoardEvent) => void;

class TaskBoardBus {
  private listeners: Listener[] = [];

  subscribe(listener: Listener): void {
    this.listeners.push(listener);
  }

  emit(event: TaskBoardEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

// ---- Independent subscribers ------------------------------------------------

class AuditLogger {
  readonly log: string[] = [];

  handle = (event: TaskBoardEvent): void => {
    const message = `[audit] ${JSON.stringify(event)}`;
    this.log.push(message);
    console.log(message);
  };
}

class SlackNotifier {
  readonly messagesSent: string[] = [];

  handle = (event: TaskBoardEvent): void => {
    if (event.type === 'task.moved' && event.column === 'done') {
      const message = `[slack] Task ${event.taskId} moved to done 🎉`;
      this.messagesSent.push(message);
      console.log(message);
    }
  };
}

class AnalyticsTracker {
  createdCount = 0;

  handle = (event: TaskBoardEvent): void => {
    if (event.type === 'task.created') {
      this.createdCount++;
    }
  };
}

// ---- Demonstration ----------------------------------------------------------

function main(): void {
  const bus = new TaskBoardBus();

  const auditLogger = new AuditLogger();
  const slackNotifier = new SlackNotifier();
  const analyticsTracker = new AnalyticsTracker();

  bus.subscribe(auditLogger.handle);
  bus.subscribe(slackNotifier.handle);
  bus.subscribe(analyticsTracker.handle);

  bus.emit({ type: 'task.created', taskId: '1', title: 'Write proposal' });
  bus.emit({ type: 'task.created', taskId: '2', title: 'Review PR' });
  bus.emit({ type: 'task.moved', taskId: '1', column: 'doing' });
  bus.emit({ type: 'task.moved', taskId: '1', column: 'done' });
  bus.emit({ type: 'task.moved', taskId: '2', column: 'doing' });
  bus.emit({ type: 'task.deleted', taskId: '2' });

  assert.strictEqual(auditLogger.log.length, 6);
  console.log('Test passed: AuditLogger logged every single event');

  assert.strictEqual(slackNotifier.messagesSent.length, 1);
  assert.ok(slackNotifier.messagesSent[0]?.includes('Task 1 moved to done'));
  console.log(
    'Test passed: SlackNotifier reacted only to the move-to-done event',
  );

  assert.strictEqual(analyticsTracker.createdCount, 2);
  console.log(
    'Test passed: AnalyticsTracker counted exactly the created tasks',
  );

  console.log(
    '🎉 All three subscribers reacted independently — TaskBoardBus never knew any of them existed',
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
