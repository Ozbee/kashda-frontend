/** Typed tRPC React hooks surface used by the frontend (matches kashda-backend routers). */

type QueryHook<T> = {
  useQuery: (
    input?: unknown,
    opts?: { enabled?: boolean; retry?: boolean | number; refetchOnWindowFocus?: boolean }
  ) => {
    data: T | undefined;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => Promise<unknown>;
  };
};

type MutationHook<TInput, TOutput> = {
  useMutation: (opts?: {
    onSuccess?: () => void;
  }) => {
    mutateAsync: (input: TInput) => Promise<TOutput>;
    isPending: boolean;
  };
};

type QueryUtils<T> = {
  invalidate: () => void;
  fetch: () => Promise<T>;
  setData: (data: T) => void;
};

import type {
  KashdaUser,
  TaxBill,
  BillHistoryItem,
  UserProfile,
  MomoNetwork,
} from './api';

export interface TrpcReact {
  useUtils: () => {
    auth: {
      me: QueryUtils<KashdaUser | null>;
      getProfile: { invalidate: () => void };
    };
    billing: {
      getCurrentBill: { invalidate: () => void };
      getPaymentHistory: { invalidate: () => void };
      getBillHistory: { invalidate: () => void };
    };
  };
  auth: {
    me: QueryHook<KashdaUser | null>;
    register: MutationHook<
      {
        name: string;
        phoneNumber: string;
        email?: string;
        addressType: string;
        addressValue: string;
        propertyCategoryId: number;
      },
      { success: boolean; phoneNumber: string; accountReference?: string }
    >;
    requestOtp: MutationHook<
      { phoneNumber: string },
      { success: boolean; phoneNumber: string; message?: string }
    >;
    verifyOtp: MutationHook<
      { phoneNumber: string; otpCode: string },
      { success: boolean; user?: KashdaUser; message?: string }
    >;
    logout: MutationHook<void, { success: boolean }>;
    getProfile: QueryHook<UserProfile>;
    updateProfile: MutationHook<
      { name?: string; email?: string },
      { success: boolean; message?: string }
    >;
  };
  billing: {
    getCurrentBill: QueryHook<TaxBill | null>;
    getBillHistory: QueryHook<BillHistoryItem[]>;
    getBillDetails: QueryHook<TaxBill>;
    getPaymentHistory: QueryHook<
      {
        id: number;
        billId: number;
        amount: string | number;
        status: string;
        paymentReference?: string | null;
        createdAt: Date;
        billingMonth: string | Date;
      }[]
    >;
  };
  payment: {
    initiateMobileMoneyPayment: MutationHook<
      { billId: number; momoNumber: string; momoNetwork: MomoNetwork },
      { success: boolean; paymentReference: string; message?: string }
    >;
    verifyPaymentStatus: QueryHook<{
      status: string;
      amount?: number;
      reference?: string;
    }>;
  };
}
