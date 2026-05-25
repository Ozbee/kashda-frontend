'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import QuickStats from '@/components/dashboard/QuickStats';
import BillOverviewCard from '@/components/dashboard/BillOverviewCard';
import PaymentHistoryTable from '@/components/dashboard/PaymentHistoryTable';
import { useAuth } from '@/contexts/AuthContext';
import { trpc } from '@/lib/trpc';
import { formatBillMonth, toNumber } from '@/lib/format';
import { isDevAuthEnabled } from '@/lib/env';

const DEV_BILL = {
  id: 1,
  baseAmount: 150,
  arrears: 50,
  totalDue: 200,
  dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'pending' as const,
  payments: [
    {
      id: '1',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 150,
      reference: 'KSD-GHA-PAY-001',
      status: 'completed' as const,
      method: 'mobile_money' as const,
      billMonth: 'April 2026',
    },
  ],
};

const quickActions = [
  { label: 'View All Bills', href: '/dashboard/bills', icon: ReceiptLongIcon },
  { label: 'Update Profile', href: '/dashboard/profile', icon: PersonOutlinedIcon },
  { label: 'Get Support', href: '/dashboard/support', icon: HelpOutlinedIcon },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const billQuery = trpc.billing.getCurrentBill.useQuery(undefined, {
    retry: false,
  });

  const bill =
    billQuery.data ??
    (isDevAuthEnabled() || billQuery.isError ? DEV_BILL : null);

  const payments = (() => {
    if (!bill?.payments?.length) return DEV_BILL.payments;
    return bill.payments.map((p) => {
      const apiPayment = p as {
        id: number;
        amount: string | number;
        status: string;
        paymentReference?: string | null;
        createdAt?: Date;
        date?: string;
        reference?: string;
        method?: string;
        billMonth?: string;
      };
      if ('date' in apiPayment && apiPayment.date) {
        return {
          ...apiPayment,
          id: String(apiPayment.id),
          date: apiPayment.date,
          amount: toNumber(apiPayment.amount),
          reference: apiPayment.reference ?? `PAY-${apiPayment.id}`,
          status: (apiPayment.status === 'completed' ? 'completed' : apiPayment.status === 'failed' ? 'failed' : 'pending') as 'completed' | 'failed' | 'pending',
          method: 'mobile_money' as const,
          billMonth: apiPayment.billMonth ?? 'Current',
        };
      }
      const billingMonth =
        bill && 'billingMonth' in bill ? bill.billingMonth : null;
      return {
        id: String(apiPayment.id),
        date: new Date(apiPayment.createdAt ?? Date.now()).toISOString(),
        amount: toNumber(apiPayment.amount),
        reference: apiPayment.paymentReference ?? `PAY-${apiPayment.id}`,
        status:
          apiPayment.status === 'success' || apiPayment.status === 'completed'
            ? ('completed' as const)
            : apiPayment.status === 'failed'
              ? ('failed' as const)
              : ('pending' as const),
        method: 'mobile_money' as const,
        billMonth:
          billingMonth != null ? formatBillMonth(billingMonth) : 'Current',
      };
    });
  })();

  const totalPaid = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  if (billQuery.isLoading && !bill) {
    return (
      <DashboardLayout activeTab="overview">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
          <CircularProgress color="secondary" />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="overview">
      <WelcomeBanner name={user?.name?.split(' ')[0] ?? 'User'} />

      <QuickStats
        totalPaid={totalPaid}
        totalDue={bill ? toNumber(bill.totalDue) : 0}
        lastPaymentDate={payments[0]?.date}
        accountReference={user?.accountReference ?? 'KSD-GHA-XXXXX'}
      />

      {bill && (
        <Box sx={{ mb: 4 }}>
          <BillOverviewCard
            baseAmount={toNumber(bill.baseAmount)}
            arrears={toNumber(bill.arrears)}
            totalDue={toNumber(bill.totalDue)}
            dueDate={
              typeof bill.dueDate === 'string'
                ? bill.dueDate
                : new Date(bill.dueDate).toISOString()
            }
            status={
              bill.status === 'paid' || bill.status === 'partial'
                ? (bill.status as 'paid' | 'partial')
                : 'pending'
            }
            onPayNow={() => router.push(`/dashboard/payment?billId=${bill.id}`)}
          />
        </Box>
      )}

      <Box sx={{ mb: 4 }}>
        <PaymentHistoryTable
          payments={payments}
          onRetry={(id) => router.push(`/dashboard/payment?retry=${id}`)}
        />
      </Box>

      <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }} gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Grid key={action.label} size={{ xs: 12, sm: 4 }}>
              <Card sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                <CardActionArea onClick={() => router.push(action.href)}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: 'primary.dark',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'secondary.main',
                      }}
                    >
                      <Icon />
                    </Box>
                    <Typography sx={{ fontWeight: 600 }}>{action.label}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </DashboardLayout>
  );
}
