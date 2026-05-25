'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 3 },
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h2" color="secondary.main" sx={{ fontWeight: 700 }} gutterBottom>
        404
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        This page could not be found.
      </Typography>
      <Button component={Link} href="/" variant="contained">
        Go Home
      </Button>
    </Box>
  );
}
