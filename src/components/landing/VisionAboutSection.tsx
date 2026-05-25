'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { visionContent } from '@/content/landingContent';

export default function VisionAboutSection() {
  return (
    <Box id="about" component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="md">
        <Typography variant="h3" color="secondary.main" sx={{ fontWeight: 700, textAlign: 'center', mb: 3 }}>
          {visionContent.title}
        </Typography>
        {visionContent.paragraphs.map((paragraph) => (
          <Typography
            key={paragraph.slice(0, 40)}
            color="text.primary"
            sx={{ textAlign: 'center', mb: 3, lineHeight: 1.8, fontSize: '1.05rem' }}
          >
            {paragraph}
          </Typography>
        ))}

        <Box sx={{ mt: 6, pt: 6, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 700, textAlign: 'center', mb: 2 }}>
            {visionContent.aboutTitle}
          </Typography>
          <Typography color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.8 }}>
            {visionContent.aboutText}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
