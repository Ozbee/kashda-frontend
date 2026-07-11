import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Pin Turbopack to this app directory. Without this, Next.js can infer a parent
// workspace root when sibling lockfiles exist (e.g. kashda-backend nearby),
// causing Turbopack to watch/resolve a much larger tree and leak memory in dev.
const appRoot = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV !== "production";

// connect-src: same-origin always; localhost/backend dev origins only in dev.
const connectSrc = [
  "'self'",
  "https://api.paystack.co",
  "https://*.onrender.com",
  "https://*.vercel.app",
  "https://nominatim.openstreetmap.org",
  "https://*.tile.openstreetmap.org",
  ...(isDev ? ["http://localhost:3000", "ws://localhost:3001"] : []),
];

// Next.js dev tooling (HMR/react-refresh) needs 'unsafe-eval'; production does not.
const scriptSrc = ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])];

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src ${scriptSrc.join(" ")}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      `connect-src ${connectSrc.join(" ")}`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

// Origin of the backend the `/api/*` proxy forwards to. Requests are proxied so
// the browser talks to the frontend origin only, keeping the session cookie
// first-party (see src/lib/env.ts). In production set BACKEND_ORIGIN to the
// deployed backend URL (e.g. https://kashda-backend.onrender.com); locally it
// defaults to the dev backend on port 3000.
const backendOrigin = (
  process.env.BACKEND_ORIGIN ??
  process.env.BACKEND_URL ??
  "http://127.0.0.1:3000"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: appRoot,
  },
  experimental: {
    // Known to cause runaway dev memory in Next.js 16.2.x when left enabled.
    turbopackServerFastRefresh: false,
    optimizePackageImports: ["@mui/material", "@mui/icons-material"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
