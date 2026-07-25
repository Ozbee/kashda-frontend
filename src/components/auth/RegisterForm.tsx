"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import KashdaLogo from "@/components/common/KashdaLogo";
import AuthShell from "@/components/auth/AuthShell";
import LocationPicker, {
  type SelectedLocation,
} from "@/components/location/LocationPicker";
import CountryPhoneInput, {
  toE164,
  validateLocalNumber,
} from "@/components/auth/CountryPhoneInput";
import { trpc } from "@/lib/trpc";
import { storeAuthFlow } from "@/lib/auth-session";
import { PROPERTY_CATEGORY_IDS } from "@/types/api";

interface RegisterFormData {
  name: string;
  phone: string;
  email: string;
  propertyCategory: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const registerMutation = trpc.auth.register.useMutation();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    phone: "",
    email: "",
    propertyCategory: "residential_low",
  });
  const [country, setCountry] = useState("gh");
  const [location, setLocation] = useState<SelectedLocation | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }

    const phoneError = validateLocalNumber(formData.phone);
    if (phoneError) {
      setError(phoneError);
      return false;
    }

    if (!location) {
      setError("Please provide your property location to continue.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!location) return;

    const phoneE164 = toE164(country, formData.phone);

    setLoading(true);
    try {
      const addressValue = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
      const result = await registerMutation.mutateAsync({
        name: formData.name,
        phoneNumber: phoneE164,
        email: formData.email || undefined,
        latitude: location.latitude,
        longitude: location.longitude,
        locationSource: location.source,
        addressType: "gps",
        addressValue,
        propertyCategoryCode: formData.propertyCategory as
          | "residential_low"
          | "residential_high"
          | "commercial",
        propertyCategoryId:
          PROPERTY_CATEGORY_IDS[formData.propertyCategory] ?? 1,
      });

      const resultPhone =
        result.phoneNumber ?? phoneE164;
      sessionStorage.setItem(
        "registration_data",
        JSON.stringify({
          ...formData,
          phone: resultPhone,
          accountReference: result.accountReference,
        }),
      );
      if ("developmentOtp" in result && result.developmentOtp) {
        sessionStorage.setItem(
          "development_otp",
          String(result.developmentOtp),
        );
      } else {
        sessionStorage.removeItem("development_otp");
      }
      sessionStorage.setItem("login_phone", resultPhone);
      storeAuthFlow("register");
      router.push("/verify-otp");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
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
            Create Account
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Join KASHDA to manage your property rate easily
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />

              <CountryPhoneInput
                value={formData.phone}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, phone: val }));
                  setError("");
                }}
                country={country}
                onCountryChange={setCountry}
                error={!!error && error.toLowerCase().includes("phone")}
              />

              <TextField
                label="Email (Optional)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
              />
              <LocationPicker value={location} onChange={setLocation} />
              <TextField
                select
                label="Property Category"
                name="propertyCategory"
                value={formData.propertyCategory}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="residential_low">
                  Residential (Low-Income)
                </MenuItem>
                <MenuItem value="residential_high">
                  Residential (High-Income)
                </MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
              </TextField>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              <Typography sx={{ textAlign: "center" }} color="text.secondary">
                Already have an account?{" "}
                <Link
                  href="/login"
                  style={{
                    color: "#d4af37",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
