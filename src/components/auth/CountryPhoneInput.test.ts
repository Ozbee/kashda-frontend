import { describe, it, expect } from "vitest";
import {
  dialCodeForCountry,
  toE164,
  validateLocalNumber,
} from "./CountryPhoneInput";

describe("dialCodeForCountry", () => {
  it('returns "233" for Ghana (gh)', () => {
    expect(dialCodeForCountry("gh")).toBe("233");
  });

  it('returns "1" for the US', () => {
    expect(dialCodeForCountry("us")).toBe("1");
  });

  it('returns "44" for the UK', () => {
    expect(dialCodeForCountry("gb")).toBe("44");
  });

  it("falls back to 233 for an unknown code", () => {
    expect(dialCodeForCountry("zz")).toBe("233");
  });
});

describe("toE164", () => {
  it("combines Ghana code with a local number", () => {
    expect(toE164("gh", "241234567")).toBe("+233241234567");
  });

  it("strips non-digit characters from the local number", () => {
    expect(toE164("gh", "24 123 4567")).toBe("+233241234567");
  });

  it("works with other countries", () => {
    expect(toE164("us", "2025551234")).toBe("+12025551234");
  });
});

describe("validateLocalNumber", () => {
  it("returns null for a valid 9-digit number", () => {
    expect(validateLocalNumber("241234567")).toBeNull();
  });

  it("rejects an empty string", () => {
    expect(validateLocalNumber("")).toBe("Phone number is required");
  });

  it("rejects a number starting with 0", () => {
    expect(validateLocalNumber("024123456")).toBe(
      "Number should not start with 0",
    );
  });

  it("rejects a number shorter than 9 digits", () => {
    expect(validateLocalNumber("2412345")).toBe("Enter a 9-digit phone number");
  });

  it("rejects a number longer than 9 digits", () => {
    expect(validateLocalNumber("2412345678")).toBe(
      "Enter a 9-digit phone number",
    );
  });

  it("strips whitespace before validating", () => {
    expect(validateLocalNumber("24 123 4567")).toBeNull();
  });
});
