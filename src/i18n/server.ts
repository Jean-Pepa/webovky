import { cookies } from "next/headers";
import { DEFAULT_LANG, LANGS, LANG_COOKIE, type Lang } from "./messages";

// Jazyk pro serverové komponenty (z cookie).
export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const raw = store.get(LANG_COOKIE)?.value as Lang | undefined;
  return raw && LANGS.includes(raw) ? raw : DEFAULT_LANG;
}
