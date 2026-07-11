import { describe, it, expect } from 'vitest';
import { formatGhs, formatBillMonth, toNumber } from './format';

describe('formatGhs', () => {
  it('formats a numeric amount with the GH₵ symbol and 2 decimals', () => {
    const result = formatGhs(50);
    expect(result.startsWith('GH₵')).toBe(true);
    expect(result).toContain('50.00');
  });

  it('parses numeric strings', () => {
    expect(formatGhs('1234.5')).toContain('.50');
  });

  it('falls back to GH₵ 0.00 for non-numeric input', () => {
    expect(formatGhs('not-a-number')).toBe('GH₵ 0.00');
    expect(formatGhs(NaN)).toBe('GH₵ 0.00');
  });
});

describe('toNumber', () => {
  it('parses numeric strings to numbers', () => {
    expect(toNumber('12.5')).toBe(12.5);
  });

  it('returns numbers unchanged', () => {
    expect(toNumber(7)).toBe(7);
  });
});

describe('formatBillMonth', () => {
  it('renders the month and year for a Date', () => {
    const result = formatBillMonth(new Date(2025, 0, 15));
    expect(result).toMatch(/2025/);
  });

  it('accepts ISO date strings', () => {
    const result = formatBillMonth('2025-06-01T00:00:00.000Z');
    expect(result).toMatch(/2025/);
  });
});
