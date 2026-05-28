import { formatBillMonth, toNumber } from '@/lib/format';

export interface PaymentRow {
  id: string;
  date: string;
  amount: number;
  reference: string;
  status: 'completed' | 'failed' | 'pending';
  method: 'mobile_money';
  billMonth: string;
}

type ApiPayment = {
  id: number;
  amount: string | number;
  status: string;
  paymentReference?: string | null;
  createdAt?: Date | string;
  billingMonth?: string | Date | null;
};

export function mapApiPaymentsToRows(
  payments: ApiPayment[],
  fallbackBillMonth?: string | Date | null
): PaymentRow[] {
  return payments.map((p) => ({
    id: String(p.id),
    date: new Date(p.createdAt ?? Date.now()).toISOString(),
    amount: toNumber(p.amount),
    reference: p.paymentReference ?? `PAY-${p.id}`,
    status:
      p.status === 'success' || p.status === 'completed'
        ? 'completed'
        : p.status === 'failed'
          ? 'failed'
          : 'pending',
    method: 'mobile_money' as const,
    billMonth: p.billingMonth
      ? formatBillMonth(p.billingMonth)
      : fallbackBillMonth
        ? formatBillMonth(fallbackBillMonth)
        : '—',
  }));
}
