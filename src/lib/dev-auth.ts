import type { KashdaUser } from '@/types/api';
import { isDevAuthEnabled } from './env';

export function buildDevUser(params: {
  name: string;
  phone: string;
  email?: string;
  accountReference?: string;
}): KashdaUser {
  return {
    id: 1,
    openId: `dev-${params.phone}`,
    name: params.name,
    email: params.email ?? null,
    phoneNumber: params.phone,
    role: 'user',
    accountReference: params.accountReference ?? 'KSD-GHA-00001',
    isVerified: true,
  };
}

export function shouldUseDevFallback(_error?: unknown): boolean {
  return isDevAuthEnabled();
}
