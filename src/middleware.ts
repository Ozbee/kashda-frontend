import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Session cookie set by the backend on successful OTP verification / OAuth.
 * Must match COOKIE_NAME in the backend (`app_session_id`).
 */
const SESSION_COOKIE = "app_session_id";

/**
 * Server-side guard for authenticated areas. This is defense-in-depth on top of
 * the client-side `AuthGuard`: it redirects anonymous requests to /login before
 * any protected page is rendered. It only checks for the presence of the
 * session cookie (the JWT is verified by the backend on every API call); it
 * cannot and does not validate the token signature here.
 */
export function middleware(request: NextRequest) {
  // Local dev-auth mode stores the user in sessionStorage (not a cookie), so
  // the server-side cookie check would produce false redirects. Skip it there.
  if (process.env.NEXT_PUBLIC_DEV_AUTH === "true") {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has(SESSION_COOKIE);
  const { pathname } = request.nextUrl;

  // Logged-in users visiting the marketing homepage go straight to the dashboard
  // without loading AuthProvider / auth.me on the landing page.
  if (pathname === "/") {
    if (hasSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
