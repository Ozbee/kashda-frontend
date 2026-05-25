'use client';

import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Skeleton from '@mui/material/Skeleton';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StatusChip from '@/components/dashboard/StatusChip';

interface Bill {
  id: string;
  month: string;
  baseAmount: number;
  arrears: number;
  totalDue: number;
  dueDate: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  paidAmount?: number;
}

interface BillsListProps {
  bills: Bill[];
  isLoading?: boolean;
  onPayBill?: (billId: string) => void;
}

export default function BillsList({
  bills,
  isLoading = false,
  onPayBill,
}: BillsListProps) {
  const [expandedBill, setExpandedBill] = useState<string | null>(null);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const getProgressPercentage = (bill: Bill) => {
    if (bill.totalDue === 0) return 100;
    return Math.min(((bill.paidAmount || 0) / bill.totalDue) * 100, 100);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="secondary.main" gutterBottom>Bills</Typography>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={80} sx={{ mb: 1 }} />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (bills.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="secondary.main" gutterBottom>Bills</Typography>
          <Typography color="text.secondary">No bills found</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }} gutterBottom>
          All Bills
        </Typography>

        <Stack spacing={2}>
          {bills.map((bill) => {
            const expanded = expandedBill === bill.id;
            return (
              <Card key={bill.id} variant="outlined" sx={{ bgcolor: 'background.default' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                    onClick={() => setExpandedBill(expanded ? null : bill.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: 'primary.dark',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'secondary.main',
                        }}
                      >
                        <ReceiptLongIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>{bill.month}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Due: {formatDate(bill.dueDate)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontWeight: 700 }} color="secondary.main">
                          {formatCurrency(bill.totalDue)}
                        </Typography>
                        <StatusChip status={bill.status} />
                      </Box>
                      <IconButton
                        size="small"
                        sx={{
                          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Collapse in={expanded}>
                    <Stack spacing={2} sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Base Amount</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(bill.baseAmount)}</Typography>
                      </Box>
                      {bill.arrears > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Arrears</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }} color="error.main">
                            {formatCurrency(bill.arrears)}
                          </Typography>
                        </Box>
                      )}
                      {bill.status !== 'paid' && (
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">Payment Progress</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {Math.round(getProgressPercentage(bill))}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={getProgressPercentage(bill)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      )}
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        {bill.status !== 'paid' && (
                          <Button variant="contained" fullWidth onClick={() => onPayBill?.(bill.id)}>
                            Pay Now
                          </Button>
                        )}
                        <Button variant="outlined" color="secondary" fullWidth>
                          Download Receipt
                        </Button>
                      </Stack>
                    </Stack>
                  </Collapse>
                </CardContent>
              </Card>
            );
          })}
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
          Showing {bills.length} bill{bills.length !== 1 ? 's' : ''}
        </Typography>
      </CardContent>
    </Card>
  );
}
