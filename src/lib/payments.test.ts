import { describe, it, expect } from 'vitest';
import { mapApiPaymentsToRows } from './payments';

describe('mapApiPaymentsToRows', () => {
  it('normalizes API statuses to UI statuses', () => {
    const rows = mapApiPaymentsToRows([
      { id: 1, amount: '100', status: 'success' },
      { id: 2, amount: 50, status: 'completed' },
      { id: 3, amount: '25', status: 'failed' },
      { id: 4, amount: '10', status: 'anything-else' },
    ]);

    expect(rows.map((r) => r.status)).toEqual([
      'completed',
      'completed',
      'failed',
      'pending',
    ]);
  });

  it('coerces amounts to numbers and stringifies ids', () => {
    const [row] = mapApiPaymentsToRows([
      { id: 7, amount: '199.99', status: 'success' },
    ]);
    expect(row?.id).toBe('7');
    expect(row?.amount).toBeCloseTo(199.99, 2);
    expect(row?.method).toBe('mobile_money');
  });

  it('falls back to PAY-<id> when no reference is present', () => {
    const [row] = mapApiPaymentsToRows([
      { id: 42, amount: '5', status: 'pending', paymentReference: null },
    ]);
    expect(row?.reference).toBe('PAY-42');
  });

  it('uses the provided reference when available', () => {
    const [row] = mapApiPaymentsToRows([
      { id: 1, amount: '5', status: 'pending', paymentReference: 'REF-123' },
    ]);
    expect(row?.reference).toBe('REF-123');
  });

  it('renders an em dash for bill month when none can be derived', () => {
    const [row] = mapApiPaymentsToRows([
      { id: 1, amount: '5', status: 'pending' },
    ]);
    expect(row?.billMonth).toBe('—');
  });

  it('formats the bill month from the fallback when the row lacks one', () => {
    const [row] = mapApiPaymentsToRows(
      [{ id: 1, amount: '5', status: 'pending' }],
      new Date(2025, 0, 1)
    );
    expect(row?.billMonth).toMatch(/2025/);
  });
});
