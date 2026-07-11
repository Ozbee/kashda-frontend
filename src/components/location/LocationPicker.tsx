'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MapIcon from '@mui/icons-material/Map';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { LatLng } from './MapPicker';
import type { LocationSource } from '@/types/api';

const MapPicker = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <CircularProgress size={28} color="secondary" />
    </Box>
  ),
});

export interface SelectedLocation {
  latitude: number;
  longitude: number;
  source: LocationSource;
}

interface LocationPickerProps {
  value: SelectedLocation | null;
  onChange: (location: SelectedLocation) => void;
}

type Mode = 'choose' | 'manual';

function formatCoords(loc: SelectedLocation): string {
  return `${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`;
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const mountedRef = useRef(true);
  const [mode, setMode] = useState<Mode>('choose');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [pendingManual, setPendingManual] = useState<LatLng | null>(
    value?.source === 'manual' ? { latitude: value.latitude, longitude: value.longitude } : null
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const detectGps = () => {
    setGpsError('');
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setGpsError('Your device or browser does not support automatic GPS detection. Please select your location manually.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!mountedRef.current) return;
        setGpsLoading(false);
        onChange({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          source: 'gps',
        });
        setMode('choose');
      },
      (err) => {
        if (!mountedRef.current) return;
        setGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError(
            'Location access was denied. KASHDA needs your location to continue. Please enable location permissions for this site in your browser settings, then try again — or choose "Select Manually" to drop a pin on the map.'
          );
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGpsError('We could not determine your location right now. Please try again or select your location manually.');
        } else if (err.code === err.TIMEOUT) {
          setGpsError('Getting your location timed out. Please try again or select your location manually.');
        } else {
          setGpsError('Could not get your location. Please try again or select your location manually.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  if (value) {
    return (
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'success.light',
          borderRadius: 1,
          p: 2,
          bgcolor: 'success.50',
        }}
      >
        <Stack direction="row" spacing={1} sx={{ mb: 0.5, alignItems: 'center' }}>
          <CheckCircleIcon color="success" fontSize="small" />
          <Typography sx={{ fontWeight: 600 }}>
            Location captured ({value.source === 'gps' ? 'Automatic GPS' : 'Manual pin'})
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Coordinates: {formatCoords(value)}
        </Typography>
        <Button
          size="small"
          sx={{ mt: 1 }}
          onClick={() => {
            setMode('choose');
            setGpsError('');
            onChange(null as unknown as SelectedLocation);
          }}
        >
          Change location
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
      }}
    >
      <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Property Location</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Choose how you want to provide your property location.
      </Typography>

      <Stack spacing={2}>
        {gpsError && <Alert severity="error">{gpsError}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button
            variant={mode === 'choose' ? 'contained' : 'outlined'}
            startIcon={gpsLoading ? <CircularProgress size={18} color="inherit" /> : <MyLocationIcon />}
            onClick={detectGps}
            disabled={gpsLoading}
            fullWidth
          >
            {gpsLoading ? 'Detecting…' : 'Detect Automatically (GPS)'}
          </Button>
          <Button
            variant={mode === 'manual' ? 'contained' : 'outlined'}
            color="secondary"
            startIcon={<MapIcon />}
            onClick={() => {
              setGpsError('');
              setMode('manual');
            }}
            fullWidth
          >
            Select Manually (Map)
          </Button>
        </Stack>

        {mode === 'manual' && (
          <Stack spacing={1.5}>
            <MapPicker
              initial={pendingManual}
              onPick={(pos) => setPendingManual(pos)}
            />
            <Button
              variant="contained"
              disabled={!pendingManual}
              onClick={() => {
                if (pendingManual) {
                  onChange({ ...pendingManual, source: 'manual' });
                  setMode('choose');
                }
              }}
            >
              Confirm this location
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
