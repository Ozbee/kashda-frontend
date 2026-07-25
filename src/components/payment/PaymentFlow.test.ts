import { describe, it, expect } from "vitest";

/**
 * Pure logic extracted from PaymentFlow for unit testing.
 * The component itself requires tRPC providers, so we test the
 * validation / formatting functions directly.
 */
function validateMomoNumber(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Enter your mobile money number";
  if (!digits.startsWith("0")) return "Number must start with 0";
  if (digits.length !== 10) return "Enter a 10-digit phone number";
  return null;
}

function toLocalPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("233") && digits.length === 12) {
    return `0${digits.slice(3)}`;
  }
  if (digits.length === 9 && !digits.startsWith("0")) {
    return `0${digits}`;
  }
  return phone;
}

describe("toLocalPhone", () => {
  it("converts +233XXXXXXXXX to 0XXXXXXXXX", () => {
    expect(toLocalPhone("+233241234567")).toBe("0241234567");
  });

  it("converts 233XXXXXXXXX (no +) to 0XXXXXXXXX", () => {
    expect(toLocalPhone("233241234567")).toBe("0241234567");
  });

  it("prepends 0 to a bare 9-digit number", () => {
    expect(toLocalPhone("241234567")).toBe("0241234567");
  });

  it("returns a 10-digit local number unchanged", () => {
    expect(toLocalPhone("0241234567")).toBe("0241234567");
  });

  it("returns an empty string unchanged", () => {
    expect(toLocalPhone("")).toBe("");
  });
});

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
