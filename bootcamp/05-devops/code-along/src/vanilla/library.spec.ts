import { describe, it, expect } from 'vitest';
import { calculateLateFee } from './library.ts';

describe('calculateLateFee', () => {
  it('charges 2 per day for overdue books', () => {
    const fee = calculateLateFee(3);
    expect(fee).toBe(6);
  });
});
