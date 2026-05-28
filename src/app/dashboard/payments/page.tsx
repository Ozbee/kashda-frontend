'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import PaymentHistoryTable from '@/components/dashboard/PaymentHistoryTable';
import { trpc } from '@/lib/trpc';
import { formatGhs } from '@/lib/format';
import { mapApiPaymentsToRows } from '@/lib/payments';

export default function PaymentsPage() {
  const router = useRouter();
  const paymentsQuery = trpc.billing.getPaymentHistory.useQuery({ limit: 50 });

  const payments = mapApiPaymentsToRows(paymentsQuery.data ?? []);
  const completed = payments.filter((p) => p.status === 'completed');
  const totalPaid = completed.reduce((sum, p) => sum + p.amount, 0);

  if (paymentsQuery.isLoading) {
    return (
      <DashboardLayout activeTab="payments">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
          <CircularProgress color="secondary" />
        </Box>
      </DashboardLayout>
    );
  }

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
                {completed.length}
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
