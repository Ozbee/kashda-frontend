'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentsIcon from '@mui/icons-material/Payments';
import { howItWorksSteps } from '@/content/landingContent';

const iconMap = {
  register: PersonAddIcon,
  verify: VerifiedUserIcon,
  bill: ReceiptLongIcon,
  momo: PaymentsIcon,
} as const;

export default function HowItWorksSection() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" color="secondary.main" sx={{ fontWeight: 700, textAlign: 'center', mb: 1 }}>
          How It Works
        </Typography>
        <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 6, maxWidth: 520, mx: 'auto' }}>
          Four simple steps from registration to payment confirmation.
        </Typography>

        <Grid container spacing={3}>
          {howItWorksSteps.map((step) => {
            const Icon = iconMap[step.icon];
            return (
              <Grid key={step.step} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-6px)' },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        fontWeight: 800,
                        fontSize: '1.25rem',
                        position: 'relative',
                      }}
                    >
                      {step.step}
                    </Box>
                    <Box sx={{ color: 'secondary.main', mb: 1.5 }}>
                      <Icon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600, mb: 1 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
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
