/**
 * Resolve the tRPC endpoint the browser talks to.
 *
 * By default we use the SAME-ORIGIN path `/api/trpc`, which Next.js rewrites to
 * the backend (see `next.config.ts`). Keeping requests first-party is what makes
 * the session cookie set during OTP verification persist to the follow-up
 * `auth.me` call — a cross-origin absolute URL causes the browser to treat the
 * session cookie as third-party and drop it, producing the
 * "account was verified but the session could not be saved" error.
 *
 * Set `NEXT_PUBLIC_BACKEND_URL` to an absolute `http(s)://` URL only if you
 * intentionally want to bypass the proxy (cross-origin cookies must then be
 * supported end-to-end).
 */
/** True when tRPC bypasses the same-origin /api proxy (breaks session cookies). */
export function isCrossOriginBackendUrl(url?: string): boolean {
  const target = url ?? process.env.NEXT_PUBLIC_BACKEND_URL?.trim() ?? '';
  return /^https?:\/\//i.test(target);
}

export function getBackendUrl(): string {
  const configured = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  const target = configured && configured.length > 0 ? configured : '/api/trpc';

  if (/^https?:\/\//i.test(target)) {
    if (
      typeof window !== 'undefined' &&
      process.env.NODE_ENV !== 'production'
    ) {
      console.warn(
        '[KASHDA] NEXT_PUBLIC_BACKEND_URL is cross-origin. Session cookies will not persist ' +
          'on the frontend host — use /api/trpc with BACKEND_ORIGIN instead.'
      );
    }
    return target;
  }

  const path = target.startsWith('/') ? target : `/${target}`;
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }
  return `http://localhost:3001${path}`;
}

export function isDevAuthEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_DEV_AUTH === 'true') return true;
  if (process.env.NEXT_PUBLIC_DEV_AUTH === 'false') return false;
  // Default off in production; local dev can set NEXT_PUBLIC_DEV_AUTH=true explicitly
  if (process.env.NODE_ENV === 'production') return false;
  return false;
}
