'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/contexts/AuthContext';
import { isDevAuthEnabled } from '@/lib/env';

export default function ProfilePage() {
  const { user } = useAuth();
  const profileQuery = trpc.auth.getProfile.useQuery(undefined, { retry: false });
  const updateMutation = trpc.auth.updateProfile.useMutation();
  const utils = trpc.useUtils();

  const profile = profileQuery.data ?? user;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setEmail(profile.email ?? '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isDevAuthEnabled() && !profileQuery.data) {
      setMessage('Profile saved locally (dev mode). Connect backend for persistence.');
      return;
    }

    try {
      await updateMutation.mutateAsync({ name, email: email || undefined });
      setMessage('Profile updated successfully.');
      void utils.auth.getProfile.invalidate();
      void utils.auth.me.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.');
    }
  };

  const initial = profile?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <DashboardLayout activeTab="profile">
      <DashboardPageHeader
        title="Your Profile"
        description="Manage your account information"
      />

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Profile" />
        <Tab label="Payment Methods" disabled />
        <Tab label="Security" disabled />
        <Tab label="Notifications" disabled />
      </Tabs>

      {tab === 0 && (
        <Card sx={{ maxWidth: 560 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: 'primary.main',
                  border: 2,
                  borderColor: 'secondary.main',
                  fontSize: '1.75rem',
                }}
              >
                {initial}
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Account Reference</Typography>
                <Typography sx={{ fontFamily: 'monospace', fontWeight: 700 }} color="secondary.main">
                  {profile?.accountReference ?? user?.accountReference ?? '—'}
                </Typography>
              </Box>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {error && <Alert severity="error">{error}</Alert>}
              {message && <Alert severity="success">{message}</Alert>}

              <TextField
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label="Phone"
                value={profile?.phoneNumber ?? user?.phoneNumber ?? ''}
                disabled
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                disabled={updateMutation.isPending}
                sx={{ mt: 1 }}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
