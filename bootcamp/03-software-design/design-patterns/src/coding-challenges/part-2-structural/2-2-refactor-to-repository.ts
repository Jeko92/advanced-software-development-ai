/**
 * Challenge 2.2 — Refactor to Repository Pattern
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 2, Challenge 2.2)
 *
 * Starting point (write this first, then refactor it below):
 *
 *   class InvoiceService {
 *     async getTotal(invoiceId: number) {
 *       const { rows } = await pgPool.query(
 *         'SELECT * FROM invoice_lines WHERE invoice_id = $1', [invoiceId]
 *       );
 *       return rows.reduce((sum, r) => sum + r.amount, 0);
 *     }
 *   }
 *
 * TODO:
 * - extract an `InvoiceLineRepository` interface and move the SQL into a
 *   `PostgresInvoiceRepository`
 * - make `InvoiceService` depend on the interface instead of `pgPool`
 *   directly
 * - write a check using an in-memory repository that returns hard-coded
 *   lines, confirming `getTotal` still sums correctly
 *
 * Focus: the repository owns the query; the service owns the business rule
 * (summing).
 */

import assert from 'node:assert';
import { Pool } from 'pg';

const pgPool = new Pool({ connectionString: 'postgres://localhost:5432/app' });

class InvoiceServiceAntiPattern {
  async getTotal(invoiceId: number): Promise<number> {
    // language=PostgreSQL
    // noinspection SqlResolve,SqlNoDataSourceInspection
    const { rows } = await pgPool.query<{ amount: number }>(
      'SELECT * FROM invoice_lines WHERE invoice_id = $1',
      [invoiceId],
    );
    return rows.reduce((sum, r) => sum + r.amount, 0);
  }
}

type InvoiceLine = {
  invoiceId: number;
  amount: number;
};

interface InvoiceLineRepository {
  findByInvoiceId(invoiceId: number): Promise<InvoiceLine[]>;
}

class PostgresInvoiceLineRepository implements InvoiceLineRepository {
  constructor(private readonly db: Pool) {}

  async findByInvoiceId(invoiceId: number): Promise<InvoiceLine[]> {
    // language=PostgreSQL
    // noinspection SqlResolve,SqlNoDataSourceInspection
    const { rows } = await this.db.query<InvoiceLine>(
      'SELECT * FROM invoice_lines WHERE invoice_id = $1',
      [invoiceId],
    );
    return rows;
  }
}

class InMemoryInvoiceLineRepository implements InvoiceLineRepository {
  constructor(private readonly lines: InvoiceLine[] = []) {}

  async findByInvoiceId(invoiceId: number): Promise<InvoiceLine[]> {
    return this.lines.filter((line) => line.invoiceId === invoiceId);
  }
}

class InvoiceService {
  constructor(private readonly repo: InvoiceLineRepository) {}

  async getTotal(invoiceId: number): Promise<number> {
    const lines = await this.repo.findByInvoiceId(invoiceId);
    return lines.reduce((sum, line) => sum + line.amount, 0);
  }
}

// ---- Check: in-memory repository with hard-coded lines -------------------

async function main(): Promise<void> {
  const repo = new InMemoryInvoiceLineRepository([
    { invoiceId: 1, amount: 10 },
    { invoiceId: 1, amount: 25 },
    { invoiceId: 2, amount: 100 },
  ]);
  const service = new InvoiceService(repo);

  const total = await service.getTotal(1);
  assert.strictEqual(total, 35);
  console.log('getTotal(1) ->', total);

  const totalForOtherInvoice = await service.getTotal(2);
  assert.strictEqual(totalForOtherInvoice, 100);
  console.log('getTotal(2) ->', totalForOtherInvoice);

  const totalForUnknownInvoice = await service.getTotal(999);
  assert.strictEqual(totalForUnknownInvoice, 0);
  console.log('getTotal(999) ->', totalForUnknownInvoice);

  console.log('🎉 InvoiceService sums invoice lines correctly');

  try {
    const pgService = new InvoiceService(
      new PostgresInvoiceLineRepository(pgPool),
    );
    const pgTotal = await pgService.getTotal(1);
    console.log('getTotal(1) via Postgres ->', pgTotal);
  } catch (error) {
    console.log(
      'PostgresInvoiceLineRepository failed, as expected without a real invoice_lines table:',
      (error as Error).message,
    );
  }

  try {
    const antiPatternTotal = await new InvoiceServiceAntiPattern().getTotal(1);
    console.log('getTotal(1) via anti-pattern ->', antiPatternTotal);
  } catch (error) {
    console.log(
      'InvoiceServiceAntiPattern failed, as expected without a real invoice_lines table:',
      (error as Error).message,
    );
  } finally {
    await pgPool.end();
  }
}

void main();
