import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, correctPassword } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = String(body?.password ?? "");
  if (password !== correctPassword()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const jar = await cookies();
  jar.set(AUTH_COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 120, // ~4 měsíce, ať se nemusí pořád přihlašovat
  });
  return NextResponse.json({ ok: true });
}
