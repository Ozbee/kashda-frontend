# KASHDA V1 Frontend - Implementation Guide

## Project Overview

This is the Next.js frontend for KASHDA V1, a multi-country fintech property tax revenue collection platform. The V1 release focuses on Ghana with property tax management, user onboarding, billing, and mobile money payments.

## Design System

### Brand Colors
- **Primary Purple**: `#6a0dad` - Main brand color, used for primary buttons, links, and accents
- **Gold Accent**: `#d4af37` - Premium accent, used for highlights and special elements
- **Light Background**: `#ffffff` - Light mode background
- **Dark Background**: `#0a0a0a` - Dark mode background
- **Light Text**: `#171717` - Light mode text
- **Dark Text**: `#ededed` - Dark mode text

### Logo
- Location: `/public/kashda_logo.png`
- Dimensions: 750x205px
- Format: PNG with transparency

### Typography
- Font Family: Geist Sans (default Next.js font)
- Font Mono: Geist Mono (for code/technical content)

## Project Structure

```
kashda-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Landing page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── verify-otp/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   │   ├── page.tsx            # User dashboard
│   │   │   ├── bills/page.tsx
│   │   │   ├── payments/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # Admin dashboard
│   │   │   ├── users/page.tsx
│   │   │   ├── bills/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       └── trpc/[trpc]/route.ts # tRPC endpoint
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── OTPVerification.tsx
│   │   ├── dashboard/
│   │   │   ├── BillCard.tsx
│   │   │   ├── PaymentHistory.tsx
│   │   │   └── UserProfile.tsx
│   │   ├── payment/
│   │   │   ├── PaymentModal.tsx
│   │   │   └── PaymentStatus.tsx
│   │   ├── admin/
│   │   │   ├── UserManagement.tsx
│   │   │   ├── BillingStats.tsx
│   │   │   └── FeatureTogglePanel.tsx
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       └── ...shadcn/ui components
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBills.ts
│   │   └── usePayment.ts
│   ├── lib/
│   │   ├── trpc.ts                 # tRPC client setup
│   │   ├── api.ts                  # API utilities
│   │   └── utils.ts
│   ├── styles/
│   │   └── globals.css             # Global styles with KASHDA colors
│   └── types/
│       └── index.ts                # TypeScript types
├── public/
│   ├── kashda_logo.png
│   └── favicon.ico
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd /home/ubuntu/kashda-frontend
npm install
```

### 2. Install Additional Packages

```bash
npm install @trpc/client @trpc/react-query @tanstack/react-query
npm install shadcn-ui
npm install axios
npm install react-hook-form zod
npm install lucide-react
npm install next-auth  # For authentication
```

