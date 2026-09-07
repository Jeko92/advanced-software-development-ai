/**
 * Challenge 2.7 — Mini Project: Pluggable Reporting Engine
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 2, Challenge 2.7)
 *
 * Combines all three structural patterns from this part.
 *
 * TODO:
 * - Repository: `ReportRepository` — `findByDateRange(start, end)`; SQL and
 *   in-memory implementations
 * - Dependency Injection: `ReportEngine` receives a `ReportRepository` and
 *   a `Formatter` via constructor
 * - Decorator: `MetricsReportRepository` — wraps a `ReportRepository`,
 *   counting queries and logging the average fetch time
 * - a composition root wiring the "production" stack (SQL repo → metrics
 *   decorator → report engine → JSON formatter) and a "test" stack
 *   (in-memory repo → report engine → CSV formatter)
 *
 * Focus: see how structure lets you swap, test, and observe every layer
 * independently.
 */
import assert from 'node:assert';
import { Pool } from 'pg';

type ReportRecord = {
  id: string;
  date: string; // ISO date, e.g. '2024-01-15' — plain strings sort/compare
  amount: number; // correctly and avoid Date (de)serialization hassle.
};

// ---- Repository -------------------------------------------------------------

interface ReportRepository {
  findByDateRange(start: string, end: string): Promise<ReportRecord[]>;
}

class SqlReportRepository implements ReportRepository {
  constructor(private readonly db: Pool) {}

  async findByDateRange(start: string, end: string): Promise<ReportRecord[]> {
    // language=PostgreSQL
    // noinspection SqlResolve,SqlNoDataSourceInspection
    const { rows } = await this.db.query<ReportRecord>(
      'SELECT id, date, amount FROM reports WHERE date >= $1 AND date <= $2',
      [start, end],
    );
    return rows;
  }
}

class InMemoryReportRepository implements ReportRepository {
  constructor(private readonly records: ReportRecord[] = []) {}

  async findByDateRange(start: string, end: string): Promise<ReportRecord[]> {
    return this.records.filter(
      (record) => record.date >= start && record.date <= end,
    );
  }
}

// ---- Decorator: object wrapper, not a TS @decorator ------------------------

class MetricsReportRepository implements ReportRepository {
  private queryCount = 0;
  private totalTimeMs = 0;

  constructor(private readonly wrapped: ReportRepository) {}

  async findByDateRange(start: string, end: string): Promise<ReportRecord[]> {
    const startTime = performance.now();

    try {
      return await this.wrapped.findByDateRange(start, end);
    } finally {
      // Counted in `finally` so a failed/slow query still shows up in the
      // metrics — a query that errored out was still executed and still
      // took time, which is exactly what you'd want to observe.
      const elapsed = performance.now() - startTime;
      this.queryCount++;
      this.totalTimeMs += elapsed;
      const average = this.totalTimeMs / this.queryCount;
      console.log(
        `[metrics] query #${this.queryCount} took ${elapsed.toFixed(2)}ms (avg ${average.toFixed(2)}ms over ${this.queryCount} quer${this.queryCount === 1 ? 'y' : 'ies'})`,
      );
    }
  }
}

// ---- Dependency Injection: ReportEngine ------------------------------------

interface Formatter {
  format(records: ReportRecord[]): string;
}

class JsonFormatter implements Formatter {
  format(records: ReportRecord[]): string {
    return JSON.stringify(records, null, 2);
  }
}

class CsvFormatter implements Formatter {
  format(records: ReportRecord[]): string {
    const header = 'id,date,amount';
    const rows = records.map((r) => `${r.id},${r.date},${r.amount}`);
    return [header, ...rows].join('\n');
  }
}

// ReportEngine depends only on the two interfaces — it never knows which
// repository or formatter it's actually holding.
class ReportEngine {
  constructor(
    private readonly repo: ReportRepository,
    private readonly formatter: Formatter,
  ) {}

  async generateReport(start: string, end: string): Promise<string> {
    const records = await this.repo.findByDateRange(start, end);
    return this.formatter.format(records);
  }
}

// ---- Composition root -----------------------------------------------------

async function main(): Promise<void> {
  // "Test" stack: in-memory repo -> report engine -> CSV formatter.
  console.log('=== Test stack (in-memory + CSV) ===');

  const testRepo = new InMemoryReportRepository([
    { id: '1', date: '2024-01-05', amount: 100 },
    { id: '2', date: '2024-01-15', amount: 250 },
    { id: '3', date: '2024-02-01', amount: 75 },
  ]);
  const testEngine = new ReportEngine(testRepo, new CsvFormatter());

  const csvReport = await testEngine.generateReport('2024-01-01', '2024-01-31');
  console.log(csvReport);

  assert.strictEqual(
    csvReport,
    'id,date,amount\n1,2024-01-05,100\n2,2024-01-15,250',
  );
  console.log('Test passed: CSV report contains only the January records\n');

  // "Production" stack: SQL repo -> metrics decorator -> report engine ->
  // JSON formatter. Two calls, so the metrics decorator has more than one
  // data point to average over.
  console.log('=== Production stack (SQL + metrics + JSON) ===');

  const pgPool = new Pool({
    connectionString: 'postgres://localhost:5432/app',
  });
  const metricsRepo = new MetricsReportRepository(
    new SqlReportRepository(pgPool),
  );
  const productionEngine = new ReportEngine(metricsRepo, new JsonFormatter());

  try {
    const jsonReport = await productionEngine.generateReport(
      '2024-01-01',
      '2024-01-31',
    );
    console.log('generateReport ->', jsonReport);
  } catch (error) {
    console.log(
      'Production ReportEngine failed, as expected without a real reports table:',
      (error as Error).message,
    );
  }

  try {
    await productionEngine.generateReport('2024-02-01', '2024-02-29');
  } catch (error) {
    console.log(
      'Second production call failed the same way:',
      (error as Error).message,
    );
  } finally {
    await pgPool.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void main();
}
