'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useEffect,
  useState,
} from 'react';
import { trpc } from '@/lib/trpc';
import type { KashdaUser } from '@/types/api';
import { isDevAuthEnabled } from '@/lib/env';

export type User = KashdaUser;

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetchUser: () => void;
  logout: () => Promise<void>;
  setDevUser: (user: User | null) => void;
}

const DEV_USER_KEY = 'kashda_dev_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [devUser, setDevUserState] = useState<User | null>(null);
  const [devHydrated, setDevHydrated] = useState(false);
  const utils = trpc.useUtils();

  useEffect(() => {
    if (isDevAuthEnabled()) {
      try {
        const raw = sessionStorage.getItem(DEV_USER_KEY);
        if (raw) setDevUserState(JSON.parse(raw) as User);
      } catch {
        sessionStorage.removeItem(DEV_USER_KEY);
      }
    }
    setDevHydrated(true);
  }, []);

  const setDevUser = useCallback((user: User | null) => {
    setDevUserState(user);
    if (user) {
      sessionStorage.setItem(DEV_USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(DEV_USER_KEY);
    }
  }, []);

  const useApi = !isDevAuthEnabled() || !devUser;

  const meQuery = trpc.auth.me.useQuery(undefined, {
    enabled: useApi && devHydrated,
    retry: false,
    refetchOnWindowFocus: true,
  });

  const logoutMutation = trpc.auth.logout.useMutation();

  const apiUser = meQuery.data as User | null | undefined;
  const user = isDevAuthEnabled() && devUser ? devUser : apiUser ?? null;

  const logout = useCallback(async () => {
    setDevUser(null);
    try {
      if (!isDevAuthEnabled()) {
        await logoutMutation.mutateAsync(undefined as void);
      }
    } catch {
      /* session may already be cleared */
    }
    utils.auth.me.invalidate();
  }, [setDevUser, logoutMutation, utils.auth.me]);

  const isLoading =
    !devHydrated || (useApi && meQuery.isLoading && !user);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      refetchUser: () => void meQuery.refetch(),
      logout,
      setDevUser,
    }),
    [user, isLoading, meQuery.refetch, logout, setDevUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
