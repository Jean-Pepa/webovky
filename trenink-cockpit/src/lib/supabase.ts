import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Prohlížečový Supabase klient. Konvence klíčů stejná jako zbytek repa.
// Bez klíčů appka jede v localStorage režimu (viz store.ts).

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(url && anon);

let client: SupabaseClient | null = null;

export function supa(): SupabaseClient | null {
  if (!hasSupabase) return null;
  if (!client) client = createClient(url as string, anon as string);
  return client;
}
