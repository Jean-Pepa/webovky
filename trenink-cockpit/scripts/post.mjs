// Vloží zápis do deníku jménem Clauda (analýza / plán / poznámka / odpověď).
// Použití:  node scripts/post.mjs "text zprávy" [kind]
//   kind = note | analysis | plan | question  (výchozí analysis)
import { admin } from "./_env.mjs";

const body = process.argv[2];
const kind = process.argv[3] || "analysis";
if (!body) {
  console.error('Použití: node scripts/post.mjs "text" [note|analysis|plan|question]');
  process.exit(1);
}

const db = admin();
const { error } = await db.from("cockpit_journal").insert({ author: "claude", kind, body });
if (error) {
  console.error("Chyba:", error.message);
  process.exit(1);
}
console.log("Zápis přidán do deníku.");
