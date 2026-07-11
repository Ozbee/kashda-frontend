import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://api.paystack.co https://*.onrender.com https://*.vercel.app http://localhost:3000",
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
