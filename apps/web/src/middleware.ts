import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("shrimphub_session");

  const isPublicRoute =
    pathname === "/login" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/public") ||
    pathname.includes("favicon") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".svg");

  // If user is not authenticated and trying to access a protected route
  if (!session?.value && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user is already authenticated and visits /login, redirect to dashboard
  if (session?.value && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api/auth routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
