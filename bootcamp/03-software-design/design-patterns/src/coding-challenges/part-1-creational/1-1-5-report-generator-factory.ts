/**
 * Challenge 1.1.5 — Report Generator Factory
 * (extra practice rep of the Factory pattern — not in
 * Design_Patterns_Coding_Challenges.md, same shape as Challenge 1.2)
 *
 * A reporting system supports multiple output formats.
 *
 * TODO:
 * - `ReportGenerator` interface:
 *     `generate(data: ReportData): string`
 * - `PdfReportGenerator`, `CsvReportGenerator`, `JsonReportGenerator`
 *   implementing it, each taking its own formatting config via constructor
 *   (template name, delimiter, pretty-print flag).
 * - A `createReportGenerator(format: 'pdf' | 'csv' | 'json'): ReportGenerator`
 *   factory function.
 * - `ReportService` that asks the factory for a generator on every call,
 *   then generates the report through it. It must never instantiate a
 *   generator directly.
 *
 * Focus:
 * - Adding an `XlsxReportGenerator` later should require changing only the
 *   factory and adding the new implementation.
 */
interface ReportData {
  title: string;
  items: Array<{ id: number; name: string; value: number }>;
}

interface ReportGenerator {
  generate(data: ReportData): string;
}

class PdfReportGenerator implements ReportGenerator {
  constructor(private readonly template: string) {}

  generate(data: ReportData): string {
    return `[PDF Layout: ${this.template}]\nTitle: ${data.title}\nItems Count: ${data.items.length}`;
  }
}
class CsvReportGenerator implements ReportGenerator {
  constructor(private readonly delimiter: string = ',') {}

  generate(data: ReportData): string {
    const header = `id${this.delimiter}name${this.delimiter}value`;
    const rows = data.items.map(
      (item) =>
        `${item.id}${this.delimiter}${item.name}${this.delimiter}${item.value}`,
    );
    return [data.title, header, ...rows].join('\n');
  }
}
class JsonReportGenerator implements ReportGenerator {
  constructor(private readonly prettyPrint: boolean = false) {}

  generate(data: ReportData): string {
    return this.prettyPrint
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);
  }
}

type ReportFormat = 'pdf' | 'csv' | 'json';

const createReportGenerator = (format: ReportFormat): ReportGenerator => {
  switch (format) {
    case 'pdf':
      return new PdfReportGenerator('corporate-blue-v2');
    case 'csv':
      return new CsvReportGenerator(';');
    case 'json':
      return new JsonReportGenerator(true);
    default:
      throw new Error(`${format} format not supported.`);
  }
};

class ReportService {
  generateReport(data: ReportData, format: ReportFormat): string {
    const generator = createReportGenerator(format);
    return generator.generate(data);
  }
}

const sampleData: ReportData = {
  title: 'Q3 Sales Summary',
  items: [
    { id: 1, name: 'Widget A', value: 1200 },
    { id: 2, name: 'Widget B', value: 850 },
  ],
};

const service = new ReportService();

console.log('--- CSV OUTPUT ---');
console.log(service.generateReport(sampleData, 'csv'));

console.log('\n--- JSON OUTPUT ---');
console.log(service.generateReport(sampleData, 'json'));

console.log('\n--- PDF OUTPUT ---');
console.log(service.generateReport(sampleData, 'pdf'));
