'use client';

import type { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { createElement, type ComponentType, type ReactNode } from 'react';
import superjson from 'superjson';
import { getBackendUrl } from './env';
import type { TrpcReact } from '@/types/trpc-client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const trpcReact = createTRPCReact<any>();

export const trpc = trpcReact as unknown as TrpcReact;

export function createTrpcClient() {
  return createTRPCClient({
    links: [
      httpBatchLink({
        url: getBackendUrl(),
        transformer: superjson,
        fetch(url, options) {
          return fetch(url, { ...options, credentials: 'include' });
        },
      }),
    ],
  });
}

export type TrpcClient = ReturnType<typeof createTrpcClient>;

/** Typed wrapper for tRPC React provider */
export function TrpcProvider({
  children,
  client,
  queryClient,
}: {
  children: ReactNode;
  client: TrpcClient;
  queryClient: QueryClient;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Provider = (trpcReact as any).Provider as ComponentType<{
    children?: ReactNode;
    client: TrpcClient;
    queryClient: QueryClient;
  }>;
  return createElement(Provider, { client, queryClient }, children);
}
