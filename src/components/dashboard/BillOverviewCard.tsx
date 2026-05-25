'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StatusChip from '@/components/dashboard/StatusChip';

interface BillOverviewCardProps {
  baseAmount: number;
  arrears: number;
  totalDue: number;
  dueDate: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  onPayNow?: () => void;
}

export default function BillOverviewCard({
  baseAmount,
  arrears,
  totalDue,
  dueDate,
  status,
  onPayNow,
}: BillOverviewCardProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);

  return (
    <Card
      sx={{
        borderLeft: 4,
        borderLeftColor: 'secondary.main',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ReceiptLongIcon
        sx={{
          position: 'absolute',
          right: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 120,
          opacity: 0.06,
          color: 'secondary.main',
          pointerEvents: 'none',
        }}
      />
      <CardContent sx={{ p: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'primary.dark',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'secondary.main',
              }}
            >
              <ReceiptLongIcon />
            </Box>
            <Box>
              <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }}>
                Current Month Bill
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Due by {new Date(dueDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          <StatusChip status={status} />
        </Box>

        <Stack spacing={1.5} sx={{ mb: 3, pb: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Base Amount</Typography>
            <Typography sx={{ fontWeight: 600 }}>{formatCurrency(baseAmount)}</Typography>
          </Box>
          {arrears > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">Arrears</Typography>
              <Typography sx={{ fontWeight: 600 }} color="error.main">
                {formatCurrency(arrears)}
              </Typography>
            </Box>
          )}
        </Stack>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Total Amount Due
        </Typography>
        <Typography variant="h3" color="secondary.main" sx={{ fontWeight: 700, mb: 3 }}>
          {formatCurrency(totalDue)}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="contained" color="secondary" fullWidth onClick={onPayNow} sx={{ fontWeight: 700 }}>
            Pay Now
          </Button>
          <Button variant="outlined" fullWidth color="secondary">
            View Details
          </Button>
        </Stack>

        {arrears > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            You have unpaid arrears from previous months. Please settle these along with the current bill.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
