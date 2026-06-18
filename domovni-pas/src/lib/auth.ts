import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Role } from "@/lib/store";

export type AccountRole = "client" | "architect";

// client/architect (DB) → Role aplikace
function toAppRole(r?: string | null): Role {
  return r === "architect" ? "ARCHITECT" : "CLIENT";
}

export async function signUpEmail(
  email: string,
  password: string,
  role: AccountRole,
  fullName?: string,
) {
  const supabase = createClient();
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { role, full_name: fullName || null } },
  });
}

export async function signInEmail(email: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  if (!isSupabaseConfigured()) return;
  try {
    await createClient().auth.signOut();
  } catch {
    // ignore
  }
}

// Role aktuálně přihlášeného uživatele z profilu.
export async function fetchMyRole(): Promise<Role | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return toAppRole(data?.role ?? (user.user_metadata?.role as string | undefined));
}
