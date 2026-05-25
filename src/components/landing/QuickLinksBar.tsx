'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { quickLinks } from '@/content/landingContent';

const iconMap = {
  payment: PaymentsIcon,
  receipt: ReceiptLongIcon,
  support: HelpOutlinedIcon,
  account: PersonAddIcon,
} as const;

export default function QuickLinksBar() {
  return (
    <Box sx={{ bgcolor: 'background.paper', py: { xs: 4, md: 5 }, mt: -4, position: 'relative', zIndex: 3 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h5"
          color="secondary.main"
          sx={{ fontWeight: 700, mb: 3, textAlign: { xs: 'center', md: 'left' } }}
        >
          Quick Links
        </Typography>
        <Grid container spacing={2}>
          {quickLinks.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <Grid key={link.label} size={{ xs: 6, md: 3 }}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                  }}
                >
                  <CardActionArea component={Link} href={link.href} sx={{ height: '100%', p: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: '50%',
                          bgcolor: 'primary.dark',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'secondary.main',
                        }}
                      >
                        <Icon />
                      </Box>
                      <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.95rem' }}>
                        {link.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {link.description}
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
