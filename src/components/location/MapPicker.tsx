'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import type * as LeafletNS from 'leaflet';

/** Accra, Ghana — sensible default centre for a Ghana-focused product. */
const DEFAULT_CENTER: [number, number] = [5.6037, -0.187];

export interface LatLng {
  latitude: number;
  longitude: number;
}

interface MapPickerProps {
  initial?: LatLng | null;
  onPick: (pos: LatLng) => void;
}

/**
 * Interactive OpenStreetMap picker (free provider) built directly on Leaflet.
 * Users can search a place, pan/zoom, click the map or drag the pin, and the
 * current pin coordinates are reported back to the parent via `onPick`.
 */
export default function MapPicker({ initial, onPick }: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletNS.Map | null>(null);
  const markerRef = useRef<LeafletNS.Marker | null>(null);
  const leafletRef = useRef<typeof LeafletNS | null>(null);
  const initialRef = useRef<LatLng | null>(initial ?? null);
  const onPickRef = useRef(onPick);

  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  useEffect(() => {
    let cancelled = false;
    let invalidateTimer: ReturnType<typeof setTimeout> | undefined;

    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      leafletRef.current = L;

      const start: [number, number] = initialRef.current
        ? [initialRef.current.latitude, initialRef.current.longitude]
        : DEFAULT_CENTER;

      const map = L.map(containerRef.current).setView(start, initialRef.current ? 15 : 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const icon = L.divIcon({
        className: 'kashda-map-pin',
        html: '<div style="font-size:30px;line-height:30px;transform:translate(-50%,-100%)">📍</div>',
        iconSize: [30, 30],
        iconAnchor: [0, 0],
      });

      const marker = L.marker(start, { draggable: true, icon }).addTo(map);
      markerRef.current = marker;
      mapRef.current = map;

      const report = (lat: number, lng: number) =>
        onPickRef.current({ latitude: lat, longitude: lng });

      if (initialRef.current) {
        report(initialRef.current.latitude, initialRef.current.longitude);
      }

      marker.on('dragend', () => {
        const { lat, lng } = marker.getLatLng();
        report(lat, lng);
      });
      map.on('click', (e: LeafletNS.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        report(e.latlng.lat, e.latlng.lng);
      });

      // The container may not have its final size on first paint.
      invalidateTimer = setTimeout(() => {
        if (!cancelled) map.invalidateSize();
      }, 120);
    })();

    return () => {
      cancelled = true;
      if (invalidateTimer !== undefined) clearTimeout(invalidateTimer);
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) return;
    setSearching(true);
    setSearchError('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
        { headers: { Accept: 'application/json' } }
      );
      const data = (await res.json()) as Array<{ lat: string; lon: string }>;
      if (!Array.isArray(data) || data.length === 0) {
        setSearchError('No results found for that search. Try a different place or drop a pin manually.');
        return;
      }
      const latN = parseFloat(data[0].lat);
      const lngN = parseFloat(data[0].lon);
      const map = mapRef.current;
      const marker = markerRef.current;
      if (map && marker) {
        map.setView([latN, lngN], 16);
        marker.setLatLng([latN, lngN]);
        onPickRef.current({ latitude: latN, longitude: lngN });
      }
    } catch {
      setSearchError('Search failed. Check your connection and try again.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search for a place or address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void handleSearch();
            }
          }}
        />
        <Button
          variant="outlined"
          onClick={() => void handleSearch()}
          disabled={searching || !searchQuery.trim()}
        >
          {searching ? 'Searching…' : 'Search'}
        </Button>
      </Stack>

      {searchError && <Alert severity="warning">{searchError}</Alert>}

      <Box
        ref={containerRef}
        sx={{
          height: 300,
          width: '100%',
          borderRadius: 1,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      />

      <Typography variant="caption" color="text.secondary">
        Tap the map or drag the pin to mark your property, then confirm below.
      </Typography>
    </Stack>
  );
}
