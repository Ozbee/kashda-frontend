"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { revenueFeatures } from "@/content/landingContent";

const iconMap = {
  payment: PaymentsIcon,
  receipt: ReceiptLongIcon,
  sms: SmsOutlinedIcon,
} as const;

export default function RevenueFeaturesSection() {
  return (
    <Box
      id="services"
      component="section"
      sx={{ py: { xs: 8, md: 10 }, bgcolor: "background.default" }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          color="secondary.main"
          sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}
        >
          Revenue Collection Made Easy
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ textAlign: "center", maxWidth: 640, mx: "auto", mb: 6 }}
        >
          Everything you need to manage property rate payments in one secure
          platform.
        </Typography>

        <Grid container spacing={3}>
          {revenueFeatures.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: 360,
                    overflow: "hidden",
                    position: "relative",
                    transition: "transform 0.25s, box-shadow 0.25s",
                    "&:hover": { transform: "scale(1.02)", boxShadow: 8 },
                  }}
                >
                  <Image
                    src={feature.image}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(42,0,74,0.95) 0%, rgba(42,0,74,0.5) 50%, rgba(42,0,74,0.3) 100%)",
                    }}
                  />
                  <CardContent
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      p: 3,
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: "rgba(106, 13, 173, 0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "secondary.main",
                        mb: 2,
                      }}
                    >
                      <Icon />
                    </Box>
                    <Typography
                      variant="h5"
                      color="secondary.main"
                      sx={{ fontWeight: 700, mb: 1 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography color="text.primary">{feature.desc}</Typography>
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
