// Supabase magic-link přihlášení je VOLITELNÉ a zapne se jen tehdy, když jsou
// nastavené tyto proměnné prostředí. Bez nich appka jede po starém (heslo + jméno),
// takže přidání Supabase nic nerozbije — stačí klíče nepřidat / zase odebrat.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function supabaseEnabled(): boolean {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
}
