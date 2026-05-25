import OTPVerification from '@/components/auth/OTPVerification';

export const metadata = {
  title: 'Verify OTP - KASHDA',
  description: 'Verify your phone number with OTP',
};

export default function VerifyOTPPage() {
  return <OTPVerification />;
}
