import { describe, it, expect, afterEach, vi } from 'vitest';
import { getBackendUrl, isDevAuthEnabled } from './env';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getBackendUrl', () => {
  it('returns an absolute http(s) URL verbatim', () => {
    vi.stubEnv('NEXT_PUBLIC_BACKEND_URL', 'https://api.example.com/trpc');
    expect(getBackendUrl()).toBe('https://api.example.com/trpc');
  });

  it('defaults to the same-origin /api/trpc proxy path', () => {
    vi.stubEnv('NEXT_PUBLIC_BACKEND_URL', '');
    expect(getBackendUrl()).toMatch(/\/api\/trpc$/);
  });

  it('normalizes a relative path against the current origin', () => {
    vi.stubEnv('NEXT_PUBLIC_BACKEND_URL', 'custom/trpc');
    expect(getBackendUrl()).toMatch(/\/custom\/trpc$/);
  });
});

describe('isDevAuthEnabled', () => {
  it('is true only when explicitly set to "true"', () => {
    vi.stubEnv('NEXT_PUBLIC_DEV_AUTH', 'true');
    expect(isDevAuthEnabled()).toBe(true);
  });

  it('is false when explicitly disabled', () => {
    vi.stubEnv('NEXT_PUBLIC_DEV_AUTH', 'false');
    expect(isDevAuthEnabled()).toBe(false);
  });

  it('defaults to false when unset', () => {
    vi.stubEnv('NEXT_PUBLIC_DEV_AUTH', '');
    expect(isDevAuthEnabled()).toBe(false);
  });
});
