"use server";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Get the auth token from cookies
  const token = request.cookies.get("authToken");

  // Check if the token exists
  if (!token) {
    // If the token does not exist and user wants to login or sign up let him do it
    if (
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup")
    ) {
      return NextResponse.next();
    }
    // If the token does not exist and user wants to access any pages redirect him to login page
    return NextResponse.redirect(new URL("/login", request.url));
  } else {
    // If the token exist and user wants to login or sign up redirect him to home page
    if (
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // If the token exist and user wants to access any page let him do it
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - login && sign up page
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
