import { describe, it, expect } from 'vitest';
import { calculateLateFee } from './library';

describe('calculateLateFee', () => {
  it('charges 2 per day for overdue books', () => {
    const fee = calculateLateFee(3);
    expect(fee).toBe(6);
  });

  it('caps the maximum late fee at 10', () => {
    const fee = calculateLateFee(7);
    expect(fee).toBe(10);
  });
});
