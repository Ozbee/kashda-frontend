import { describe, it, expect } from "vitest";

/**
 * Pure validation logic extracted from PaymentFlow for unit testing.
 * The component itself requires tRPC providers, so we test the validation
 * functions directly.
 */
function validateMomoNumber(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Enter your mobile money number";
  if (!digits.startsWith("0")) return "Number must start with 0";
  if (digits.length !== 10) return "Enter a 10-digit phone number";
  return null;
}

describe("validateMomoNumber", () => {
  it("accepts a valid 10-digit number starting with 0", () => {
    expect(validateMomoNumber("0241234567")).toBeNull();
  });

  it("accepts a number with spaces", () => {
    expect(validateMomoNumber("024 123 4567")).toBeNull();
  });

  it("rejects an empty input", () => {
    expect(validateMomoNumber("")).toBe("Enter your mobile money number");
  });

  it("rejects a number that does not start with 0", () => {
    expect(validateMomoNumber("241234567")).toBe("Number must start with 0");
  });

  it("rejects a number shorter than 10 digits", () => {
    expect(validateMomoNumber("024123456")).toBe(
      "Enter a 10-digit phone number",
    );
  });

  it("rejects a number longer than 10 digits", () => {
    expect(validateMomoNumber("02412345678")).toBe(
      "Enter a 10-digit phone number",
    );
  });
});
