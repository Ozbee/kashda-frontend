'use client';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyIcon from '@mui/icons-material/Key';

interface QuickStatsProps {
  totalPaid: number;
  totalDue: number;
  lastPaymentDate?: string;
  accountReference: string;
}

export default function QuickStats({
  totalPaid,
  totalDue,
  lastPaymentDate,
  accountReference,
}: QuickStatsProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const stats = [
    {
      label: 'Total Paid',
      value: formatCurrency(totalPaid),
      icon: CheckCircleOutlinedIcon,
      iconBg: 'success.dark',
      iconColor: 'success.main',
    },
    {
      label: 'Amount Due',
      value: formatCurrency(totalDue),
      icon: ScheduleIcon,
      iconBg: 'warning.dark',
      iconColor: 'warning.main',
    },
    {
      label: 'Last Payment',
      value: formatDate(lastPaymentDate),
      icon: CalendarTodayIcon,
      iconBg: 'info.dark',
      iconColor: 'info.main',
    },
    {
      label: 'Account Reference',
      value: accountReference,
      icon: KeyIcon,
      iconBg: 'primary.dark',
      iconColor: 'secondary.main',
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card
              sx={{
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        wordBreak: 'break-word',
                        color: stat.label === 'Total Paid' ? 'secondary.main' : 'text.primary',
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: stat.iconBg,
                      color: stat.iconColor,
                    }}
                  >
                    <Icon fontSize="small" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
