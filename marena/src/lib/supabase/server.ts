import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

// Supabase klient na serveru (čte/zapisuje session do cookies přes @supabase/ssr).
// Volat jen když supabaseEnabled().
export async function createSupabaseServer() {
  const jar = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return jar.getAll();
      },
      setAll(toSet) {
        try {
          toSet.forEach(({ name, value, options }) => jar.set(name, value, options));
        } catch {
          // V Server Componentu nejde zapisovat cookies — middleware/route je obnoví.
        }
      },
    },
  });
}

// Vrátí přihlášeného Supabase uživatele (nebo null). Bezpečné i bez konfigurace.
export async function getSupabaseUser() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
