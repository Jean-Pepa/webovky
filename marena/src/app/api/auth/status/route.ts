import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lehký dotaz „jsem už přihlášený?" — používá ho přihlašovací okno k tomu, aby
// po kliknutí na odkaz z e-mailu (v jiné záložce) pustilo dovnitř i původní okno.
export async function GET() {
  return NextResponse.json({ authed: await isAuthed() });
}
