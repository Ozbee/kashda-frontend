'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function FinalCTABanner() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        background: 'linear-gradient(135deg, #3a005f 0%, #6a0dad 50%, #2a004a 100%)',
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography variant="h3" color="secondary.main" sx={{ fontWeight: 700, mb: 2 }}>
          Ready to manage your property tax?
        </Typography>
        <Typography color="text.primary" sx={{ mb: 4, fontSize: '1.1rem' }}>
          Join thousands of Ghanaian property owners paying securely via mobile money.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button component={Link} href="/register" variant="contained" color="secondary" size="large" sx={{ px: 4 }}>
            Get Started Free
          </Button>
          <Button
            component={Link}
            href="/login"
            variant="outlined"
            size="large"
            sx={{ borderColor: 'secondary.main', color: 'secondary.main', px: 4 }}
          >
            Sign In
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
