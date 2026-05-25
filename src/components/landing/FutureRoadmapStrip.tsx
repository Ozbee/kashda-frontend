'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { futureModules } from '@/content/landingContent';

export default function FutureRoadmapStrip() {
  return (
    <Box component="section" sx={{ py: 5, bgcolor: 'background.paper', borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
          Expanding our platform — coming soon
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
          {futureModules.map((module) => (
            <Chip
              key={module}
              label={`${module} — Coming Soon`}
              variant="outlined"
              sx={{
                opacity: 0.6,
                borderColor: 'divider',
                color: 'text.secondary',
                cursor: 'default',
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
