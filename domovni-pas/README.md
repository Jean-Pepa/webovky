# Domovní pas

Trvalý, přenositelný digitální záznam historie nemovitosti — opravy, závady, revize,
rekonstrukce, dokumenty a fotky na jednom místě, připravený k převodu na nového majitele při
prodeji. *(Analogie: CarVertical/Carfax, ale pro dům či byt.)*

Toto je samostatná MVP aplikace postavená podle strategického reportu (sekce 10–13).

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Prisma ORM** + **SQLite** pro vývoj (produkce → PostgreSQL, stačí změnit `provider` a `DATABASE_URL`)
- Vlastní e-mail/heslo autentizace (`jose` JWT v httpOnly cookie, scrypt hashování)
- Lokální objektové úložiště souborů s abstrakcí pro pozdější S3

## Rychlý start

```bash
cd domovni-pas
npm install
npm run setup     # prisma generate + db push + seed
npm run dev       # http://localhost:3000
```

### Demo přihlášení (po seedu)

| Role      | E-mail                   | Heslo    |
| --------- | ------------------------ | -------- |
| Majitel   | majitel@domovnipas.cz    | heslo123 |
| Architekt | architekt@domovnipas.cz  | heslo123 |

## Co MVP umí (report, sekce 10)

- Účet a přihlášení s rolemi (majitel / odborník)
- Vytvoření a editace nemovitosti (adresa, typ, katastr, parcela…)
- **Časová osa záznamů** — typ (oprava / závada / revize / rekonstrukce / jiné), datum, popis,
  náklad, **fotky a videa**
- **Úložiště dokumentů** (projekt, energetický štítek, certifikáty, faktury)
- **Sdílení** — veřejný read-only odkaz, kdykoli vypnutelný
- **Převod vlastnictví** na jiný účet + auditní stopa (jádro hodnoty)
- **Report** k tisku / uložení do PDF
- Architektský víceobjektový účet (struktura rolí)

## Datový model

`User · Property · Entry · Attachment · Document · Access · TransferLog`
— viz `prisma/schema.prisma`.

## Přechod na produkci

1. V `prisma/schema.prisma` změnit `datasource db` provider na `postgresql`.
2. Nastavit `DATABASE_URL` (PostgreSQL) a silný `AUTH_SECRET` v `.env`.
3. Úložiště souborů (`src/lib/storage.ts`) přepojit na S3-kompatibilní službu.
4. `npx prisma migrate deploy`.

## Užitečné příkazy

```bash
npm run dev        # vývojový server
npm run build      # produkční build (prisma generate + next build)
npm run db:studio  # Prisma Studio (prohlížeč databáze)
npm run db:seed    # znovu naplnit demo data
```
