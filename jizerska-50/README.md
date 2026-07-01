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

## Offline / PWA 📴
Appka je **Progressive Web App** — dá se přidat na plochu telefonu a funguje **offline** (service worker `public/sw.js` nacacheuje appku po první online návštěvě). Manifest je `public/manifest.webmanifest`, ikony `public/icon-*.png`.

⚠️ Service worker se registruje jen v **zabezpečeném kontextu** — tedy přes **HTTPS** nebo `localhost`. Přes `http://<IP-v-síti>` na telefonu se offline režim **neaktivuje**. Pro offline na mobilu je proto potřeba appku jednou načíst z HTTPS adresy (viz níže).

## Vývoj
Next.js 16 (App Router) + React 19 + Tailwind v4. Build je **statický export** do `out/` (`output: "export"`), takže se hostuje jako obyčejné statické soubory kdekoli.

```bash
npm install
npm run dev      # vývoj (http://localhost:3000)
npm run build    # statický export do out/
npm run lint
```

### Vyzkoušet produkční build lokálně (vč. offline)
```bash
npm run build
npx serve out    # naservíruje out/ na http://localhost:3000
```
Na `localhost` je secure context, takže tu offline režim funguje. Pro offline na telefonu nahraj obsah `out/` na libovolný HTTPS statický hosting (Cloudflare Pages, Netlify, GitHub Pages…), otevři jednou na mobilu a dej **Přidat na plochu**.

> ⚠️ Plán je obecné doporučení pro zdravého sportovce, ne náhrada lékaře/trenéra.
