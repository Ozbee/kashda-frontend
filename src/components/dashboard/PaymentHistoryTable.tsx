'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
import StatusChip from '@/components/dashboard/StatusChip';

interface Payment {
  id: string;
  date: string;
  amount: number;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
  method: 'mobile_money' | 'manual' | 'bank_transfer';
  billMonth: string;
}

interface PaymentHistoryTableProps {
  payments: Payment[];
  isLoading?: boolean;
  onRetry?: (paymentId: string) => void;
}

export default function PaymentHistoryTable({
  payments,
  isLoading = false,
  onRetry,
}: PaymentHistoryTableProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'mobile_money':
        return { label: 'Mobile Money', icon: PhoneAndroidIcon };
      case 'manual':
        return { label: 'Manual Transfer', icon: PaymentsIcon };
      case 'bank_transfer':
        return { label: 'Bank Transfer', icon: AccountBalanceIcon };
      default:
        return { label: method, icon: PaymentsIcon };
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="secondary.main" gutterBottom>
            Payment History
          </Typography>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={56} sx={{ mb: 1 }} />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="secondary.main" gutterBottom>
            Payment History
          </Typography>
          <Typography color="text.secondary">No payments yet</Typography>
          <Typography variant="body2" color="text.secondary">
            Your payment history will appear here
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }} gutterBottom>
          Recent Payments
        </Typography>

        <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Bill Month</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reference</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => {
                const method = getMethodLabel(payment.method);
                const MethodIcon = method.icon;
                return (
                  <TableRow key={payment.id} hover>
                    <TableCell>{formatDate(payment.date)}</TableCell>
                    <TableCell>{payment.billMonth}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }} color="secondary.main">
                        {formatCurrency(payment.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MethodIcon fontSize="small" color="action" />
                        {method.label}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={payment.status} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }} color="text.secondary">
                        {payment.reference}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack spacing={2} sx={{ display: { xs: 'flex', md: 'none' } }}>
          {payments.map((payment) => {
            const method = getMethodLabel(payment.method);
            const MethodIcon = method.icon;
            return (
              <Card key={payment.id} variant="outlined" sx={{ bgcolor: 'background.default' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{formatCurrency(payment.amount)}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(payment.date)}
                      </Typography>
                    </Box>
                    <StatusChip status={payment.status} />
                  </Box>
                  <Stack spacing={0.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Bill Month</Typography>
                      <Typography variant="body2">{payment.billMonth}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Method</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MethodIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{method.label}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Reference</Typography>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{payment.reference}</Typography>
                    </Box>
                  </Stack>
                  {payment.status === 'failed' && onRetry && (
                    <Button
                      fullWidth
                      color="error"
                      variant="outlined"
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => onRetry(payment.id)}
                    >
                      Retry Payment
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
          Showing {payments.length} payment{payments.length !== 1 ? 's' : ''}
        </Typography>
      </CardContent>
    </Card>
  );
}
