import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Run next-intl middleware first
  const response = intlMiddleware(request);

  // Refresh Supabase auth tokens
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect admin routes (except login)
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.match(/^\/(cs|en)\/admin(?!\/login)/);
  if (isAdminRoute && !user) {
    const locale = pathname.startsWith("/en") ? "en" : "cs";
    return NextResponse.redirect(
      new URL(`/${locale}/admin/login`, request.url)
    );
  }

  // Redirect authenticated users from login
  const isLoginRoute = pathname.match(/^\/(cs|en)\/admin\/login/);
  if (isLoginRoute && user) {
    const locale = pathname.startsWith("/en") ? "en" : "cs";
    return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
