import LandingPage from '@/components/landing/LandingPage';
import DevAuthHomeRedirect from '@/components/landing/DevAuthHomeRedirect';
import { AuthProvider } from '@/contexts/AuthContext';
import { isDevAuthEnabled } from '@/lib/env';

export default function Home() {
  // Production: middleware redirects users with a session cookie to /dashboard,
  // so the landing page does not need AuthProvider or an auth.me poll.
  if (isDevAuthEnabled()) {
    return (
      <AuthProvider>
        <DevAuthHomeRedirect />
        <LandingPage />
      </AuthProvider>
    );
  }

  return <LandingPage />;
}
