import { NextResponse, type NextRequest } from "next/server";

// Vícejazyčné routování:
// - čeština (cs) běží na kořenových URL (bez prefixu)
// - angličtina /en/* a němčina /de/* se interně přepíšou na stejnou trasu
//   a jazyk se předá komponentám přes hlavičku x-locale.
const PREFIXED = ["en", "de"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const seg = pathname.split("/")[1];
  const headers = new Headers(req.headers);

  if (PREFIXED.includes(seg)) {
    headers.set("x-locale", seg);
    const rest = pathname.slice(seg.length + 1) || "/";
    const url = req.nextUrl.clone();
    url.pathname = rest;
    return NextResponse.rewrite(url, { request: { headers } });
  }

  headers.set("x-locale", "cs");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)"],
};
