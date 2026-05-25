export function getBackendUrl(): string {
  return process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3000/api/trpc';
}

export function isDevAuthEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_DEV_AUTH === 'true') return true;
  if (process.env.NEXT_PUBLIC_DEV_AUTH === 'false') return false;
  // Default off in production; local dev can set NEXT_PUBLIC_DEV_AUTH=true explicitly
  if (process.env.NODE_ENV === 'production') return false;
  return false;
}

export function getAppName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME ?? 'KASHDA';
}
