import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Otisk právě nasazené verze (viz next.config.ts). Klient (VersionWatcher) ho
// porovnává se svým — když se liší, běží nové nasazení a appka se obnoví.
export function GET() {
  return NextResponse.json({ v: process.env.NEXT_PUBLIC_BUILD_ID ?? "dev" }, { headers: { "Cache-Control": "no-store" } });
}
