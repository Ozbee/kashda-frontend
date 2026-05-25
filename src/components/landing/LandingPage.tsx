'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import MarketingHeader from '@/components/landing/MarketingHeader';
import HeroCarousel from '@/components/landing/HeroCarousel';
import QuickLinksBar from '@/components/landing/QuickLinksBar';
import RevenueFeaturesSection from '@/components/landing/RevenueFeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import WhyKashdaSection from '@/components/landing/WhyKashdaSection';
import VisionAboutSection from '@/components/landing/VisionAboutSection';
import TeamSection from '@/components/landing/TeamSection';
import FutureRoadmapStrip from '@/components/landing/FutureRoadmapStrip';
import FinalCTABanner from '@/components/landing/FinalCTABanner';
import MarketingFooter from '@/components/landing/MarketingFooter';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <MarketingHeader />
      <HeroCarousel />
      <QuickLinksBar />
      <RevenueFeaturesSection />
      <HowItWorksSection />
      <WhyKashdaSection />
      <VisionAboutSection />
      <TeamSection />
      <FutureRoadmapStrip />
      <FinalCTABanner />
      <MarketingFooter />
    </Box>
  );
}
