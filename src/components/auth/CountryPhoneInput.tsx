"use client";

import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  defaultCountries,
  FlagImage,
  parseCountry,
} from "react-international-phone";
import "react-international-phone/style.css";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";

export interface CountryPhoneInputProps {
  /** The raw local number (no leading 0, no country code) */
  value: string;
  /** Fires with the raw local digits the user typed */
  onChange: (localNumber: string) => void;
  /** Selected country ISO-2 code */
  country: string;
  /** Fires with the new ISO-2 country code */
  onCountryChange: (iso2: string) => void;
  error?: boolean;
  helperText?: string;
  label?: string;
}

/** Returns the dial code for an ISO-2 country code. */
export function dialCodeForCountry(iso2: string): string {
  const entry = defaultCountries.find((c) => parseCountry(c).iso2 === iso2);
  return entry ? parseCountry(entry).dialCode : "233";
}

/** Combines a country ISO-2 and local digits into E.164 format. */
export function toE164(iso2: string, localNumber: string): string {
  const dialCode = dialCodeForCountry(iso2);
  const digits = localNumber.replace(/\D/g, "");
  return `+${dialCode}${digits}`;
}

/**
 * Validates a local number for the Ghana convention:
 * exactly 9 digits, must not start with 0.
 */
export function validateLocalNumber(localNumber: string): string | null {
  const digits = localNumber.replace(/\D/g, "");
  if (!digits) return "Phone number is required";
  if (digits.startsWith("0")) return "Number should not start with 0";
  if (digits.length !== 9) return "Enter a 9-digit phone number";
  return null;
}

export default function CountryPhoneInput({
  value,
  onChange,
  country,
  onCountryChange,
  error,
  helperText,
  label = "Phone Number",
}: CountryPhoneInputProps) {
  const handleCountryChange = (e: SelectChangeEvent<string>) => {
    onCountryChange(e.target.value);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
    onChange(raw);
  };

  const dialCode = dialCodeForCountry(country);

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "stretch" }}>
        <Select
          value={country}
          onChange={handleCountryChange}
          renderValue={(iso2) => {
            const c = defaultCountries.find(
              (dc) => parseCountry(dc).iso2 === iso2,
            );
            if (!c) return iso2;
            const p = parseCountry(c);
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <FlagImage iso2={p.iso2} style={{ width: 24 }} />
                <Typography variant="body2">+{p.dialCode}</Typography>
              </Box>
            );
          }}
          sx={{
            minWidth: 120,
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
            },
          }}
          error={error}
        >
          {defaultCountries.map((c) => {
            const p = parseCountry(c);
            return (
              <MenuItem key={p.iso2} value={p.iso2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FlagImage iso2={p.iso2} style={{ width: 24 }} />
                  <Typography variant="body2" noWrap>
                    {p.name} +{p.dialCode}
                  </Typography>
                </Box>
              </MenuItem>
            );
          })}
        </Select>

        <TextField
          label={label}
          type="tel"
          value={value}
          onChange={handleNumberChange}
          error={error}
          placeholder={dialCode === "233" ? "24 123 4567" : ""}
          fullWidth
          slotProps={{
            htmlInput: { maxLength: 9, inputMode: "numeric" },
          }}
        />
      </Box>
      {helperText && (
        <FormHelperText error={error} sx={{ ml: 1 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}
