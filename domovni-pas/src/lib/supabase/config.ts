// Je Supabase nakonfigurované? (klíče v .env.local / na Vercelu)
// Když ne, appka jede na demo přihlášení (heslem).
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
