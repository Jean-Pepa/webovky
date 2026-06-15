# Pejskaři 🐾

Mobilní aplikace pro majitele psů. Spojuje to, co je dnes roztříštěné do desítek
appek, kolem **jednoho účtu a jednoho psa**.

Tohle je **MVP první fáze** podle projektového briefu — staví na funkci, kterou
konkurence nedělá: **personalizovaný výcvikový plán pro konkrétního psa**
(podle plemene, věku a pokroku), doplněný o obsahového průvodce péčí a zdravím.

> Primárně mobilní aplikace (iOS + Android z jednoho kódu), s webem jako bonusem.

## Co aplikace umí

- **Profil psa** — jméno, plemeno, věk, pohlaví, váha, avatar. Jádro celé appky.
- **Výcvikový plán na míru** — knihovna 25 lekcí v 5 úrovních. Plán se filtruje
  podle věku psa a řadí podle povahy plemene (energická plemena dostanou dřív
  přivolání a práci na vodítku). Vyšší úrovně se odemykají postupně.
- **Detail lekce** — proč to dělat, postup krok za krokem, tipy, doporučené
  vybavení a označení „splněno“. Pokrok se sleduje pro každého psa zvlášť.
- **Průvodce** — kurátorované články (péče, zdraví, výživa, plemena, cestování)
  s filtrováním podle kategorie.
- **Více psů** — přepínání mezi profily, samostatný pokrok pro každého.
- **Offline-first** — data se ukládají lokálně (AsyncStorage), bez nutnosti
  backendu nebo přihlášení.

Místa pro budoucí **affiliate monetizaci** (vybavení k lekcím, pojištění,
ubytování na cesty) jsou v UI připravená jako nenásilné „doporučené“ bloky.

## Tech stack

- **Expo SDK 56** (React Native 0.85, React 19)
- **Expo Router** — file-based navigace (`src/app/`)
- **TypeScript** (strict)
- **AsyncStorage** — lokální persistence
- Vlastní light/dark téma (žádná těžká UI knihovna)

## Spuštění

```bash
cd pejskari-app
npm install
npx expo start
```

Pak:

- naskenuj QR kód aplikací **Expo Go** (iOS/Android) — nejrychlejší cesta na
  telefonu,
- nebo `npm run android` / `npm run ios` pro emulátor/simulátor,
- nebo `npm run web` pro náhled v prohlížeči.

## Struktura projektu

```
src/
  app/                 # obrazovky (Expo Router)
    (tabs)/            # Domů, Výcvik, Průvodce, Profil
    onboarding.tsx     # první spuštění – vytvoření profilu psa
    dog/               # přidání a úprava psa (modální)
    lesson/[id].tsx    # detail výcvikové lekce
    guide/[id].tsx     # detail článku
  components/          # UI kit (Button, Card, Chip, …) a stavební prvky
  data/                # obsah – plemena, lekce, články, kategorie
  lib/                 # logika plánu (plan.ts) a formátování (format.ts)
  store/               # globální stav + persistence (dog-store.tsx)
  constants/theme.ts   # barvy, spacing, radius
  hooks/               # téma a color scheme
```

## Kam dál (podle briefu)

1. **Retence** — připomínky očkování, oblíbená místa, streaky ve výcviku.
2. **Účet a synchronizace** — backend (např. Supabase) pro zálohu mezi zařízeními.
3. **Affiliate** — napojení doporučeného vybavení, pojištění a ubytování.
4. **Síť** — mapy psích míst a komunita (až bude koho zapojit).
5. **Marketplace** — venčitelé, hlídači, trenéři.
