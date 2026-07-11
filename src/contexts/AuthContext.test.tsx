import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// --- Mocks ---------------------------------------------------------------
// A mutable holder so each test can control what auth.me returns.
const meState: { data: unknown; isLoading: boolean } = {
  data: null,
  isLoading: false,
};

const setData = vi.fn();
const invalidate = vi.fn();
const refetch = vi.fn();
const mutateAsync = vi.fn().mockResolvedValue(undefined);

vi.mock('@/lib/trpc', () => ({
  trpc: {
    useUtils: () => ({ auth: { me: { setData, invalidate } } }),
    auth: {
      me: {
        useQuery: () => ({
          data: meState.data,
          isLoading: meState.isLoading,
          refetch,
        }),
      },
      logout: {
        useMutation: () => ({ mutateAsync }),
      },
    },
  },
}));

vi.mock('@/lib/env', () => ({
  isDevAuthEnabled: () => false,
}));

import { AuthProvider, useAuth } from './AuthContext';

function Consumer() {
  const { user, isAuthenticated, isLoading } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authed">{String(isAuthenticated)}</span>
      <span data-testid="name">{user?.name ?? 'none'}</span>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    meState.data = null;
    meState.isLoading = false;
    vi.clearAllMocks();
  });

  it('exposes an authenticated user returned by auth.me', async () => {
    meState.data = { id: 1, name: 'Ama Owusu' };

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    expect(await screen.findByTestId('authed')).toHaveTextContent('true');
    expect(screen.getByTestId('name')).toHaveTextContent('Ama Owusu');
  });

  it('reports an unauthenticated state when auth.me has no user', async () => {
    meState.data = null;

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    expect(await screen.findByTestId('authed')).toHaveTextContent('false');
    expect(screen.getByTestId('name')).toHaveTextContent('none');
  });

  it('throws when useAuth is used outside of an AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow(
      /must be used within an AuthProvider/
    );
    spy.mockRestore();
  });
});
