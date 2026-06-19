import { createClient } from "@/lib/supabase/client";

export type HouseStatus = "draft" | "handed_over" | "active";

// Řádek tabulky houses v Supabase
export type DbHouse = {
  id: string;
  owner_id: string;
  created_by: string | null;
  owner_email: string | null;
  status: HouseStatus;
  name: string;
  type: string;
  street: string | null;
  city: string | null;
  zip: string | null;
  year_built: number | null;
  description: string | null;
  handed_over: boolean;
  created_at: string;
  updated_at: string;
};

export type NewHouse = {
  name: string;
  type?: string;
  street?: string | null;
  city?: string | null;
  zip?: string | null;
  year_built?: number | null;
  description?: string | null;
  status?: HouseStatus;
};

export type Me = { id: string; email: string };

export async function getMe(): Promise<Me | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: (user.email ?? "").toLowerCase() };
}

// Vrací všechny domy, ke kterým mám přístup (RLS: vlastník / tvůrce / příjemce dle e-mailu / člen)
export async function listMyHouses(): Promise<DbHouse[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("houses")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DbHouse[];
}

export async function getHouse(id: string): Promise<DbHouse | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("houses").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as DbHouse) ?? null;
}

// Vytvoří dům. status: 'active' = vlastní dům klienta, 'draft' = profík rozpracoval.
export async function createHouse(input: NewHouse): Promise<DbHouse> {
  const supabase = createClient();
  const me = await getMe();
  if (!me) throw new Error("Nejste přihlášeni.");
  const { data, error } = await supabase
    .from("houses")
    .insert({
      ...input,
      status: input.status ?? "active",
      owner_id: me.id,
      created_by: me.id,
    })
    .select()
    .single();
  if (error) throw error;
  return data as DbHouse;
}

// Předání: profík nastaví e-mail klienta a stav „předáno". Klient si pak dům převezme.
export async function handoverHouse(id: string, clientEmail: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("houses")
    .update({ owner_email: clientEmail.trim().toLowerCase(), status: "handed_over" })
    .eq("id", id);
  if (error) throw error;
}

// Převzetí: příjemce (dle e-mailu) se stane vlastníkem (RLS politika houses_claim).
export async function claimHouse(id: string): Promise<void> {
  const supabase = createClient();
  const me = await getMe();
  if (!me) throw new Error("Nejste přihlášeni.");
  const { error } = await supabase
    .from("houses")
    .update({ owner_id: me.id, status: "active" })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteHouse(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("houses").delete().eq("id", id);
  if (error) throw error;
}
