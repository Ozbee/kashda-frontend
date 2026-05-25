export const dynamic = 'force-dynamic';

import AuthGuard from '@/components/common/AuthGuard';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
