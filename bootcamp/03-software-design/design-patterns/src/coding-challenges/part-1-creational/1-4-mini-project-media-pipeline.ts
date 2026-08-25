/**
 * Challenge 1.4 — Mini Project: Compose a Media Pipeline
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 1, Challenge 1.4)
 *
 * Combines all three creational patterns from this part in one flow.
 *
 * TODO:
 * - Factory: `createSource(type: 'file' | 'network' | 'microphone'): MediaSource`
 * - Builder: `PipelineBuilder` — add sources, filters, and sinks step by
 *   step, then `build(): MediaPipeline`
 * - Singleton: `HardwareContext` ensuring only one audio device handle
 *   exists
 * - a `main()` function (or a plain script body) that wires all three
 *   together at a composition root and runs the pipeline
 *
 * Focus: see how the three patterns work together in one flow.
 */
import assert from 'node:assert';

// ---- Contracts ---------------------------------------------------------

interface MediaSource {
  readonly name: string;
  read(): string;
}

interface MediaFilter {
  readonly name: string;
  apply(data: string): string;
}

interface MediaSink {
  readonly name: string;
  write(data: string): void;
}

interface MediaPipeline {
  run(): void;
}

type SourceType = 'file' | 'network' | 'microphone';

// ---- Singleton: HardwareContext -----------------------------------------

class HardwareContext {
  private static instance: HardwareContext | null = null;

  private constructor(private readonly deviceId: string) {}

  static initialize(deviceId: string): HardwareContext {
    if (this.instance) {
      throw new Error('HardwareContext is already initialized');
    }
    this.instance = new HardwareContext(deviceId);
    return this.instance;
  }

  static getInstance(): HardwareContext {
    if (!this.instance) {
      throw new Error('HardwareContext must be initialized first');
    }
    return this.instance;
  }

  getDeviceHandle(): string {
    return `handle:${this.deviceId}`;
  }
}

// ---- Factory: createSource ----------------------------------------------

class FileSource implements MediaSource {
  readonly name = 'file';

  constructor(private readonly path: string) {}

  read(): string {
    return `data from file ${this.path}`;
  }
}

class NetworkSource implements MediaSource {
  readonly name = 'network';

  constructor(private readonly url: string) {}

  read(): string {
    return `data from ${this.url}`;
  }
}

class MicrophoneSource implements MediaSource {
  readonly name = 'microphone';

  read(): string {
    const handle = HardwareContext.getInstance().getDeviceHandle();
    return `data from microphone via ${handle}`;
  }
}

function createSource(type: SourceType): MediaSource {
  switch (type) {
    case 'file':
      return new FileSource('/some/path');
    case 'network':
      return new NetworkSource('https://example.com');
    case 'microphone':
      return new MicrophoneSource();
    default:
      throw new Error(`Unsupported source type: ${type}`);
  }
}

// ---- Filters & sinks (kept simple; consumed by the builder) -------------

class UppercaseFilter implements MediaFilter {
  readonly name = 'uppercase';

  apply(data: string): string {
    return data.toUpperCase();
  }
}

class ConsoleSink implements MediaSink {
  readonly name = 'console';

  write(data: string): void {
    console.log(`From Console: ${data}`);
  }
}

class FakeSink implements MediaSink {
  readonly name = 'fake';
  messages: string[] = [];

  write(data: string): void {
    this.messages.push(data);
  }
}

// ---- Builder: PipelineBuilder --------------------------------------------

class MediaPipelineImpl implements MediaPipeline {
  constructor(
    private readonly source: MediaSource,
    private readonly filters: MediaFilter[],
    private readonly sinks: MediaSink[],
  ) {}

  run(): void {
    let data = this.source.read();
    for (const filter of this.filters) {
      data = filter.apply(data);
    }

    for (const sink of this.sinks) {
      sink.write(data);
    }
  }
}

class PipelineBuilder {
  private source: MediaSource | undefined;
  private filters: MediaFilter[] = [];
  private sinks: MediaSink[] = [];

