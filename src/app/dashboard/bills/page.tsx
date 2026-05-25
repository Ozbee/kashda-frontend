'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import BillsList from '@/components/dashboard/BillsList';
import { trpc } from '@/lib/trpc';
import { formatBillMonth, toNumber } from '@/lib/format';
import { isDevAuthEnabled } from '@/lib/env';

const DEV_BILLS = [
  {
    id: '1',
    month: 'May 2026',
    baseAmount: 150,
    arrears: 50,
    totalDue: 200,
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending' as const,
  },
  {
    id: '2',
    month: 'April 2026',
    baseAmount: 150,
    arrears: 0,
    totalDue: 150,
    dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'paid' as const,
    paidAmount: 150,
  },
];

export default function BillsPage() {
  const router = useRouter();
  const historyQuery = trpc.billing.getBillHistory.useQuery({ limit: 12, offset: 0 });

  const bills =
    historyQuery.data?.map((b) => ({
      id: String(b.id),
      month: formatBillMonth(b.billingMonth),
      baseAmount: toNumber(b.baseAmount),
      arrears: toNumber(b.arrears),
      totalDue: toNumber(b.totalDue),
      dueDate:
        typeof b.dueDate === 'string'
          ? b.dueDate
          : new Date(b.dueDate).toISOString(),
      status:
        b.status === 'paid'
          ? ('paid' as const)
          : b.status === 'partial'
            ? ('partial' as const)
            : ('pending' as const),
      paidAmount:
        b.status === 'paid' ? toNumber(b.totalDue) : undefined,
    })) ??
    (isDevAuthEnabled() || historyQuery.isError ? DEV_BILLS : []);

  if (historyQuery.isLoading && bills.length === 0) {
    return (
      <DashboardLayout activeTab="bills">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
          <CircularProgress color="secondary" />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="bills">
      <DashboardPageHeader
        title="Your Bills"
        description="View and manage all your property tax bills"
      />

      <BillsList
        bills={bills}
        onPayBill={(billId) => router.push(`/dashboard/payment?billId=${billId}`)}
      />
    </DashboardLayout>
  );
}
