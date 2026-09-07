import type { ValueTransformer } from 'typeorm';

/**
 * SQLite has no real DECIMAL type — it stores such columns as TEXT or REAL and
 * hands them back to the driver in whatever shape it stored them. Without this
 * transformer a price written as `10.5` can come back as the string `"10.50"`,
 * which quietly breaks every `>` comparison in the bidding rules.
 *
 * A ValueTransformer runs on the way in (`to`) and on the way out (`from`), so
 * the rest of the application only ever sees numbers.
 */
export const numericTransformer: ValueTransformer = {
  to: (value: number | null): number | null => value,
  from: (value: string | number | null): number | null =>
    value === null || value === undefined ? null : Number(value),
};
