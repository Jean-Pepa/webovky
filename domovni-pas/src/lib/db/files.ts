import { createClient } from "@/lib/supabase/client";

export type DbDocument = {
  id: string;
  house_id: string;
  title: string;
  category: string | null;
  section: string | null;
  storage_path: string;
  file_name: string | null;
  mime: string | null;
  size_bytes: number | null;
  created_at: string;
};

export type DbMedia = {
  id: string;
  house_id: string;
  kind: "photo" | "video";
  storage_path: string;
  caption: string | null;
  room: string | null;
  created_at: string;
};

// Bezpečný název souboru pro úložiště
function safeName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]+/g, "_")
    .slice(-80);
}

async function myId(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// ── Dokumenty ───────────────────────────────────────────────────────────────
export async function listDocuments(houseId: string): Promise<DbDocument[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("house_id", houseId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DbDocument[];
}

export async function uploadDocument(
  houseId: string,
  file: File,
  meta: { title?: string; category?: string },
): Promise<void> {
  const supabase = createClient();
  const path = `${houseId}/${Date.now()}-${safeName(file.name)}`;
  const up = await supabase.storage.from("documents").upload(path, file, { upsert: false });
  if (up.error) throw up.error;
  const { error } = await supabase.from("documents").insert({
    house_id: houseId,
    title: (meta.title || "").trim() || file.name,
    category: meta.category ?? null,
    storage_path: path,
    file_name: file.name,
    mime: file.type || null,
    size_bytes: file.size,
    uploaded_by: await myId(),
  });
  if (error) throw error;
}

export async function documentUrl(storagePath: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from("documents").createSignedUrl(storagePath, 3600);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteDocument(id: string, storagePath: string): Promise<void> {
  const supabase = createClient();
  await supabase.storage.from("documents").remove([storagePath]);
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw error;
}

// ── Fotky / videa ───────────────────────────────────────────────────────────
export async function listMedia(houseId: string): Promise<DbMedia[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("house_id", houseId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DbMedia[];
}

export async function uploadMedia(
  houseId: string,
  file: File,
  meta: { caption?: string; room?: string },
): Promise<void> {
  const supabase = createClient();
  const path = `${houseId}/${Date.now()}-${safeName(file.name)}`;
  const up = await supabase.storage.from("media").upload(path, file, { upsert: false });
  if (up.error) throw up.error;
  const { error } = await supabase.from("media").insert({
    house_id: houseId,
    kind: file.type.startsWith("video") ? "video" : "photo",
    storage_path: path,
    caption: (meta.caption || "").trim() || null,
    room: (meta.room || "").trim() || null,
    uploaded_by: await myId(),
  });
  if (error) throw error;
}

// Podepsané URL pro více médií najednou (pro zobrazení náhledů)
export async function signedMediaUrls(paths: string[]): Promise<Record<string, string>> {
  if (paths.length === 0) return {};
  const supabase = createClient();
  const { data, error } = await supabase.storage.from("media").createSignedUrls(paths, 3600);
  if (error) throw error;
  const map: Record<string, string> = {};
  for (const item of data ?? []) {
    if (item.path && item.signedUrl) map[item.path] = item.signedUrl;
  }
  return map;
}

export async function deleteMedia(id: string, storagePath: string): Promise<void> {
  const supabase = createClient();
  await supabase.storage.from("media").remove([storagePath]);
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) throw error;
}
