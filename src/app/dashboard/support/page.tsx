'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Link from 'next/link';
import QuizIcon from '@mui/icons-material/Quiz';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';

const supportCards = [
  {
    title: 'FAQs',
    description: 'Find answers to common questions about property tax payments.',
    icon: QuizIcon,
  },
  {
    title: 'Contact Us',
    description: 'Email support@kashda.com — Mon–Fri, 8am–5pm (GMT).',
    icon: MailOutlinedIcon,
  },
  {
    title: 'Report an Issue',
    description: 'Let us know if something isn\'t working as expected.',
    icon: ReportProblemOutlinedIcon,
  },
  {
    title: 'Live Chat',
    description: 'Chat with our support team (coming soon).',
    icon: ChatOutlinedIcon,
    disabled: true,
  },
];

export default function SupportPage() {
  return (
    <DashboardLayout activeTab="support">
      <DashboardPageHeader
        title="Support"
        description="We're here to help with your property tax payments"
      />

      <Grid container spacing={2} sx={{ maxWidth: 800, mb: 4 }}>
        {supportCards.map((item) => {
          const Icon = item.icon;
          return (
            <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
              <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                <CardContent>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'primary.dark',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'secondary.main',
                      mb: 2,
                    }}
                  >
                    <Icon />
                  </Box>
                  <Typography variant="h6" gutterBottom>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                  <Button variant="outlined" color="secondary" size="small" disabled={item.disabled}>
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Card sx={{ maxWidth: 640, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" color="secondary.main" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Box component="ul" sx={{ pl: 2, color: 'text.primary', '& li': { mb: 1.5 } }}>
            <li><strong>When are bills generated?</strong> — On the 1st of each month.</li>
            <li><strong>How do I pay?</strong> — Use Pay Now with MTN, Vodafone, or AirtelTigo mobile money.</li>
            <li><strong>Account reference?</strong> — Find it in the sidebar for manual payments.</li>
          </Box>
        </CardContent>
      </Card>

      <Button component={Link} href="/dashboard" color="secondary">
        ← Back to dashboard
      </Button>
    </DashboardLayout>
  );
}
