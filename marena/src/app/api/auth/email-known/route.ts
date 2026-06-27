import { NextResponse } from "next/server";
import { isEmailAllowed } from "@/lib/allowlist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Zjistí, jestli e-mail patří někomu z týmu (nebo je v allowlistu) — používá to
// přihlášení e-mailem k tomu, aby odkaz neposílalo na neznámé adresy a místo
// toho vyzvalo k registraci.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email : "";
  return NextResponse.json({ known: await isEmailAllowed(email) });
}
