import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of paths that don't require authentication
// TODO: Remove "/api/admin/**", "/api/events/**" from this list once testing is complete
const publicPaths = ["/login", "/api/auth", "/api/inngest", "/api/admin/**", "/api/events/**"];

export function middleware(request: NextRequest) {
  // Skip authentication in development mode
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.has("auth");
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect to login if not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if authenticated and trying to access login
  if (isAuthenticated && request.nextUrl.pathname === "/login") {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
