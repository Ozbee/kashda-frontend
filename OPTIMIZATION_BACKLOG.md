# Kashda Frontend — Optimization & Hardening Backlog

Findings from the review of `kashda-frontend` (Next.js 16 App Router, React 19,
MUI, tRPC), with priority and status.

Status legend: ✅ Fixed · 🔁 Deferred · 📝 Note

---

## Phase 3 — Software engineering / security

| # | Priority | Finding | File(s) | Status |
|---|----------|---------|---------|--------|
| 3.1 | High | No `type-check` / formatting scripts; Prettier not wired. | `package.json`, `eslint.config.mjs` | ✅ Fixed — added `type-check`, `lint:fix`, `format`, `format:check`, `test`, `test:coverage`; Prettier + `eslint-config-prettier`. |
| 3.2 | High | Dashboard protection was client-only (`AuthGuard`). | `src/middleware.ts` | ✅ Fixed — added server-side middleware guard for `/dashboard/*` (dev-auth aware). |
| 3.3 | High | Loose Content-Security-Policy (allowed `unsafe-eval`; `connect-src` open). | `next.config.ts` | ✅ Fixed — prod CSP drops `unsafe-eval`, adds `object-src 'none'` + `base-uri 'self'`; `script-src`/`connect-src` are dev-aware. |
| 3.4 | Medium | Dead config: unused `zod` dep and unused `NEXT_PUBLIC_*` vars; unused `getAppName`. | `package.json`, `.env*.example`, `src/lib/env.ts` | ✅ Fixed — removed. |
| 3.5 | Medium | `react/no-children-prop` in the tRPC provider wrapper. | `src/lib/trpc.ts` | ✅ Fixed — children passed as a `createElement` argument (props type made optional). |
| 3.6 | Medium | End-to-end tRPC types: client uses `createTRPCReact<any>()` + hand-written contract. | `src/lib/trpc.ts`, `src/types/trpc-client.ts` | 🔁 Deferred — importing the backend `AppRouter` type across two independently-deployed repos (Vercel/Render) risks coupling builds. Options: publish backend types as a package, or a shared types workspace. Until then the hand-written contract + isolated `any` casts remain. |

---

## Phase 4 — Testing

| # | Priority | Finding | Status |
|---|----------|---------|--------|
| 4.1 | High | No test infrastructure at all. | ✅ Fixed — Vitest + Testing Library (`@testing-library/react`/`jest-dom`) + jsdom + `@vitejs/plugin-react`; `vitest.config.mts`, `vitest.setup.ts`, coverage. |
| 4.2 | Medium | No representative tests. | ✅ Fixed — starter suite: `lib/format`, `lib/env`, `lib/payments`, a `KashdaLogo` component test, and an `AuthContext` behavior test with a mocked tRPC client. |
| 4.3 | Low | `@vitejs/plugin-react` v6 (Vite 7) is incompatible with Vitest 2's bundled Vite 5. | 📝 Note — pinned `@vitejs/plugin-react@^4`. Revisit when upgrading to Vitest 3+. |
| 4.4 | Medium | Broaden component/page coverage (forms, dashboard widgets, error states). | 🔁 Deferred. |

---

## Phase 5 — CI

| # | Priority | Finding | Status |
|---|----------|---------|--------|
| 5.1 | High | No CI. | ✅ Fixed — `.github/workflows/ci.yml` runs type-check + lint + tests (coverage) + production build on PRs and pushes to `main`/`master`, Node 20, pnpm store cache. |
| 5.2 | Low | Require CI before merge. | 🔁 Deferred — enable branch protection in repo settings. |

---

## Memory / OOM hardening

| # | Priority | Finding | File(s) | Status |
|---|----------|---------|---------|--------|
| M.1 | Critical | Local `next dev` OOM after long sessions (Turbopack heap growth; exit 134). | `next.config.ts`, `package.json` | ✅ Fixed — pinned `turbopack.root` to the app directory; disabled `experimental.turbopackServerFastRefresh`; added `dev:webpack` fallback script. |
| M.2 | High | Parent workspace lockfiles caused Turbopack to watch the whole `Manus files/` tree. | `next.config.ts` | ✅ Fixed — explicit `turbopack.root`. |
| M.3 | High | Production build could OOM on Vercel (MUI + Next 16 Turbopack build). | `package.json`, `vercel.json`, `.github/workflows/ci.yml` | ✅ Fixed — `NODE_OPTIONS=--max-old-space-size=4096` on build; CI runs `pnpm build`; optional `build:webpack` script if Turbopack build still fails. |
| M.4 | Medium | Unnecessary `force-dynamic` on marketing/auth routes increased serverless memory. | `src/app/page.tsx`, `(auth)/layout.tsx`, `dashboard/layout.tsx` | ✅ Fixed — removed `force-dynamic`; dashboard relies on middleware + client guards. |
| M.5 | Medium | `auth.me` polled on every homepage visit via root `AuthProvider`. | `src/app/layout.tsx`, `src/middleware.ts`, route layouts | ✅ Fixed — `AuthProvider` scoped to auth/dashboard; middleware redirects session cookie holders from `/` to `/dashboard`; dev-auth uses `DevAuthHomeRedirect`. |
| M.6 | Medium | Heavy landing bundle + 3 simultaneous hero images. | `LandingPage.tsx`, `HeroCarousel.tsx` | ✅ Fixed — dynamic imports for below-fold sections; hero loads active + adjacent slides only. |
| M.7 | Medium | Leaflet loaded eagerly on registration flows. | `LocationPicker.tsx` | ✅ Fixed — `dynamic(..., { ssr: false })` for `MapPicker`. |
| M.8 | Low | Map/geolocation edge-case retention after unmount. | `MapPicker.tsx`, `LocationPicker.tsx` | ✅ Fixed — clear `invalidateSize` timer; geolocation mounted ref guard. |
| M.9 | Low | Duplicate React Query cache for payment history (limit 20 vs 50). | `dashboard/page.tsx`, `payments/page.tsx` | ✅ Fixed — unified limit to 50; `gcTime` set to 5 minutes in `providers.tsx`. |
| M.10 | Low | MUI barrel imports inflate bundles. | `next.config.ts` | ✅ Fixed — `optimizePackageImports` for `@mui/material` and `@mui/icons-material`. |

### Dev vs production guidance

- **Local dev:** use `pnpm dev` (Turbopack with mitigations). If memory still climbs during long sessions, use `pnpm dev:webpack`.
- **Vercel / production:** deploy via `pnpm build && pnpm start` — never `pnpm dev`. Build heap is raised via `vercel.json` `build.env.NODE_OPTIONS`.
- **Self-hosted VM:** use a process manager (e.g. PM2) with `--max-memory-restart 512M` as a last-resort watchdog if `next start` spikes under load.

---

## Known lint warnings (intentional, tracked)

- `react-hooks/set-state-in-effect` is downgraded to a **warning** (from the new
  React 19 rule set). The flagged sites are legitimate one-time
  hydrate-from-storage / derived-state syncs in `AuthContext` and
  `SidebarContext`. 🔁 Deferred — refactor to lazy `useState` initializers or
  external-store subscriptions where practical.
- `react-hooks/exhaustive-deps` warning in `AuthContext` (`meQuery` memo). 🔁
  Deferred — verify intended memoization before changing.
