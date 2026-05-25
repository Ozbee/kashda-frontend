'use client';

import Chip from '@mui/material/Chip';

type BillStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'completed' | 'failed';

const statusConfig: Record<
  BillStatus,
  { label: string; color: 'success' | 'warning' | 'error' | 'info' | 'default' }
> = {
  paid: { label: 'Paid', color: 'success' },
  completed: { label: 'Paid', color: 'success' },
  partial: { label: 'Partial', color: 'warning' },
  pending: { label: 'Due Soon', color: 'warning' },
  overdue: { label: 'Overdue', color: 'error' },
  failed: { label: 'Failed', color: 'error' },
};

export default function StatusChip({ status }: { status: BillStatus }) {
  const config = statusConfig[status] ?? { label: status, color: 'default' as const };
  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant="outlined"
    />
  );
}
