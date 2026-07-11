import AuthGuard from '@/components/common/AuthGuard';
import LocationGate from '@/components/location/LocationGate';
import { AuthProvider } from '@/contexts/AuthContext';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <LocationGate>{children}</LocationGate>
      </AuthGuard>
    </AuthProvider>
  );
}
