'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import PaymentHistoryTable from '@/components/dashboard/PaymentHistoryTable';
import { trpc } from '@/lib/trpc';
import { formatBillMonth, formatGhs, toNumber } from '@/lib/format';
import { isDevAuthEnabled } from '@/lib/env';

const DEV_PAYMENTS = [
  {
    id: '1',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 150,
    reference: 'KSD-GHA-PAY-001',
    status: 'completed' as const,
    method: 'mobile_money' as const,
    billMonth: 'May 2026',
  },
];

export default function PaymentsPage() {
  const router = useRouter();
  const billQuery = trpc.billing.getCurrentBill.useQuery();

  const payments =
    billQuery.data?.payments?.map((p) => ({
      id: String(p.id),
      date: new Date(p.createdAt).toISOString(),
      amount: toNumber(p.amount),
      reference: p.paymentReference ?? `PAY-${p.id}`,
      status:
        p.status === 'success' || p.status === 'completed'
          ? ('completed' as const)
          : p.status === 'failed'
            ? ('failed' as const)
            : ('pending' as const),
      method: 'mobile_money' as const,
      billMonth: billQuery.data?.billingMonth
        ? formatBillMonth(billQuery.data.billingMonth)
        : '—',
    })) ?? (isDevAuthEnabled() || billQuery.isError ? DEV_PAYMENTS : []);

  const totalPaid = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout activeTab="payments">
      <DashboardPageHeader
        title="Payment History"
        description="View all your property tax payments"
      />

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Paid
              </Typography>
              <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 700 }}>
                {formatGhs(totalPaid)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Payments Made
              </Typography>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                {payments.filter((p) => p.status === 'completed').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <PaymentHistoryTable
        payments={payments}
        onRetry={(id) => router.push(`/dashboard/payment?retry=${id}`)}
      />
    </DashboardLayout>
  );
}
