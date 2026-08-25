/**
 * Challenge 1.3.1 — Safe Singleton: Configuration Store
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 1, Challenge 1.3.1)
 *
 * Builds on the same shape as ../../patterns/creational/singleton.ts's
 * `AudioEngine`, applied to app configuration instead.
 *
 * TODO:
 * - `ConfigStore` singleton holding settings (`apiUrl`, `theme`,
 *   `maxItemsPerPage`, ...)
 * - `private` constructor + `static initialize(settings)`, throwing if
 *   called twice
 * - `static getInstance()`, throwing if called before `initialize`
 * - instance methods `get(key)` and `set(key, value)`
 * - show two different "modules" (two separate call sites) both calling
 *   `ConfigStore.getInstance()` and reading the same values
 *
 * Focus: Singleton is justified here because the configuration must be
 * globally consistent.
 */
import assert from 'node:assert';

interface Settings {
  apiUrl: string;
  theme: string;
  maxItemsPerPage: number;
}

export class ConfigStore {
  private static instance: ConfigStore | null = null;

  private constructor(private settings: Settings) {}

  static initialize(settings: Settings): ConfigStore {
    if (this.instance) {
      throw new Error('ConfigStore is already initialized');
    }
    this.instance = new ConfigStore(settings);
    return this.instance;
  }

  static getInstance(): ConfigStore {
    if (!this.instance) {
      throw new Error('ConfigStore must be initialized first.');
    }
    return this.instance;
  }

  get<K extends keyof Settings>(key: K): Settings[K] {
    return this.settings[key];
  }

  set<K extends keyof Settings>(key: K, value: Settings[K]): void {
    this.settings[key] = value;
  }
}

const moduleA = () => {
  const store = ConfigStore.getInstance();
  console.log('Module A sees apiUrl:', store.get('apiUrl'));
};

const moduleB = () => {
  const store = ConfigStore.getInstance();
  console.log('Module B sees apiUrl:', store.get('apiUrl'));
};

try {
  ConfigStore.getInstance();

  console.error('❌ Test 1 failed: expected an error');
} catch (error) {
  console.log('Test 1 — expected error:');
  console.error(error);
}

assert.throws(
  () => ConfigStore.getInstance(),
  /ConfigStore must be initialized first/,
);

const config = ConfigStore.initialize({
  apiUrl: 'https://api.example.com',
  theme: 'dark',
  maxItemsPerPage: 20,
});

assert.ok(config instanceof ConfigStore);
console.log(`Test 2 ${config instanceof ConfigStore}`);

const instance = ConfigStore.getInstance();

assert.strictEqual(instance, config);
console.log(`Test 3 ${assert.strictEqual(instance, config)}`);

try {
  ConfigStore.initialize({
    apiUrl: 'https://other-api.example.com',
    theme: 'light',
    maxItemsPerPage: 10,
  });

  console.error('❌ Test 4 failed: expected an error');
} catch (error) {
  console.log('Test 4 — expected error:');
  console.error(error);
}

assert.throws(
  () =>
    ConfigStore.initialize({
      apiUrl: 'https://other-api.example.com',
      theme: 'light',
      maxItemsPerPage: 10,
    }),
  /ConfigStore is already initialized/,
);

const callSiteA = ConfigStore.getInstance();
const callSiteB = ConfigStore.getInstance();

assert.strictEqual(callSiteA, callSiteB);
assert.strictEqual(callSiteA, config);

assert.strictEqual(config.get('apiUrl'), 'https://api.example.com');
assert.strictEqual(config.get('theme'), 'dark');
assert.strictEqual(config.get('maxItemsPerPage'), 20);
console.log('Test 5 passed: get() returns initialized values');

callSiteA.set('theme', 'light');
callSiteA.set('maxItemsPerPage', 50);

assert.strictEqual(callSiteB.get('theme'), 'light');
assert.strictEqual(callSiteB.get('maxItemsPerPage'), 50);
console.log('Test 6 passed: set() is visible through every reference');

moduleA();
moduleB();

console.log('🎉 All ConfigStore tests passed!');
