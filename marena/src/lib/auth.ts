import { cookies } from "next/headers";
import { createHash } from "crypto";
import { isYearPassword } from "./years";
import { supabaseEnabled } from "./supabase/config";
import { getSupabaseUser } from "./supabase/server";
import { isEmailAllowed } from "./allowlist";

// Hesla do zázemí: pro každý ročník jedno — „marena2026" … „marena2050".
// Volitelně lze přes MARENA_PASSWORD nastavit ještě další (master) heslo.
export function isValidPassword(pw: string): boolean {
  const p = (pw || "").trim();
  if (process.env.MARENA_PASSWORD && p.toLowerCase() === process.env.MARENA_PASSWORD.toLowerCase()) return true;
  return isYearPassword(p);
}

export const AUTH_COOKIE = "marena_auth";

// Do cookie neukládáme heslo, ale stabilní odvozený token (hash). Token je
// stejný pro všechna platná hesla — cookie znamená jen „přihlášen do zázemí".
export function authToken(): string {
  const secret = process.env.MARENA_PASSWORD || "marena-zazemi";
  return createHash("sha256").update(`marena:auth:v2:${secret}`).digest("hex");
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  const passOk = jar.get(AUTH_COOKIE)?.value === authToken();
  // Se Supabase je potřeba OBOJÍ: nejdřív společné heslo (cookie), pak ověřený
  // e-mail z allowlistu. Bez Supabase stačí samotné heslo jako dosud.
  if (supabaseEnabled()) {
    if (!passOk) return false;
    const user = await getSupabaseUser();
    if (!user?.email) return false;
    return isEmailAllowed(user.email);
  }
  return passOk;
}
