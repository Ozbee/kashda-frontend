'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { isDevAuthEnabled } from '@/lib/env';

/**
 * In dev-auth mode the session lives in sessionStorage (not a cookie), so
 * middleware cannot redirect authenticated users away from the landing page.
 * This component handles that client-side redirect only when dev-auth is on.
 */
export default function DevAuthHomeRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isDevAuthEnabled()) return;
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return null;
}
