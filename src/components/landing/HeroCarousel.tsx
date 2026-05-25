'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { heroSlides } from '@/content/landingContent';

export default function HeroCarousel() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const slides = reducedMotion ? [heroSlides[0]] : heroSlides;

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: '60vh', md: '70vh' },
        overflow: 'hidden',
      }}
    >
      <Box ref={emblaRef} sx={{ overflow: 'hidden', height: '100%' }}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          {slides.map((slide, index) => (
            <Box
              key={slide.headline}
              sx={{
                flex: '0 0 100%',
                minWidth: 0,
                position: 'relative',
                minHeight: { xs: '60vh', md: '70vh' },
              }}
            >
              <Image
                src={slide.image}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                style={{ objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(42, 0, 74, 0.72)',
                }}
              />
              <Container
                maxWidth="lg"
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  py: { xs: 8, md: 10 },
                  px: { xs: 2, sm: 3 },
                }}
              >
                <Typography
                  variant="h2"
                  color="secondary.main"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
                    maxWidth: 800,
                    mb: 2,
                    lineHeight: 1.15,
                  }}
                >
                  {slide.headline}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    maxWidth: 560,
                    mb: 4,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                  }}
                >
                  {slide.subtext}
                </Typography>
                <Button
                  component={Link}
                  href={slide.cta.href}
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    '&:hover': { transform: 'scale(1.03)' },
                    transition: 'transform 0.2s',
                  }}
                >
                  {slide.cta.label}
                </Button>
              </Container>
            </Box>
          ))}
        </Box>
      </Box>

      {!reducedMotion && slides.length > 1 && (
        <>
          <IconButton
            onClick={scrollPrev}
            aria-label="Previous slide"
            sx={{
              position: 'absolute',
              left: { xs: 8, md: 24 },
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(106, 13, 173, 0.7)',
              color: 'white',
              '&:hover': { bgcolor: 'primary.main' },
              zIndex: 2,
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={scrollNext}
            aria-label="Next slide"
            sx={{
              position: 'absolute',
              right: { xs: 8, md: 24 },
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(106, 13, 173, 0.7)',
              color: 'white',
              '&:hover': { bgcolor: 'primary.main' },
              zIndex: 2,
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          <Box
            sx={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              zIndex: 2,
            }}
          >
            {slides.map((_, index) => (
              <Box
                key={index}
                component="button"
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                sx={{
                  width: selectedIndex === index ? 28 : 10,
                  height: 10,
                  borderRadius: 5,
                  border: 'none',
                  cursor: 'pointer',
                  bgcolor: selectedIndex === index ? 'secondary.main' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.3s',
                  p: 0,
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
