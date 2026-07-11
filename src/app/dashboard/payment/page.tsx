"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import PaymentFlow from "@/components/payment/PaymentFlow";
import { useAuth } from "@/contexts/AuthContext";
import { isDevAuthEnabled } from "@/lib/env";

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const billIdParam = searchParams.get("billId");
  const billId = billIdParam ? parseInt(billIdParam, 10) : 1;

  if (!billIdParam && !isDevAuthEnabled()) {
    return (
      <DashboardLayout activeTab="overview">
        <Typography color="text.secondary">
          No bill selected. Go to your dashboard and click Pay Now.
        </Typography>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="overview">
      <DashboardPageHeader
        title="Pay Property Rate"
        description="Complete your payment securely via mobile money"
      />
      <PaymentFlow
        billId={Number.isNaN(billId) ? 1 : billId}
        defaultPhone={user?.phoneNumber ?? ""}
      />
    </DashboardLayout>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout activeTab="overview">
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress color="secondary" />
          </Box>
        </DashboardLayout>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
