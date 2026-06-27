// Supabase magic-link přihlášení je VOLITELNÉ a zapne se jen tehdy, když jsou
// nastavené tyto proměnné prostředí. Bez nich appka jede po starém (heslo + jméno),
// takže přidání Supabase nic nerozbije — stačí klíče nepřidat / zase odebrat.

// Ořízne cestu i koncové lomítko — Supabase URL musí být jen „https://xxx.supabase.co".
// (Když se omylem vloží URL s /rest/v1 apod., supabase-js hlásí „Invalid path".)
function cleanUrl(raw: string): string {
  const v = (raw || "").trim();
  if (!v) return "";
  try {
    return new URL(v).origin;
  } catch {
    return v.replace(/\/+$/, "");
  }
}

export const SUPABASE_URL = cleanUrl(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
export const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

export function supabaseEnabled(): boolean {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
}
