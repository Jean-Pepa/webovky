import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminToken, checkAdminPassword, AUTH_COOKIE, authToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Záložní přihlášení správce: login (jméno) + heslo. Při shodě hesla nastaví
// správcovskou cookie (plný přístup) i běžnou cookie zázemí.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = String(body?.password ?? "");
  if (!checkAdminPassword(password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const jar = await cookies();
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 120,
  };
  jar.set(ADMIN_COOKIE, adminToken(), opts);
  jar.set(AUTH_COOKIE, authToken(), opts); // ať projde i případná kontrola hesla
  return NextResponse.json({ ok: true });
}
