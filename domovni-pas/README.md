# Domovní pas

Trvalý, přenositelný digitální záznam historie nemovitosti — opravy, závady, revize,
rekonstrukce, dokumenty a fotky na jednom místě, připravený k převodu na nového majitele při
prodeji. *(Analogie: CarVertical/Carfax, ale pro dům či byt.)*

Samostatná MVP aplikace postavená podle strategického reportu (sekce 10–13).

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** + **Tailwind CSS v4**
- **PostgreSQL** + **Prisma ORM**
- **Vercel Blob** na soubory (lokálně bez tokenu fallback na disk)
- Vlastní e-mail/heslo autentizace (`jose` JWT v httpOnly cookie, scrypt hashování)

---

## 🚀 Nasazení na Vercel

Aplikace je v **podsložce `domovni-pas/`** tohoto repozitáře.

1. **vercel.com → Add New → Project** a naimportuj repozitář `Jean-Pepa/webovky`.
2. V nastavení projektu nastav **Root Directory = `domovni-pas`** (klíčové — jinak Vercel
   najde web architekta v kořeni repa). Framework Next.js se detekuje sám.
3. **Přidej databázi a úložiště** (Project → Storage):
   - **Neon** (Postgres) → automaticky nastaví `DATABASE_URL` a `DATABASE_URL_UNPOOLED`.
   - **Blob** → automaticky nastaví `BLOB_READ_WRITE_TOKEN`.
4. **Přidej proměnnou** `AUTH_SECRET` (Settings → Environment Variables). Vygeneruj např.:
   ```bash
   openssl rand -base64 32
   ```
5. **Deploy** (případně Redeploy, pokud první build proběhl ještě před přidáním integrací).
   Build sám spustí `prisma migrate deploy` a vytvoří tabulky v databázi.
6. Hotovo — otevři URL a **zaregistruj se**. (Volitelně demo data: viz níže `db:seed`.)

> **Produkční větev:** Vercel nasazuje produkční branch (výchozí `main`). Buď tuhle větev
> mergni do `main`, nebo v projektu nastav produkční branch na
> `claude/relaxed-galileo-l4gvq1`. Každý push na větev navíc vytvoří Preview deployment.

---

## 💻 Lokální vývoj

```bash
cd domovni-pas
npm install
cp .env.example .env        # vyplň DATABASE_URL (+ UNPOOLED) a AUTH_SECRET
npm run db:migrate          # vytvoří schéma v databázi
npm run db:seed             # (volitelné) demo data
npm run dev                 # http://localhost:3000
```

Potřebuješ PostgreSQL — buď připojovací řetězec z Neonu, nebo lokální Postgres. Bez
`BLOB_READ_WRITE_TOKEN` se nahrané soubory ukládají na disk do `/storage`.

### Demo přihlášení (po seedu)

| Role      | E-mail                   | Heslo    |
| --------- | ------------------------ | -------- |
| Majitel   | majitel@domovnipas.cz    | heslo123 |
| Architekt | architekt@domovnipas.cz  | heslo123 |

---

## Co MVP umí (report, sekce 10)

- Účty a přihlášení s rolemi (majitel / odborník)
- Vytvoření a editace nemovitosti (adresa, typ, katastr, parcela…)
- **Časová osa záznamů** — oprava / závada / revize / rekonstrukce, datum, popis, náklad,
  **fotky a videa**
- **Úložiště dokumentů** (projekt, energetický štítek, certifikáty, faktury)
- **Sdílení** — veřejný read-only odkaz, kdykoli vypnutelný
- **Převod vlastnictví** na jiný účet + auditní stopa (jádro hodnoty)
- **Report** k tisku / uložení do PDF
- Architektský víceobjektový účet

## Datový model

`User · Property · Entry · Attachment · Document · Access · TransferLog` — viz
`prisma/schema.prisma`.

## Skripty

```bash
npm run dev          # vývojový server
npm run build        # prisma generate + migrate deploy + next build (používá Vercel)
npm run db:migrate   # aplikovat migrace (prisma migrate deploy)
npm run db:seed      # demo data
npm run db:studio    # Prisma Studio
```
