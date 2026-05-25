'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
}

export default function DashboardPageHeader({ title, description }: DashboardPageHeaderProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 700 }} gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}
