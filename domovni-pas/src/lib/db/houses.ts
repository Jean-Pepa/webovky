import { createClient } from "@/lib/supabase/client";

// Řádek tabulky houses v Supabase
export type DbHouse = {
  id: string;
  owner_id: string;
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
};

// Moje domy (RLS vrací jen ty, ke kterým mám přístup — vlastník / člen)
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

export async function createHouse(input: NewHouse): Promise<DbHouse> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Nejste přihlášeni.");
  const { data, error } = await supabase
    .from("houses")
    .insert({ ...input, owner_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data as DbHouse;
}

export async function deleteHouse(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("houses").delete().eq("id", id);
  if (error) throw error;
}
