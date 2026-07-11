import { describe, it, expect } from 'vitest';
import {
  sanitizeAuthRedirect,
  shouldRedirectOtpPageToLogin,
  getPostAuthRedirect,
  storeAuthRedirect,
} from './auth-session';

describe('sanitizeAuthRedirect', () => {
  it('defaults to /dashboard for missing or unsafe paths', () => {
    expect(sanitizeAuthRedirect(null)).toBe('/dashboard');
    expect(sanitizeAuthRedirect('')).toBe('/dashboard');
    expect(sanitizeAuthRedirect('https://evil.com')).toBe('/dashboard');
    expect(sanitizeAuthRedirect('//evil.com')).toBe('/dashboard');
  });

  it('allows in-app paths', () => {
    expect(sanitizeAuthRedirect('/dashboard/bills')).toBe('/dashboard/bills');
  });
});

describe('shouldRedirectOtpPageToLogin', () => {
  it('redirects when no auth context and verification not complete', () => {
    expect(
      shouldRedirectOtpPageToLogin({
        hasRegistrationData: false,
        hasLoginPhone: false,
        verificationComplete: false,
      })
    ).toBe(true);
  });

  it('does not redirect after verification even when sessionStorage was cleared', () => {
    expect(
      shouldRedirectOtpPageToLogin({
        hasRegistrationData: false,
        hasLoginPhone: false,
        verificationComplete: true,
      })
    ).toBe(false);
  });

  it('does not redirect when login phone is present', () => {
    expect(
      shouldRedirectOtpPageToLogin({
        hasRegistrationData: false,
        hasLoginPhone: true,
        verificationComplete: false,
      })
    ).toBe(false);
  });
});

describe('getPostAuthRedirect', () => {
  it('returns stored redirect and clears it', () => {
    storeAuthRedirect('/dashboard/payments');
    expect(getPostAuthRedirect()).toBe('/dashboard/payments');
    expect(getPostAuthRedirect()).toBe('/dashboard');
  });
});
