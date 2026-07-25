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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DescriptionIcon from '@mui/icons-material/Description';
import { trpc } from '@/lib/trpc';
import { formatGhs, toNumber } from '@/lib/format';
import type { MomoNetwork } from '@/types/api';
import { MOMO_NETWORKS } from '@/types/api';
import { isDevAuthEnabled } from '@/lib/env';
import PaymentStepIndicator from '@/components/payment/PaymentStepIndicator';

interface PaymentFlowProps {
  billId: number;
  defaultPhone?: string;
}

function validateMomoNumber(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 'Enter your mobile money number';
  if (!digits.startsWith('0')) return 'Number must start with 0';
  if (digits.length !== 10) return 'Enter a 10-digit phone number';
  return null;
}

function toLocalPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('233') && digits.length === 12) {
    return `0${digits.slice(3)}`;
  }
  if (digits.length === 9 && !digits.startsWith('0')) {
    return `0${digits}`;
  }
  return phone;
}

export default function PaymentFlow({ billId, defaultPhone = '' }: PaymentFlowProps) {
  const router = useRouter();
  const billQuery = trpc.billing.getBillDetails.useQuery({ billId });
  const initiateMutation = trpc.payment.initiateMobileMoneyPayment.useMutation();
  const [step, setStep] = useState<'method' | 'details' | 'status'>('method');
  const [network, setNetwork] = useState<MomoNetwork>('MTN');
  const [momoNumber, setMomoNumber] = useState(() => toLocalPhone(defaultPhone));
  const [payAmount, setPayAmount] = useState('');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const bill = billQuery.data;
  const amount = bill ? toNumber(bill.totalDue) : 0;

  const handleMomoNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMomoNumber(raw);
  };

  const handleGoToDetails = () => {
    setPayAmount(String(amount));
    setStep('details');
  };

  const handleInitiate = async () => {
    setError('');

    const phoneError = validateMomoNumber(momoNumber);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    const parsed = parseFloat(payAmount);
    if (Number.isNaN(parsed) || parsed <= 0) {
      setError('Enter a valid amount to pay');
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

      {/* Step 1: Select Payment Method */}
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
                onClick={handleGoToDetails}
                sx={{ py: 1.5 }}
              >
                Mobile Wallet
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<DescriptionIcon />}
                disabled
                sx={{ py: 1.5 }}
              >
                Bank Cheque
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<AccountBalanceIcon />}
                disabled
                sx={{ py: 1.5 }}
              >
                Bank Transfer
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<CreditCardIcon />}
                disabled
                sx={{ py: 1.5 }}
              >
                Pay with Card
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Mobile Wallet Details */}
      {step === 'details' && (
        <Card sx={{ transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4 } }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }}>
                Mobile Wallet Payment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Mobile wallet payment is currently supported only in Ghana.
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
                label="Mobile Wallet Number"
                value={momoNumber}
                onChange={handleMomoNumberChange}
                placeholder="0241234567"
                fullWidth
                slotProps={{
                  htmlInput: { maxLength: 10, inputMode: 'numeric' },
                }}
                helperText="Enter number (10 digits)"
              />

              <TextField
                label="Amount to Pay (GH₵)"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                type="number"
                fullWidth
                slotProps={{
                  htmlInput: { min: 0.01, step: 0.01 },
                }}
              />

              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={loading}
                onClick={handleInitiate}
              >
                {loading ? 'Processing...' : 'Pay'}
              </Button>
              <Button variant="outlined" color="secondary" fullWidth onClick={() => setStep('method')}>
                Back
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirmation */}
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
