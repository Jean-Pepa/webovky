// Pomocníci pro čtení FormData (plain modul – lze importovat do "use server" souborů).

export function optStr(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? "").trim();
  return v || null;
}

export function reqStr(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

export function optInt(fd: FormData, key: string): number | null {
  const v = String(fd.get(key) ?? "").replace(/\s/g, "");
  if (!v) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}
