'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import LocationPicker, { type SelectedLocation } from '@/components/location/LocationPicker';
import { useAuth } from '@/contexts/AuthContext';
import { trpc } from '@/lib/trpc';
import { isDevAuthEnabled } from '@/lib/env';

/**
 * Blocks access to the app for authenticated users who have no stored GPS
 * location, prompting them to complete location setup. Users who already have
 * a valid location are never prompted.
 */
export default function LocationGate({ children }: { children: React.ReactNode }) {
  const { user, applyVerifiedUser } = useAuth();
  const utils = trpc.useUtils();
  const updateLocationMutation = trpc.auth.updateLocation.useMutation();

  const [location, setLocation] = useState<SelectedLocation | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Dev-auth sessions have no backend session to persist against, so skip the gate.
  const needsLocation = !isDevAuthEnabled() && !!user && user.hasLocation === false;

  if (!needsLocation) {
    return <>{children}</>;
  }

  const handleSave = async () => {
    if (!location) {
      setError('Please provide your location to continue.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const result = await updateLocationMutation.mutateAsync({
        latitude: location.latitude,
        longitude: location.longitude,
        locationSource: location.source,
      });
      if (result.user) {
        applyVerifiedUser(result.user);
      }
      await utils.auth.me.invalidate();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not save your location. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ maxWidth: 560, width: '100%', boxShadow: 6 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h5" color="secondary.main" sx={{ fontWeight: 700 }} gutterBottom>
            Complete Your Location Setup
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Before you continue, we need your property location. You can detect it
            automatically with GPS or drop a pin on the map.
          </Typography>

          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            <LocationPicker value={location} onChange={setLocation} />

            <Button
              variant="contained"
              fullWidth
              disabled={saving || !location}
              onClick={() => void handleSave()}
            >
              {saving ? 'Saving…' : 'Save Location & Continue'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
