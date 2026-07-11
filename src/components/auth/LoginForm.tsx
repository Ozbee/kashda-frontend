"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import KashdaLogo from "@/components/common/KashdaLogo";
import AuthShell from "@/components/auth/AuthShell";
import { isDevAuthEnabled } from "@/lib/env";
import { trpc } from "@/lib/trpc";

export default function LoginForm() {
  const router = useRouter();
  const requestOtpMutation = trpc.auth.requestOtp.useMutation();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!/^\+?[0-9]{10,15}$/.test(phone.replace(/\s/g, ""))) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      const normalized = phone.replace(/\s/g, "");
      if (!isDevAuthEnabled()) {
        const result = await requestOtpMutation.mutateAsync({
          phoneNumber: normalized,
        });
        if ("developmentOtp" in result && result.developmentOtp) {
          sessionStorage.setItem(
            "development_otp",
            String(result.developmentOtp),
          );
        } else {
          sessionStorage.removeItem("development_otp");
        }
      }
      sessionStorage.removeItem("registration_data");
      sessionStorage.setItem("login_phone", normalized);
      sessionStorage.setItem("auth_flow", "login");
      router.push("/verify-otp");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <KashdaLogo />
      </Box>

      <Card sx={{ boxShadow: 6 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h4"
            color="secondary.main"
            sx={{ fontWeight: 700 }}
            gutterBottom
          >
            Welcome Back
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Sign in with your phone number to manage your property rate
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError("");
                }}
                placeholder="+233 24 123 4567"
                required
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Sign In"}
              </Button>

              <Typography sx={{ textAlign: "center" }} color="text.secondary">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  style={{
                    color: "#d4af37",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Create Account
                </Link>
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {isDevAuthEnabled() && (
        <Typography
          variant="caption"
          color="warning.main"
          sx={{ mt: 2, display: "block", textAlign: "center" }}
        >
          Dev mode: any 6-digit OTP will sign you in.
        </Typography>
      )}
    </AuthShell>
  );
}
