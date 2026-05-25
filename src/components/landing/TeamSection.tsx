'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { teamMembers } from '@/content/landingContent';

export default function TeamSection() {
  return (
    <Box id="team" component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" color="secondary.main" sx={{ fontWeight: 700, textAlign: 'center', mb: 6 }}>
          The Team
        </Typography>

        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {teamMembers.map((member) => (
            <Grid key={member.name} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  textAlign: 'center',
                  transition: 'transform 0.25s',
                  '&:hover': { transform: 'scale(1.03)' },
                }}
              >
                <CardContent sx={{ py: 4, px: 3 }}>
                  <Avatar
                    sx={{
                      width: 160,
                      height: 160,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: 'divider',
                      color: 'text.secondary',
                    }}
                  >
                    <PersonOutlinedIcon sx={{ fontSize: 72 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {member.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
