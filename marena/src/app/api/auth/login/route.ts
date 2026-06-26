import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, authToken, isValidPassword } from "@/lib/auth";
import { yearFromPassword } from "@/lib/years";
import { isConfigured, readDB } from "@/lib/server-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = String(body?.password ?? "");
  if (!isValidPassword(password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  // Heslo na ročník (marenaYYYY) platí, jen když ten ročník existuje — založit
  // ho smí jen správce (Mařena). Master heslo (MARENA_PASSWORD) jede vždy.
  const master = !!process.env.MARENA_PASSWORD && password.trim().toLowerCase() === process.env.MARENA_PASSWORD.toLowerCase();
  const yr = yearFromPassword(password);
  if (!master && yr && isConfigured()) {
    const db = await readDB();
    if (db && !db.years.some((y) => y.id === yr)) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }
  const jar = await cookies();
  jar.set(AUTH_COOKIE, authToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 120, // ~4 měsíce, ať se nemusí pořád přihlašovat
  });
  return NextResponse.json({ ok: true });
}
