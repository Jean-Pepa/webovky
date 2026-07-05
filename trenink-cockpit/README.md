# Trénink cockpit 🎯

Sdílený tréninkový/health cockpit mezi tebou a Claudem. **Claude čte data z tvého Garminu (Forerunner 965)** přes MCP konektor, vyhodnocuje je a zapisuje do appky; ty je vidíš, píšeš si vlastní poznámky do **deníku** a všechno se ukládá. Do budoucna může Clauda nahradit tvůj **vlastní bot na PC** — píše do stejné databáze.

## Jak to teče
```
Garmin FR965 → Claude (MCP konektor garmin.slajs.eu) → Supabase → tahle appka (zobrazí + vyhodnotí)
                                    ↕
                        Deník (obousměrně: ty ↔ Claude)
```

## Sekce
- **Přehled** — statistiky z aktivit (týdenní objem, VO₂max, tep, nejdelší, poslední aktivita).
- **Aktivity** — seznam aktivit z Garminu, filtr podle typu.
- **Deník** — obousměrná timeline: ty píšeš pocity/nemoci/úspěchy, Claude odpovídá analýzami.
- **Stav** — zda běží cloud (Supabase) nebo lokální režim + návod na zapnutí.

## Dva režimy (jako v Mařeně)
- **Bez Supabase klíčů** → localStorage: appka jede hned, data jen v prohlížeči.
- **Se Supabase klíči** → cloud: obousměrně, sdílené mezi zařízeními, realtime, Claude do dat vidí.

## Zapnutí cloudu (jednorázově)
1. Založ projekt na [supabase.com](https://supabase.com).
2. V **SQL Editoru** spusť [`supabase-schema.sql`](./supabase-schema.sql).
3. Z **Project Settings → API** vezmi Project URL, anon key, service_role key.
4. Zkopíruj `.env.example` → `.env.local` a doplň (na Vercelu do Environment Variables).

## Vývoj
```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Skripty (pro Clauda / tvého bota — potřebují service_role klíč)
```bash
node scripts/ingest.mjs data.json          # nahraje aktivity z Garminu do DB
node scripts/read-journal.mjs 30           # vypíše posledních 30 zápisů deníku
node scripts/post.mjs "text" analysis      # vloží analýzu jménem Clauda
```

> ⚠️ Analýzy zdraví/nemocí jsou orientační, ne lékařská diagnóza. Predikce (věk, výkon) jsou motivační odhady, ne fakta.
