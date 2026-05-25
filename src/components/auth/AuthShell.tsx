'use client';

import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { authTagline } from '@/content/landingContent';

interface AuthShellProps {
  children: React.ReactNode;
}

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '45%',
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 5,
        }}
      >
        <Image
          src={authTagline.image}
          alt=""
          fill
          priority
          sizes="45vw"
          style={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(42,0,74,0.95) 0%, rgba(42,0,74,0.6) 100%)',
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            color="secondary.main"
            sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}
          >
            {authTagline.headline}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', maxWidth: 400 }}>
            {authTagline.subtext}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 3 },
          py: 4,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          {children}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            <Link href="/" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 500 }}>
              &larr; Back to home
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
