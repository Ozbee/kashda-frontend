'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTrpcClient, TrpcProvider } from '@/lib/trpc';
import MuiThemeProvider from '@/components/providers/MuiThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1 },
        },
      })
  );
  const [trpcClient] = useState(() => createTrpcClient());

  return (
    <MuiThemeProvider>
      <TrpcProvider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </TrpcProvider>
    </MuiThemeProvider>
  );
}
