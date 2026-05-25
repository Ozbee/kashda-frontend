'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import KashdaLogo from '@/components/common/KashdaLogo';
import AuthShell from '@/components/auth/AuthShell';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/contexts/AuthContext';
import { buildDevUser, shouldUseDevFallback } from '@/lib/dev-auth';
import { isDevAuthEnabled } from '@/lib/env';

const MAX_RESEND_ATTEMPTS = 3;

export default function OTPVerification() {
  const router = useRouter();
  const { setDevUser, refetchUser } = useAuth();
  const verifyMutation = trpc.auth.verifyOtp.useMutation();
  const registerMutation = trpc.auth.register.useMutation();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [phone, setPhone] = useState('');
  const [registrationData, setRegistrationData] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const regRaw = sessionStorage.getItem('registration_data');
    const loginPhone = sessionStorage.getItem('login_phone');
    if (regRaw) {
      const parsed = JSON.parse(regRaw) as Record<string, string>;
      setRegistrationData(parsed);
      setPhone(parsed.phone ?? '');
    } else if (loginPhone) {
      setPhone(loginPhone);
    } else {
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const completeAuth = async (otpCode: string) => {
    const phoneNumber = phone.replace(/\s/g, '');

    try {
      await verifyMutation.mutateAsync({ phoneNumber, otpCode });
      sessionStorage.removeItem('registration_data');
      sessionStorage.removeItem('login_phone');
      sessionStorage.removeItem('auth_flow');
      await refetchUser();
      router.push('/dashboard');
    } catch (err) {
      if (shouldUseDevFallback(err)) {
        const name = registrationData?.name ?? 'KASHDA User';
        const email = registrationData?.email;
        setDevUser(
          buildDevUser({
            name,
            phone: phoneNumber,
            email,
            accountReference: registrationData?.accountReference,
          })
        );
        sessionStorage.removeItem('registration_data');
        sessionStorage.removeItem('login_phone');
        sessionStorage.removeItem('auth_flow');
        router.push('/dashboard');
        return;
      }
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await completeAuth(otpCode);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'OTP verification failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0 || resendAttempts >= MAX_RESEND_ATTEMPTS) return;

    setLoading(true);
    setResendCountdown(60);
    setResendAttempts((prev) => prev + 1);

    try {
      if (registrationData && !isDevAuthEnabled()) {
        const addressType =
          registrationData.addressType === 'manual'
            ? 'ghana_post'
            : registrationData.addressType;
        await registerMutation.mutateAsync({
          name: registrationData.name,
          phoneNumber: phone.replace(/\s/g, ''),
          email: registrationData.email || undefined,
          addressType: addressType as 'ghana_post' | 'gps',
          addressValue: registrationData.addressValue,
          propertyCategoryId: 1,
        });
      }
      setError('');
    } catch {
      if (!isDevAuthEnabled()) {
        setError('Failed to resend OTP. Please try again.');
        setResendAttempts((prev) => prev - 1);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <KashdaLogo />
      </Box>

      <Card sx={{ boxShadow: 6 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 700 }} gutterBottom>
              Verify Your Phone
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              We sent a 6-digit code to{' '}
              <Box component="span" sx={{ fontWeight: 600 }} color="text.primary">
                {phone || 'your phone'}
              </Box>
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {error && <Alert severity="error">{error}</Alert>}

                <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                  {otp.map((digit, index) => (
                    <TextField
                      key={index}
                      id={`otp-${index}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      slotProps={{
                        htmlInput: {
                          maxLength: 1,
                          inputMode: 'numeric',
                          style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, padding: '12px 0' },
                        },
                      }}
                      sx={{ width: 48 }}
                      autoFocus={index === 0}
                    />
                  ))}
                </Stack>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || otp.join('').length !== 6}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={resendCountdown > 0 || loading}
                  onClick={handleResend}
                >
                  {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend OTP'}
                </Button>

                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Wrong number?{' '}
                  <Link href="/register" style={{ color: '#d4af37', fontWeight: 600, textDecoration: 'none' }}>
                    Go back
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
    </AuthShell>
  );
}
