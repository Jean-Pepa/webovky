import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Run next-intl middleware first
  const response = intlMiddleware(request);

  const pathname = request.nextUrl.pathname;

  // Protect admin routes (except the legacy login page which we'll remove)
  const isAdminRoute = pathname.match(/^\/(cs|en)\/admin/);
  if (isAdminRoute) {
    const token = request.cookies.get("admin_token")?.value;
    let isAuthenticated = false;

    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);
        await jwtVerify(token, secret);
        isAuthenticated = true;
      } catch {
        // Invalid token
      }
    }

    if (!isAuthenticated) {
      const locale = pathname.startsWith("/en") ? "en" : "cs";
      return NextResponse.redirect(
        new URL(`/${locale}/login`, request.url)
      );
    }
  }

  // Redirect authenticated users from login page to admin
  const isLoginRoute = pathname.match(/^\/(cs|en)\/login/);
  if (isLoginRoute) {
    const token = request.cookies.get("admin_token")?.value;
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);
        await jwtVerify(token, secret);
        const locale = pathname.startsWith("/en") ? "en" : "cs";
        return NextResponse.redirect(
          new URL(`/${locale}/admin`, request.url)
        );
      } catch {
        // Invalid token, let them see login
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|videos|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)",
  ],
};
