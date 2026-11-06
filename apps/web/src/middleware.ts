import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "shrimphub_session_token";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME);

  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/public") ||
    pathname.includes("favicon") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico");

  // If user has no session token and tries to access a protected route
  if (!sessionToken?.value && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user already has a session token and visits login or register, send to dashboard
  if (sessionToken?.value && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Proceed with response
  const response = NextResponse.next();

  // Sliding Session: If session token exists, slide the cookie expiry +7 days on every activity!
  if (sessionToken?.value) {
    const newExpiresAt = new Date(Date.now() + SESSION_TTL_MS);
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: newExpiresAt,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
