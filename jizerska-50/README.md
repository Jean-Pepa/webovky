# Jizerská 50 — příprava bez sněhu 🎿

Osobní webová appka: **24týdenní plán přípravy na Jizerskou padesátku** (60. ročník, klasika 50 km, 11.–14. 2. 2027 v Bedřichově) **bez běžek** — celá příprava je off-snow (běh, chůze s holemi, imitace, síla, kolo).

Postavené na míru: muž, 23 let, 185 cm, start ~98 kg → cíl **85 kg** + nabrat svaly (body recomposition), start plánu **31. 8. 2026**.

## Co appka umí
- **Přehled** — odpočet do závodu, aktuální týden/fáze, dnešní jednotka, postup a váha.
- **Plán** — 24 týdnů v 5 periodizovaných fázích, jednotky na každý den, odškrtávání splněno (progres v prohlížeči).
- **Váha & kalorie** — kalkulačka BMR/výdeje/deficitu a maker (bílkoviny 2 g/kg), graf váhy vs. plánovaná křivka.
- **Cviky** — zásobník cviků pro běžkaře (core, dvojšlap/horní půlka, nohy, imitace, mobilita).
- **Teorie** — souhrn researchu: polarizace 80/20, periodizace, síla bez sněhu, recompo, regenerace + zdroje.

## Data
Vše se ukládá lokálně v prohlížeči (**localStorage**), bez přihlašování a bez backendu. Data zůstávají na daném zařízení.

## Vývoj
Next.js 16 (App Router) + React 19 + Tailwind v4.

```bash
npm install
npm run dev     # vývoj
npm run build   # kontrola produkce
npm run lint
```

> ⚠️ Plán je obecné doporučení pro zdravého sportovce, ne náhrada lékaře/trenéra.
