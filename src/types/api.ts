export type UserRole = "user" | "admin" | "field_agent";
export type LocationSource = "gps" | "manual";
export interface KashdaUser {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  phoneNumber?: string;
  role: UserRole;
  accountReference?: string;
  isVerified?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  locationSource?: LocationSource | null;
  hasLocation?: boolean;
}
export interface TaxBill {
  id: number;
  baseAmount: string | number;
  arrears: string | number;
  totalDue: string | number;
  status: string;
  dueDate: Date | string;
  billingMonth?: Date | string;
  payments?: Array<{
    id: number;
    amount: string | number;
    status: string;
    paymentReference?: string | null;
    createdAt: Date;
  }>;
}
export interface BillHistoryItem {
  id: number;
  billingMonth: Date | string;
  baseAmount: string | number;
  arrears: string | number;
  totalDue: string | number;
  status: string;
  dueDate: Date | string;
  createdAt: Date;
}
export interface UserProfile extends KashdaUser {
  phoneNumber: string;
  addressValue?: string;
}
export const PROPERTY_CATEGORY_IDS: Record<string, number> = {
  residential_low: 1,
  residential_high: 2,
  commercial: 3,
};
export const MOMO_NETWORKS = ["MTN", "Vodafone", "AirtelTigo"] as const;
export type MomoNetwork = (typeof MOMO_NETWORKS)[number];