  addSource(source: MediaSource): this {
    this.source = source;
    return this;
  }

  addFilter(filter: MediaFilter): this {
    this.filters.push(filter);
    return this;
  }

  addSink(sink: MediaSink): this {
    this.sinks.push(sink);
    return this;
  }

  build(): MediaPipeline {
    if (!this.source) {
      throw new Error('PipelineBuilder requires a source');
    }

    if (!this.sinks.length) {
      throw new Error('PipelineBuilder requires at least one sink');
    }

    return new MediaPipelineImpl(
      this.source,
      [...this.filters],
      [...this.sinks],
    );
  }
}

// ---- Composition root -----------------------------------------------------

function main(): void {
  HardwareContext.initialize('default-audio-device');
  const micSource = createSource('microphone');
  const pipeline = new PipelineBuilder()
    .addSource(micSource)
    .addFilter(new UppercaseFilter())
    .addSink(new ConsoleSink())
    .build();

  pipeline.run();
}

main();

// ---- Checks ---------------------------------------------------------------
// Note: HardwareContext is a true singleton, so the "already initialized"
// guard is exercised here (after main() has already called initialize()
// once) rather than by calling initialize() a second time ourselves.

// Test 1 — HardwareContext guards both directions.
assert.throws(
  () => HardwareContext.initialize('another-device'),
  /HardwareContext is already initialized/,
);
console.log('Test 1 passed: HardwareContext blocks double initialization');

const hardwareA = HardwareContext.getInstance();
const hardwareB = HardwareContext.getInstance();
assert.strictEqual(hardwareA, hardwareB);
console.log('Test 2 passed: getInstance() always returns the same instance');

// Test 3 — createSource() factory produces the right concrete behavior.
assert.strictEqual(createSource('file').read(), 'data from file /some/path');
assert.strictEqual(
  createSource('network').read(),
  'data from https://example.com',
);
assert.strictEqual(
  createSource('microphone').read(),
  'data from microphone via handle:default-audio-device',
);
assert.throws(
  () => createSource('bluetooth' as SourceType),
  /Unsupported source type: bluetooth/,
);
console.log('Test 3 passed: createSource() covers every source type');

// Test 4 — PipelineBuilder.build() validates its required parts.
assert.throws(
  () => new PipelineBuilder().addSink(new FakeSink()).build(),
  /PipelineBuilder requires a source/,
);
assert.throws(
  () => new PipelineBuilder().addSource(createSource('file')).build(),
  /PipelineBuilder requires at least one sink/,
);
console.log('Test 4 passed: PipelineBuilder rejects incomplete pipelines');

// Test 5 — full pipeline run, captured with a FakeSink instead of the
// console so the result can be asserted on directly.
const fakeSink = new FakeSink();
const testPipeline = new PipelineBuilder()
  .addSource(createSource('file'))
  .addFilter(new UppercaseFilter())
  .addSink(fakeSink)
  .build();

testPipeline.run();

assert.strictEqual(fakeSink.messages.length, 1);
assert.strictEqual(fakeSink.messages[0], 'DATA FROM FILE /SOME/PATH');
console.log('Test 5 passed: pipeline reads, filters, and writes correctly');

// Test 6 — regression test for the array-aliasing bug: reusing a builder
// after build() must not retroactively change an already-built pipeline.
const sharedBuilder = new PipelineBuilder()
  .addSource(createSource('file'))
  .addSink(fakeSink);

const pipelineBeforeExtraFilter = sharedBuilder.build();
sharedBuilder.addFilter(new UppercaseFilter());
const pipelineAfterExtraFilter = sharedBuilder.build();

fakeSink.messages = [];
pipelineBeforeExtraFilter.run();
pipelineAfterExtraFilter.run();

assert.strictEqual(fakeSink.messages[0], 'data from file /some/path');
assert.strictEqual(fakeSink.messages[1], 'DATA FROM FILE /SOME/PATH');
console.log(
  'Test 6 passed: pipelines built earlier are unaffected by later builder calls',
);

console.log('🎉 All media pipeline tests passed!');
