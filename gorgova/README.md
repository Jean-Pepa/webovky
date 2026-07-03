# Gorgova — rybářský průvodce deltou Dunaje

Statická webová appka (bez build kroku): detailní průvodce rybařením v okolí
Agropenzionu Beluga ve vsi Gorgova (delta Dunaje, Rumunsko).

- **Interaktivní mapa lovišť** (Leaflet, OSM + satelit) s filtrem podle druhu ryby
- **Loviště podrobně** — jezera, kanály a ramena s GPS, technikami a nástrahami
- **Ryby delty** — na co, jak a kdy chytat jednotlivé druhy
- **Sezóna a počasí** — měsíční teploty vzduchu a vody, srážky, matice „kdy co bere"
- **Pravidla a povolenky** — ARBDD/ANPA, hájení, limity, zakázané zóny
- **Příprava** — interaktivní checklisty (stav se ukládá v prohlížeči)
- **Penzion a doprava** — kontakty, lodní spojení Navrom z Tulcey

## Spuštění

Stačí otevřít `index.html` v prohlížeči, nebo servírovat složku např.:

```bash
npx serve gorgova
# nebo
python3 -m http.server -d gorgova 8000
```

Leaflet je vendorovaný v `vendor/leaflet/` — jediné, co appka tahá ze sítě,
jsou mapové dlaždice (OpenStreetMap / Esri).

## Data

Veškerý obsah je v `data.js` (loviště s GPS, druhy, klima, pravidla, checklisty,
zdroje). Informace pocházejí z hloubkové rešerše (weby místních průvodců, oficiální
stránky rezervace ARBDD, jízdní řády Navrom, klimatické databáze) — u každého
loviště a druhu je štítek, zda je údaj potvrzen více zdroji, a odkazy na zdroje.
