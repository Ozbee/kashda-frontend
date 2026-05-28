'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import KashdaLogo from '@/components/common/KashdaLogo';
import AuthShell from '@/components/auth/AuthShell';
import { trpc } from '@/lib/trpc';
import { PROPERTY_CATEGORY_IDS } from '@/types/api';
interface RegisterFormData {
  name: string;
  phone: string;
  email: string;
  addressType: 'ghana_post' | 'gps' | 'manual';
  addressValue: string;
  propertyCategory: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const registerMutation = trpc.auth.register.useMutation();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    phone: '',
    email: '',
    addressType: 'manual',
    addressValue: '',
    propertyCategory: 'residential_low',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.addressValue.trim()) {
      setError('Address is required');
      return false;
    }
    if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const addressType =
        formData.addressType === 'manual' ? 'ghana_post' : formData.addressType;

      const result = await registerMutation.mutateAsync({
        name: formData.name,
        phoneNumber: formData.phone.replace(/\s/g, ''),
        email: formData.email || undefined,
        addressType,
        addressValue: formData.addressValue,
        propertyCategoryId:
          PROPERTY_CATEGORY_IDS[formData.propertyCategory] ?? 1,
      });

      const phoneE164 = result.phoneNumber ?? formData.phone.replace(/\s/g, '');
      sessionStorage.setItem(
        'registration_data',
        JSON.stringify({
          ...formData,
          phone: phoneE164,
          accountReference: result.accountReference,
        })
      );
      if ('developmentOtp' in result && result.developmentOtp) {
        sessionStorage.setItem('development_otp', String(result.developmentOtp));
      } else {
        sessionStorage.removeItem('development_otp');
      }
      sessionStorage.setItem('login_phone', phoneE164);
      sessionStorage.setItem('auth_flow', 'register');
      router.push('/verify-otp');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Registration failed. Please try again.'
      );
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
              Create Account
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Join KASHDA to manage your property tax easily
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+233 24 123 4567"
                  required
                  fullWidth
                />
                <TextField
                  label="Email (Optional)"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  select
                  label="Address Type"
                  name="addressType"
                  value={formData.addressType}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="manual">Manual Address</MenuItem>
                  <MenuItem value="ghana_post">Ghana Post Address</MenuItem>
                  <MenuItem value="gps">GPS Coordinates</MenuItem>
                </TextField>
                <TextField
                  label="Property Address"
                  name="addressValue"
                  value={formData.addressValue}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  select
                  label="Property Category"
                  name="propertyCategory"
                  value={formData.propertyCategory}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="residential_low">Residential (Low-Income)</MenuItem>
                  <MenuItem value="residential_high">Residential (High-Income)</MenuItem>
                  <MenuItem value="commercial">Commercial</MenuItem>
                </TextField>

                <Button type="submit" variant="contained" fullWidth disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <Typography sx={{ textAlign: 'center' }} color="text.secondary">
                  Already have an account?{' '}
                  <Link href="/login" style={{ color: '#d4af37', fontWeight: 600, textDecoration: 'none' }}>
                    Sign In
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
    </AuthShell>
  );
}
