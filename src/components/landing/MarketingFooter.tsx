'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import KashdaLogo from '@/components/common/KashdaLogo';
import { footerLinks } from '@/content/landingContent';

const socialLinks = [
  { icon: FacebookIcon, label: 'Facebook' },
  { icon: TwitterIcon, label: 'Twitter' },
  { icon: LinkedInIcon, label: 'LinkedIn' },
  { icon: InstagramIcon, label: 'Instagram' },
] as const;

export default function MarketingFooter() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <KashdaLogo />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
          {socialLinks.map(({ icon: Icon, label }) => (
            <IconButton
              key={label}
              component="a"
              href="#"
              aria-label={label}
              sx={{ color: 'text.secondary', '&:hover': { color: 'secondary.main' } }}
            >
              <Icon />
            </IconButton>
          ))}
        </Box>

        <Box
          component="ul"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: { xs: 2, md: 4 },
            listStyle: 'none',
            m: 0,
            p: 0,
            mb: 3,
          }}
        >
          {footerLinks.map((link) => (
            <Box component="li" key={link.label}>
              <Typography
                component={Link}
                href={link.href}
                variant="body2"
                sx={{
                  color: 'text.primary',
                  textDecoration: 'none',
                  '&:hover': { color: 'secondary.main' },
                }}
              >
                {link.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} KASHDA. Property tax revenue collection in Ghana.
        </Typography>
      </Container>
    </Box>
  );
}
