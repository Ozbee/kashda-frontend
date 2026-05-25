export function formatGhs(amount: string | number): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (Number.isNaN(n)) return 'GH₵ 0.00';
  return `GH₵ ${n.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatBillMonth(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GH', { month: 'long', year: 'numeric' });
}

export function toNumber(value: string | number): number {
  return typeof value === 'string' ? parseFloat(value) : value;
}
