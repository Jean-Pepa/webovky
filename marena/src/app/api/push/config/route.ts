import { NextResponse } from "next/server";
import { pushConfigured, vapidPublicKey } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Veřejný VAPID klíč (klient jím zakládá odběr). Veřejný = smí ho vidět kdokoli.
export async function GET() {
  return NextResponse.json({ enabled: pushConfigured(), publicKey: vapidPublicKey() });
}
