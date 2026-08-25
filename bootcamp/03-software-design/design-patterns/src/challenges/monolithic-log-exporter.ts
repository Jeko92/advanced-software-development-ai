/**
 * The Monolithic Log Exporter — refactor to Repository + DI + Factory
 *
 * Source: docs/learning/03-software-design/software-design-patterns/challenges.md
 *         ("The monolithic log exporter")
 *
 * Starting point (violates SRP by owning its own DB connection, and OCP via
 * a hardcoded if/else format chain) — write this version first, then
 * refactor it below:
 *
 *   function getMockDB() {
 *     return {
 *       query(select: string): string[] {
 *         return ['lorem', 'ipsum', 'dolor'];
 *       },
 *     };
 *   }
 *
 *   class LogExporter {
 *     async exportLogs(format: 'json' | 'csv' | 'xml') {
 *       const db = getMockDB();
 *       const logs = await db.query('SELECT * FROM system_logs');
 *       if (format === 'json') return JSON.stringify(logs);
 *       else if (format === 'csv') return logs.join('\n');
 *       else if (format === 'xml') return `<logs>${logs.join('')}</logs>`;
 *       else throw new Error('Unknown format');
 *     }
 *   }
 *
 * TODO — refactor in two steps:
 * 1. Repository + DI: extract a `LogRepository` interface and inject it
 *    into `LogExporter`, so the class no longer knows about `getMockDB`.
 * 2. Factory: extract the formatting logic into an `ExporterFactory`
 *    function/class that takes the format string and returns a concrete
 *    formatter (`JsonFormatter`, `CsvFormatter`, `XmlFormatter`). Update
 *    `LogExporter` to use the factory instead of the if/else chain.
 *
 * Keep the original behavior intact — same inputs should produce the same
 * output before and after the refactor.
 */

// ---- Step 1: Repository + DI ---------------------------------------------
// `LogExporter` no longer knows how logs are fetched or stored — it only
// depends on this interface.

interface LogRepository {
  findSystemLogs(): Promise<string[]>;
}

class MockLogRepository implements LogRepository {
  async findSystemLogs(): Promise<string[]> {
    return ['lorem', 'ipsum', 'dolor'];
  }
}

// ---- Step 2: Factory --------------------------------------------------
// Adding a new format means adding a formatter + a factory branch, not
// touching `LogExporter` — this is the Open/Closed half of the fix.

type LogFormat = 'json' | 'csv' | 'xml';

interface LogFormatter {
  format(logs: string[]): string;
}

class JsonLogFormatter implements LogFormatter {
  format(logs: string[]): string {
    return JSON.stringify(logs);
  }
}

class CsvLogFormatter implements LogFormatter {
  format(logs: string[]): string {
    return logs.join('\n');
  }
}

class XmlLogFormatter implements LogFormatter {
  format(logs: string[]): string {
    return `<logs>${logs.join('')}</logs>`;
  }
}

class ExporterFactory {
  static create(format: LogFormat): LogFormatter {
    switch (format) {
      case 'json':
        return new JsonLogFormatter();

      case 'csv':
        return new CsvLogFormatter();

      case 'xml':
        return new XmlLogFormatter();

      default:
        throw new Error('Unknown format');
    }
  }
}

// ---- LogExporter -----------------------------------------------------
// Depends only on `LogRepository` (injected) and `ExporterFactory` — no
// database or formatting details live here anymore.

class LogExporter {
  constructor(private readonly logRepository: LogRepository) {}

  async exportLogs(format: LogFormat): Promise<string> {
    const logs = await this.logRepository.findSystemLogs();
    const formatter = ExporterFactory.create(format);
    return formatter.format(logs);
  }
}

// ---- Demonstration -----------------------------------------------------

async function main(): Promise<void> {
  const exporter = new LogExporter(new MockLogRepository());

  console.log('json ->', await exporter.exportLogs('json'));
  console.log('csv  ->', await exporter.exportLogs('csv'));
  console.log('xml  ->', await exporter.exportLogs('xml'));

  try {
    // Bypass the type system to exercise the same runtime guard the
    // original if/else chain had.
    await exporter.exportLogs('yaml' as LogFormat);

    console.error('❌ Test failed: expected an error');
  } catch (error) {
    console.log('Test — expected error (unknown format):');
    console.error(error);
  }
}

// Only self-run this demo when the file is executed directly — not when
// another file imports these classes, so importers don't inherit this
// module's console output as a surprising side effect.
if (import.meta.url === `file://${process.argv[1]}`) {
  void main();
}
