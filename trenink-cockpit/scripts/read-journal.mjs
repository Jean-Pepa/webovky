// Vypíše poslední zápisy z deníku (abych, Claude, viděl tvoje poznámky).
// Použití:  node scripts/read-journal.mjs [počet]
import { admin } from "./_env.mjs";

const limit = parseInt(process.argv[2] || "30", 10);
const db = admin();
const { data, error } = await db
  .from("cockpit_journal")
  .select("*")
  .order("created_at", { ascending: false })
  .limit(limit);

if (error) {
  console.error("Chyba:", error.message);
  process.exit(1);
}
for (const e of data.reverse()) {
  console.log(`[${e.created_at}] ${e.author} (${e.kind}): ${e.body}`);
}
