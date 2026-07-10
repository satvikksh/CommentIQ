import { NextRequest, NextResponse } from "next/server";

const sessionCookieNames = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

export function middleware(req: NextRequest) {
  const hasSession = sessionCookieNames.some((name) => req.cookies.has(name));

  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analyze/:path*",
    "/history/:path*",
    "/settings/:path*",
    "/results/:path*",
    "/processing/:path*",
  ],
};
