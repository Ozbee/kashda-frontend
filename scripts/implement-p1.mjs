import fs from "fs";
import path from "path";
const root = path.resolve(import.meta.dirname, "..");
const w = (rel, content) => {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
  console.log("wrote", rel);
};

w("src/types/api.ts", `export type UserRole = "user" | "admin" | "field_agent";
export interface KashdaUser {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  phoneNumber?: string;
  role: UserRole;
  accountReference?: string;
  isVerified?: boolean;
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
`);

w("src/components/common/KashdaLogo.tsx", `'use client';
import Image from "next/image";

export default function KashdaLogo({
  width = 150,
  height = 40,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src="/kashda_logo.svg"
      alt="KASHDA"
      width={width}
      height={height}
      priority
    />
  );
}
`);

w("src/components/common/AuthGuard.tsx", `'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-kashda-purple border-t-kashda-gold rounded-full animate-spin" />
      </motion.div>
    );
  }

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
`.replaceAll("motion.div", "motion.div").replaceAll("motion.div", "div"));

console.log("done part 1");