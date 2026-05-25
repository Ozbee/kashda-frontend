'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const STEPS = ['Method', 'Details', 'Confirm'] as const;

interface PaymentStepIndicatorProps {
  currentStep: 'method' | 'details' | 'status';
}

export default function PaymentStepIndicator({ currentStep }: PaymentStepIndicatorProps) {
  const stepIndex =
    currentStep === 'method' ? 0 : currentStep === 'details' ? 1 : 2;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
      {STEPS.map((label, index) => (
        <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
              bgcolor: index <= stepIndex ? 'primary.main' : 'background.default',
              color: index <= stepIndex ? 'secondary.main' : 'text.secondary',
              border: 2,
              borderColor: index <= stepIndex ? 'secondary.main' : 'divider',
            }}
          >
            {index + 1}
          </Box>
          <Typography
            variant="caption"
            sx={{
              display: { xs: 'none', sm: 'block' },
              color: index <= stepIndex ? 'secondary.main' : 'text.secondary',
              fontWeight: index === stepIndex ? 700 : 400,
            }}
          >
            {label}
          </Typography>
          {index < STEPS.length - 1 && (
            <Box
              sx={{
                width: 24,
                height: 2,
                bgcolor: index < stepIndex ? 'secondary.main' : 'divider',
                mx: 0.5,
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
}
