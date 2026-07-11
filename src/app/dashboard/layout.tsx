import AuthGuard from '@/components/common/AuthGuard';
import LocationGate from '@/components/location/LocationGate';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <LocationGate>{children}</LocationGate>
    </AuthGuard>
  );
}
