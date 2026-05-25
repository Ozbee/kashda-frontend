'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SecurityIcon from '@mui/icons-material/Security';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { whyKashdaItems } from '@/content/landingContent';

const iconMap = {
  security: SecurityIcon,
  location: LocationOnIcon,
  sms: SmsOutlinedIcon,
  clock: AccessTimeIcon,
} as const;

export default function WhyKashdaSection() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" color="secondary.main" sx={{ fontWeight: 700, textAlign: 'center', mb: 1 }}>
          Why Choose KASHDA?
        </Typography>
        <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 6, maxWidth: 560, mx: 'auto' }}>
          Built for Ghanaian property owners who need reliable, transparent revenue collection.
        </Typography>

        <Grid container spacing={3}>
          {whyKashdaItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
                <Card
                  sx={{
                    height: '100%',
                    borderLeft: 4,
                    borderLeftColor: 'secondary.main',
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: 6 },
                  }}
                >
                  <CardContent sx={{ display: 'flex', gap: 2, p: 3 }}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 2,
                        bgcolor: 'primary.dark',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'secondary.main',
                        flexShrink: 0,
                      }}
                    >
                      <Icon />
                    </Box>
                    <Box>
                      <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
