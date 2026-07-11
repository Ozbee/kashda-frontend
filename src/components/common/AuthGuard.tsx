'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, authChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authChecked && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authChecked, isAuthenticated, isLoading, router]);

  if (isLoading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-kashda-purple border-t-kashda-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
