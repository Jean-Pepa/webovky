# BULO — backend (Supabase)

Jak appku stavíme: **datový hub domu, který vlastní klient**. Páteří je dokumentace
(půdorysy, 3D model), kolem ní žijí **systémy domu** (solár, elektřina, voda, topení)
a hlavně **as-built fotky/videa** („kudy se vedla elektrika"). Architekt má jen menší
přístup — předá finální balíček (půdorysy + model + dokumentace) a dál jen čte.

Videa, fotky a 3D modely se nevejdou do prohlížeče → potřebujeme reálný backend.
Volba: **Supabase** = databáze (Postgres) + úložiště souborů + přihlášení + řízení
přístupu (RLS), vše v jedné službě.

## Mapování appky na Supabase
| V appce | Tabulka / bucket |
|---|---|
| Účet (klient / architekt) | `profiles` (+ Supabase Auth) |
| Dům | `houses`, sdílení/architekt přes `house_members` |
| Dokumentace, půdorysy, 3D model | `documents` + bucket `documents` |
| Systémy domu (solár/el./voda/topení) | `systems` (parametry v `specs` jsonb) |
| Fotky/videa (as-built, špendlík v půdorysu) | `media` + bucket `media` |
| Odečty / spotřeby (později z měřičů) | `readings` (time-series, `source` manual/api) |
| Záruky a revize | `reminders` |
| Historie (časová osa) | `entries` |

## Setup (jednorázově)
1. Založ projekt na <https://supabase.com>.
2. **SQL Editor → New query** → vlož celý `supabase/schema.sql` → **Run**.
   (Vytvoří tabulky, RLS i buckety `documents` a `media`.)
3. **Project Settings → API** → zkopíruj `Project URL` a `anon public` klíč
   (a `service_role` jen pro server).
4. Nastav proměnné (viz `.env.local.example`):
   - lokálně: vytvoř `domovni-pas/.env.local`
   - na Vercelu: Project → Settings → Environment Variables
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...   # jen server
   ```
5. **Authentication → Providers** → zapni Email (magic link nebo heslo).
6. Závislosti už jsou: `@supabase/supabase-js`, `@supabase/ssr`.

Konvence úložiště: soubory pod cestou `"<house_id>/<soubor>"` (první složka = ID domu,
podle toho fungují přístupová pravidla).

## Role a předání
- **Klient (majitel):** vlastník domu (`houses.owner_id`), plný přístup.
- **Architekt:** přidán jako `house_members.role = 'architect'` — nahraje předávací
  balíček (půdorysy, model, dokumentace). Po `handed_over = true` mu appka nechá jen
  čtení.

## Roadmap stavby
1. **Auth** — přihlášení/registrace přes Supabase (klient × architekt), profil, odhlášení.
2. **Domy + dokumentace** — CRUD domů z DB, upload souborů do bucketu `documents`
   (vč. 3D modelu ke stažení).
3. **Systémy + média** — systémy domu s parametry; upload fotek/videí do `media`,
   tagování systém + místnost; as-built.
4. **Špendlík v půdorysu** — připnout fotku na bod v plánu („kudy vede").
5. **Odečty** — grafy spotřeb; nejdřív ruční, pak automatické napojení (API měničů/měřičů,
   `readings.source = 'api'`).
6. **Sdílení / předání** — pozvání architekta, převod na klienta, veřejný náhled.

> RLS politiky ve `schema.sql` jsou v1 — při stavbě funkcí je doladíme.