### 3. Configure Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000/api/trpc
NEXT_PUBLIC_KASHDA_LOGO=/kashda_logo.png
```

### 4. Configure Tailwind CSS

Update `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kashda: {
          purple: "#6a0dad",
          gold: "#d4af37",
          light: "#ffffff",
          dark: "#0a0a0a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### 5. Configure Global Styles

Update `src/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --kashda-purple: #6a0dad;
  --kashda-gold: #d4af37;
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
}

/* KASHDA Brand Styles */
.btn-kashda-primary {
  @apply bg-[#6a0dad] text-white hover:bg-[#5a0a9d] transition-colors;
}

.btn-kashda-secondary {
  @apply bg-[#d4af37] text-[#171717] hover:bg-[#c49f2f] transition-colors;
}

.card-kashda {
  @apply border border-[#6a0dad] rounded-lg shadow-lg;
}
```

## Feature Implementation Checklist

### Phase 1: Authentication & Onboarding
- [ ] Landing page with KASHDA branding
- [ ] Login page with email/phone input
- [ ] Registration form (name, phone, email, address, property category)
- [ ] OTP verification screen
- [ ] Account creation confirmation
- [ ] SMS OTP delivery integration

### Phase 2: User Dashboard
- [ ] Dashboard layout with sidebar navigation
- [ ] Current bill display (base amount + arrears)
- [ ] Payment history table
- [ ] User profile view and edit
- [ ] Notification center (SMS/in-app)
- [ ] Logout functionality

### Phase 3: Payment Flow
- [ ] Payment initiation modal
- [ ] Mobile money provider selection (MTN, Vodafone, AirtelTigo)
- [ ] Payment amount confirmation
- [ ] Paystack integration
- [ ] Payment status tracking
- [ ] Payment success/failure notifications

### Phase 4: Admin Panel
- [ ] Admin dashboard with analytics
- [ ] User management (list, view, edit, delete)
- [ ] Bill management (view, generate, edit)
- [ ] Feature toggle management
- [ ] Country settings
- [ ] Notifications log viewer

### Phase 5: Field Agent Portal
- [ ] Field agent dashboard
- [ ] User registration on behalf
- [ ] User list management
- [ ] Bill tracking for registered users
- [ ] Collection statistics

### Phase 6: Feature Toggles
- [ ] Fetch feature toggles from backend
- [ ] Conditional rendering based on toggles
- [ ] "Coming Soon" states for disabled features
- [ ] Country-specific feature visibility

## API Integration

### tRPC Client Setup

Create `src/lib/trpc.ts`:

```typescript
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@kashda-backend/server/routers";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api/trpc",
    }),
  ],
});
```

### Key API Endpoints to Integrate

**Authentication**:
- `auth.register` - User registration
- `auth.verifyOtp` - OTP verification
- `auth.me` - Get current user
- `auth.logout` - Logout

**Billing**:
- `billing.getCurrentBill` - Get current month's bill
- `billing.getBillHistory` - Get bill history
- `billing.getBillDetails` - Get detailed bill info

**Payments**:
- `payment.initiateMobileMoneyPayment` - Start payment
- `payment.verifyPaymentStatus` - Check payment status

**Admin**:
- `admin.getUsers` - List users
- `admin.getBillingStats` - Get statistics
- `admin.updateCountry` - Update country settings

**Feature Toggles**:
- `featureToggle.getCountryToggles` - Get toggles for country

## Authentication Flow

1. User lands on landing page
2. Clicks "Sign Up" or "Login"
3. Enters phone number
4. Receives OTP via SMS (Arkesel)
5. Enters OTP in verification screen
6. Account created with account reference (KSD-GHA-XXXXX)
7. Redirected to dashboard

## Payment Flow

1. User views current bill on dashboard
2. Clicks "Pay Now" button
3. Selects mobile money provider (MTN, Vodafone, AirtelTigo)
4. Confirms payment amount
5. Paystack modal opens
6. User completes payment
7. Webhook updates bill status
8. User receives SMS confirmation
9. Dashboard updates with payment status

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# NEXT_PUBLIC_API_URL
# NEXT_PUBLIC_BACKEND_URL
```

### Self-Hosted Deployment

```bash
# Build
npm run build

# Start production server
npm start
```

## Testing

### Unit Tests

```bash
npm install --save-dev vitest @testing-library/react
npm run test
```

### E2E Tests

```bash
npm install --save-dev cypress
npm run cypress
```

## Performance Optimization

- Use Next.js Image component for logo and assets
- Implement code splitting for admin/user routes
- Use React Query for caching API responses
- Implement lazy loading for dashboard components
- Use dynamic imports for heavy components

## Accessibility

- Ensure WCAG 2.1 AA compliance
- Use semantic HTML
- Implement keyboard navigation
- Add ARIA labels
- Test with screen readers

## Security

- Never store sensitive data in localStorage
- Use httpOnly cookies for auth tokens
- Validate all user inputs
- Implement CSRF protection
- Use Content Security Policy headers

## Next Steps

1. Install all dependencies
2. Configure environment variables
3. Set up tRPC client
4. Implement authentication flow
5. Build dashboard components
6. Integrate payment flow
7. Build admin panel
8. Implement feature toggles
9. Test all flows
10. Deploy to production

## Support

For issues or questions:
- Backend API: http://localhost:3000
- Backend Documentation: `/home/ubuntu/kashda-backend/API_QUICK_REFERENCE.md`
- Backend Setup: `/home/ubuntu/kashda-backend/BACKEND_SETUP_GUIDE.md`
