// Mini načítač .env.local (bez závislostí) + Supabase admin klient.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

export function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const txt = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
      for (const line of txt.split("\n")) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    } catch {
      /* soubor nemusí existovat */
    }
  }
}

export function admin() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "Chybí NEXT_PUBLIC_SUPABASE_URL nebo SUPABASE_SERVICE_ROLE_KEY (dej je do .env.local nebo do prostředí)."
    );
    process.exit(1);
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
