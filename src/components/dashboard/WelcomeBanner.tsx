"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface WelcomeBannerProps {
  name: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function WelcomeBanner({ name }: WelcomeBannerProps) {
  return (
    <Box
      sx={{
        mb: 4,
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        background:
          "linear-gradient(135deg, #3a005f 0%, #6a0dad 60%, #2a004a 100%)",
        border: 1,
        borderColor: "divider",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          bgcolor: "rgba(212, 175, 55, 0.15)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          left: "30%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.05)",
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h4"
          color="secondary.main"
          sx={{ fontWeight: 800, mb: 0.5 }}
        >
          {getGreeting()}, {name}!
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
          Here&apos;s your property rate billing summary
        </Typography>
      </Box>
    </Box>
  );
}
