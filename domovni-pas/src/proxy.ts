import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

function getSecret(): Uint8Array {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "dev-secret-change-me-in-production-please-0123456789",
  );
}

// Ochrana přihlášených sekcí (Next 16: konvence "proxy", dříve "middleware").
export async function proxy(req: NextRequest) {
  const token = req.cookies.get("dp_session")?.value;

  if (token) {
    try {
      await jwtVerify(token, getSecret());
      return NextResponse.next();
    } catch {
      // neplatný / expirovaný token => přesměrování na přihlášení
    }
  }

  const url = req.nextUrl.clone();
  url.pathname = "/prihlaseni";
  url.searchParams.set("od", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/prehled/:path*", "/nemovitost/:path*"],
};
