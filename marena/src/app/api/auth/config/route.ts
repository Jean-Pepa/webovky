import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Diagnostika: vidí běžící produkce klíče? Pomáhá odladit, proč přihlášení
// e-mailem (Supabase) nejede. Vrací jen true/false a kousek URL — žádné tajné
// hodnoty (anon key ani token se neukazují).
export async function GET() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const redisTok = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return NextResponse.json({
    supabaseUrlSet: !!url,
    supabaseKeySet: !!key,
    supabaseUrlHost: url ? url.replace(/^https?:\/\//, "").split("/")[0] : null,
    redisConfigured: !!(redisUrl && redisTok),
  });
}
