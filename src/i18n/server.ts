import { headers } from "next/headers";
import { DEFAULT_LANG, LANGS, type Lang } from "./messages";

// Jazyk pro serverové komponenty – z hlavičky x-locale nastavené middlewarem.
export async function getLang(): Promise<Lang> {
  const h = await headers();
  const raw = h.get("x-locale") as Lang | null;
  return raw && LANGS.includes(raw) ? raw : DEFAULT_LANG;
}
