import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseEnabled } from "@/lib/supabase/config";
import { isEmailAllowed } from "@/lib/allowlist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Sem se vrátí uživatel po kliknutí na odkaz z e-mailu (magic link).
// Vymění „code" za session, ověří allowlist a pustí do zázemí.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const origin = url.origin;

  if (!supabaseEnabled() || !code) {
    return NextResponse.redirect(`${origin}/prihlaseni?err=link`);
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/prihlaseni?err=link`);
  }

  // Ověř, že e-mail je na seznamu povolených. Jinak odhlas a odmítni.
  const { data } = await supabase.auth.getUser();
  const allowed = await isEmailAllowed(data.user?.email);
  if (!allowed) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/prihlaseni?err=denied`);
  }

  // Nepouštíme dovnitř tady (v okně z odkazu) — jen potvrdíme přihlášení. Dovnitř
  // se člověk dostane v původním okně, kde zadával e-mail (to si hlídá session).
  return NextResponse.redirect(`${origin}/auth/hotovo`);
}
