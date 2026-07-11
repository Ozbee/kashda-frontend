'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MapIcon from '@mui/icons-material/Map';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import type { LatLng } from './MapPicker';
import type { LocationSource } from '@/types/api';

const MapPicker = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        flex: 1,
        minHeight: 200,
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

function formatCoords(loc: SelectedLocation): string {
  return `${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`;
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const mountedRef = useRef(true);
  const [manualOpen, setManualOpen] = useState(false);
  const [mapMounted, setMapMounted] = useState(false);
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

  const closeManualPicker = () => {
    setManualOpen(false);
    setMapMounted(false);
  };

  const openManualPicker = () => {
    setGpsError('');
    setManualOpen(true);
  };

  const confirmManualLocation = () => {
    if (pendingManual) {
      onChange({ ...pendingManual, source: 'manual' });
      closeManualPicker();
    }
  };

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
        closeManualPicker();
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
    <>
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
              variant={!manualOpen ? 'contained' : 'outlined'}
              startIcon={gpsLoading ? <CircularProgress size={18} color="inherit" /> : <MyLocationIcon />}
              onClick={detectGps}
              disabled={gpsLoading}
              fullWidth
            >
              {gpsLoading ? 'Detecting…' : 'Detect Automatically (GPS)'}
            </Button>
            <Button
              variant={manualOpen ? 'contained' : 'outlined'}
              color="secondary"
              startIcon={<MapIcon />}
              onClick={openManualPicker}
              fullWidth
            >
              Select Manually (Map)
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Dialog
        open={manualOpen}
        onClose={closeManualPicker}
        fullScreen={isSmallScreen}
        fullWidth
        maxWidth="md"
        aria-labelledby="manual-location-dialog-title"
        sx={
          isSmallScreen
            ? undefined
            : {
                '& .MuiDialog-paper': {
                  height: 'min(90vh, 720px)',
                  maxHeight: '90vh',
                },
              }
        }
        slotProps={{
          transition: {
            onEntered: () => setMapMounted(true),
          },
        }}
      >
        <DialogTitle
          id="manual-location-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            pr: 1,
          }}
        >
          <Typography component="span" variant="h6" sx={{ fontWeight: 600 }}>
            Select location on map
          </Typography>
          <IconButton
            aria-label="Close map picker"
            onClick={closeManualPicker}
            edge="end"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          {mapMounted && (
            <MapPicker
              initial={pendingManual}
              onPick={(pos) => setPendingManual(pos)}
              mapHeight="100%"
              fillContainer
            />
          )}
        </DialogContent>

        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, gap: 1, flexWrap: 'wrap' }}>
          <Button onClick={closeManualPicker} color="inherit">
            Use automatic (GPS)
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={!pendingManual}
            onClick={confirmManualLocation}
          >
            Confirm this location
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
