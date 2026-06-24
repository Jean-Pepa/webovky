import { cookies } from "next/headers";

// Sdílené jednoduché heslo do zázemí. Bez účtů — jen jedno heslo pro celý tým.
// Nastav přes proměnnou prostředí MARENA_PASSWORD (jinak výchozí "marena").
export function correctPassword(): string {
  return process.env.MARENA_PASSWORD || "marena";
}

export const AUTH_COOKIE = "marena_auth";

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE)?.value === correctPassword();
}
