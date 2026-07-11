'use client';

import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import MarketingHeader from '@/components/landing/MarketingHeader';
import HeroCarousel from '@/components/landing/HeroCarousel';
import QuickLinksBar from '@/components/landing/QuickLinksBar';
import RevenueFeaturesSection from '@/components/landing/RevenueFeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import WhyKashdaSection from '@/components/landing/WhyKashdaSection';
import MarketingFooter from '@/components/landing/MarketingFooter';

// Below-the-fold sections: defer JS until the shell is interactive to reduce
// initial client heap on the marketing homepage.
const VisionAboutSection = dynamic(
  () => import('@/components/landing/VisionAboutSection'),
  { loading: () => null }
);
const TeamSection = dynamic(() => import('@/components/landing/TeamSection'), {
  loading: () => null,
});
const FutureRoadmapStrip = dynamic(
  () => import('@/components/landing/FutureRoadmapStrip'),
  { loading: () => null }
);
const FinalCTABanner = dynamic(
  () => import('@/components/landing/FinalCTABanner'),
  { loading: () => null }
);

export default function LandingPage() {
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
