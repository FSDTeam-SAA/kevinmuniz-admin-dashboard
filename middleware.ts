import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_ROUTES = ["/signin", "/forgot-password"];

const isAuthRoute = (pathname: string) =>
  AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(token?.user);
  const isAdmin = token?.user?.role === "ADMIN";

  if (isAuthRoute(pathname)) {
    if (isAuthenticated && isAdmin) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      return response;
    }

    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
  }

  if (!isAuthenticated || !isAdmin) {
    const signInUrl = new URL("/signin", request.url);

    if (pathname !== "/") {
      signInUrl.searchParams.set("callbackUrl", pathname);
    }

    if (isAuthenticated && !isAdmin) {
      signInUrl.searchParams.set("error", "ADMIN_ONLY");
    }

    const response = NextResponse.redirect(signInUrl);
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|assets).*)"],
};
