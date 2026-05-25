# KASHDA Frontend - Setup & Deployment Guide

## Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Backend running at `http://localhost:3000`
- Paystack account with API keys
- GitHub account (for repository)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/kashda-frontend.git
   cd kashda-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your values:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3000/api/trpc
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
kashda-frontend/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and tRPC setup
│   ├── styles/          # Global CSS with KASHDA branding
│   └── types/           # TypeScript type definitions
├── public/              # Static assets (logo, favicon)
├── .env.example         # Environment variables template
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## KASHDA Branding Implementation

### Colors
- **Primary Purple**: `#6a0dad` - Use for primary buttons, links, headers
- **Gold Accent**: `#d4af37` - Use for highlights, premium features
- **Light Background**: `#ffffff` - Light mode
- **Dark Background**: `#0a0a0a` - Dark mode

### Logo Usage
```tsx
import Image from 'next/image';

export default function Header() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/kashda_logo.png"
        alt="KASHDA"
        width={150}
        height={40}
      />
    </div>
  );
}
```

### Tailwind CSS Classes
```tsx
// Primary button
<button className="bg-[#6a0dad] text-white hover:bg-[#5a0a9d]">
  Pay Now
</button>

// Gold accent
<div className="border-l-4 border-[#d4af37] pl-4">
  Premium Feature
</div>

// Card with KASHDA styling
<div className="border border-[#6a0dad] rounded-lg shadow-lg p-6">
  Bill Information
</div>
```

## Authentication Setup

### Manus OAuth Integration

1. **Configure OAuth in backend** (already done in kashda-backend)
2. **Create auth hook** (`src/hooks/useAuth.ts`):
   ```typescript
   import { useQuery } from '@tanstack/react-query';
   import { trpc } from '@/lib/trpc';

   export function useAuth() {
     return trpc.auth.me.useQuery();
   }
   ```

3. **Protected routes** - Wrap components with auth check:
   ```tsx
   'use client';
   
   import { useAuth } from '@/hooks/useAuth';
   import { useRouter } from 'next/navigation';
   
   export default function ProtectedPage() {
     const { data: user, isLoading } = useAuth();
     const router = useRouter();
     
     if (isLoading) return <div>Loading...</div>;
     if (!user) {
       router.push('/login');
       return null;
     }
     
     return <div>Welcome, {user.name}</div>;
   }
   ```

## Feature Implementation

### 1. User Onboarding
- **Registration**: Collect name, phone, email, address, property category
- **OTP Verification**: SMS-based verification via Arkesel
- **Account Creation**: Generate account reference (KSD-GHA-XXXXX)

### 2. Dashboard
- **Bill Display**: Show current month's bill (base + arrears)
- **Payment History**: Table of past payments
- **Quick Actions**: Pay Now, View Details, Download Receipt

### 3. Payment Flow
- **Provider Selection**: MTN, Vodafone, AirtelTigo
- **Amount Confirmation**: Display total due
- **Paystack Integration**: Secure payment processing
- **Status Tracking**: Real-time payment updates

### 4. Admin Panel
- **User Management**: CRUD operations
- **Billing Dashboard**: Statistics and charts
- **Feature Toggles**: Enable/disable modules
- **Settings**: Country and tax configuration

### 5. Field Agent Portal
- **User Registration**: Register users on behalf
- **Collection Tracking**: Monitor payments
- **Statistics**: Performance metrics

## API Integration

### tRPC Client Setup

Create `src/lib/trpc.ts`:
```typescript
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@kashda-backend/server/routers';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/api/trpc',
    }),
  ],
});
```

### Using tRPC Queries

```tsx
'use client';

import { trpc } from '@/lib/trpc';

export function BillComponent() {
  const { data: bill, isLoading } = trpc.billing.getCurrentBill.useQuery();
  
  if (isLoading) return <div>Loading bill...</div>;
  
  return (
    <div className="bg-white p-6 rounded-lg border border-[#6a0dad]">
      <h2 className="text-2xl font-bold text-[#6a0dad]">Current Bill</h2>
      <p className="text-lg">GH₵ {bill?.totalDue}</p>
    </div>
  );
}
```

## Testing

### Unit Tests with Vitest
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
npm run test
```

### E2E Tests with Cypress
```bash
npm install --save-dev cypress
npm run cypress
```

## Performance Optimization

### Image Optimization
```tsx
import Image from 'next/image';

<Image
  src="/kashda_logo.png"
  alt="KASHDA"
  width={150}
  height={40}
  priority
/>
```

### Code Splitting
```tsx
import dynamic from 'next/dynamic';

const AdminPanel = dynamic(() => import('@/components/admin/AdminPanel'), {
  loading: () => <div>Loading admin panel...</div>,
});
```

### Data Caching
```tsx
const { data: bills } = trpc.billing.getBillHistory.useQuery(
  { page: 1, limit: 10 },
  { staleTime: 5 * 60 * 1000 } // 5 minutes
);
```

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial KASHDA frontend"
   git push origin main
   ```

2. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

3. **Set environment variables in Vercel dashboard**
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_BACKEND_URL`
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`

### Self-Hosted (Docker)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t kashda-frontend .
docker run -p 3000:3000 kashda-frontend
```

### Environment-Specific Configuration

**Production (.env.production)**:
```env
NEXT_PUBLIC_API_URL=https://api.kashda.com
NEXT_PUBLIC_BACKEND_URL=https://api.kashda.com/api/trpc
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_production_key
```

**Staging (.env.staging)**:
```env
NEXT_PUBLIC_API_URL=https://staging-api.kashda.com
NEXT_PUBLIC_BACKEND_URL=https://staging-api.kashda.com/api/trpc
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_staging_key
```

## Troubleshooting

### Backend Connection Issues
- Verify backend is running: `curl http://localhost:3000/api/trpc`
- Check `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
- Ensure CORS is enabled on backend

### Paystack Integration
- Verify public key is correct
- Check Paystack account is in test mode for development
- Ensure phone number format is E.164 (+233...)

### OTP Verification
- Check Arkesel API key in backend
- Verify phone number format
- Check SMS delivery logs in Arkesel dashboard

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Security Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Validate all user inputs** on frontend and backend
4. **Use HTTPS** in production
5. **Implement CSRF protection**
6. **Keep dependencies updated**: `npm audit fix`

## Performance Monitoring

### Web Vitals
```tsx
import { useReportWebVitals } from 'next/web-vitals';

export function useWebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric);
  });
}
```

### Error Tracking
Integrate Sentry for error monitoring:
```bash
npm install @sentry/nextjs
```

## Support & Resources

- **Backend Documentation**: `/home/ubuntu/kashda-backend/API_QUICK_REFERENCE.md`
- **Backend Setup**: `/home/ubuntu/kashda-backend/BACKEND_SETUP_GUIDE.md`
- **Technical Spec**: `/home/ubuntu/kashda-backend/TECHNICAL_SPECIFICATION.md`
- **GitHub**: https://github.com/your-username/kashda-frontend
- **Issues**: Create GitHub issues for bugs and feature requests

## Next Steps

1. ✅ Initialize Next.js project
2. ⏳ Install dependencies
3. ⏳ Configure environment variables
4. ⏳ Set up tRPC client
5. ⏳ Implement authentication flow
6. ⏳ Build dashboard components
7. ⏳ Integrate payment flow
8. ⏳ Build admin panel
9. ⏳ Test all features
10. ⏳ Deploy to production
