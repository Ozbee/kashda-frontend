'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { trpc } from '@/lib/trpc';
import { formatGhs, toNumber } from '@/lib/format';
import type { MomoNetwork } from '@/types/api';
import { MOMO_NETWORKS } from '@/types/api';
import { isDevAuthEnabled } from '@/lib/env';
import PaymentStepIndicator from '@/components/payment/PaymentStepIndicator';

const NETWORK_COLORS: Record<string, string> = {
  MTN: '#FFCC00',
  Vodafone: '#E60000',
  AirtelTigo: '#0066CC',
  Telecel: '#E60000',
};

interface PaymentFlowProps {
  billId: number;
  defaultPhone?: string;
}

export default function PaymentFlow({ billId, defaultPhone = '' }: PaymentFlowProps) {
  const router = useRouter();
  const billQuery = trpc.billing.getBillDetails.useQuery({ billId });
  const initiateMutation = trpc.payment.initiateMobileMoneyPayment.useMutation();
  const [step, setStep] = useState<'method' | 'details' | 'status'>('method');
  const [network, setNetwork] = useState<MomoNetwork>('MTN');
  const [momoNumber, setMomoNumber] = useState(defaultPhone);
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const bill = billQuery.data;
  const amount = bill ? toNumber(bill.totalDue) : 0;

  const handleInitiate = async () => {
    setError('');
    if (!momoNumber.trim()) {
      setError('Enter your mobile money number');
      return;
    }

    setLoading(true);
    try {
      const result = await initiateMutation.mutateAsync({
        billId,
        momoNumber: momoNumber.replace(/\s/g, ''),
        momoNetwork: network,
      });
      setReference(result.paymentReference);
      setStatusMessage(result.message ?? 'Approve the prompt on your phone.');
      setStep('status');
    } catch (err) {
      if (isDevAuthEnabled()) {
        setReference(`DEV-PAY-${Date.now()}`);
        setStatusMessage('Dev mode: payment simulated as successful.');
        setStep('status');
        return;
      }
      setError(err instanceof Error ? err.message : 'Payment failed to start.');
    } finally {
      setLoading(false);
    }
  };

  if (billQuery.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto' }}>
      <PaymentStepIndicator currentStep={step} />

      {bill && step === 'method' && (
        <Card sx={{ transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4 } }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }}>
                Select Payment Method
              </Typography>
              <Typography color="text.secondary">Amount due: {formatGhs(amount)}</Typography>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                startIcon={<PhoneAndroidIcon />}
                onClick={() => setStep('details')}
                sx={{ py: 1.5 }}
              >
                Mobile Money (MoMo)
              </Button>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {MOMO_NETWORKS.map((n) => (
                  <Box
                    key={n}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      bgcolor: 'background.default',
                      border: 1,
                      borderColor: NETWORK_COLORS[n] ?? 'divider',
                      color: 'text.primary',
                    }}
                  >
                    {n}
                  </Box>
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Card & bank transfer — Coming soon
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      {step === 'details' && (
        <Card sx={{ transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4 } }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }}>
                Mobile Money Payment
              </Typography>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                select
                label="Network"
                value={network}
                onChange={(e) => setNetwork(e.target.value as MomoNetwork)}
                fullWidth
              >
                {MOMO_NETWORKS.map((n) => (
                  <MenuItem key={n} value={n}>{n}</MenuItem>
                ))}
              </TextField>

              <TextField
                label="MoMo Number"
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
                placeholder="+233..."
                fullWidth
              />

              <Button variant="contained" color="secondary" fullWidth disabled={loading} onClick={handleInitiate}>
                {loading ? 'Processing...' : `Pay ${formatGhs(amount)}`}
              </Button>
              <Button variant="outlined" color="secondary" fullWidth onClick={() => setStep('method')}>
                Back
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {step === 'status' && (
        <Card>
          <CardContent sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
            <Stack spacing={2} sx={{ alignItems: 'center' }}>
              <CheckCircleOutlinedIcon sx={{ fontSize: 56, color: 'success.main' }} />
              <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }}>
                Payment Initiated
              </Typography>
              <Typography color="text.secondary">{statusMessage}</Typography>
              {reference && (
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }} color="text.secondary">
                  Ref: {reference}
                </Typography>
              )}
              <Button variant="contained" fullWidth onClick={() => router.push('/dashboard')}>
                Return to Dashboard
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
