const AUTH_REDIRECT_KEY = 'auth_redirect';
const AUTH_FLOW_KEY = 'auth_flow';

/** Safe in-app paths only (blocks open redirects). */
export function sanitizeAuthRedirect(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard';
  }
  return value;
}

export function storeAuthRedirect(path: string): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(AUTH_REDIRECT_KEY, sanitizeAuthRedirect(path));
}

export function getPostAuthRedirect(): string {
  if (typeof sessionStorage === 'undefined') return '/dashboard';
  const stored = sessionStorage.getItem(AUTH_REDIRECT_KEY);
  sessionStorage.removeItem(AUTH_REDIRECT_KEY);
  return sanitizeAuthRedirect(stored);
}

export function storeAuthFlow(flow: 'login' | 'register'): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(AUTH_FLOW_KEY, flow);
}

export function clearAuthSessionStorage(): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem('registration_data');
  sessionStorage.removeItem('login_phone');
  sessionStorage.removeItem(AUTH_FLOW_KEY);
  sessionStorage.removeItem('development_otp');
}

/**
 * OTP page mount guard — skip redirect to /login after verification succeeds
 * even when registration/login sessionStorage keys were cleared.
 */
export function shouldRedirectOtpPageToLogin(options: {
  hasRegistrationData: boolean;
  hasLoginPhone: boolean;
  verificationComplete: boolean;
}): boolean {
  if (options.verificationComplete) return false;
  return !options.hasRegistrationData && !options.hasLoginPhone;
}
