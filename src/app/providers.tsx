'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTrpcClient, TrpcProvider } from '@/lib/trpc';
import MuiThemeProvider from '@/components/providers/MuiThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, gcTime: 5 * 60_000 },
        },
      })
  );
  const [trpcClient] = useState(() => createTrpcClient());

  return (
    <MuiThemeProvider>
      <TrpcProvider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </TrpcProvider>
    </MuiThemeProvider>
  );
}
