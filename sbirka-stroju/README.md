# Sbírka historických silničních strojů – prodejní web

Statický prodejní web sbírky 26 historických silničních strojů (1928–1980) s virtuální 3D halou.
Nepotřebuje build: stačí servírovat obsah této složky.

| Soubor | Obsah |
|---|---|
| `index.html` | celý web (texty, ceny, mapa, časová osa) |
| `lux.js` | virtuální hala a detail strojů (three.js, sbaleno) |
| `studio/` | 3D rendery strojů (`sNN.jpg` velké, `tNN.jpg` náhledy, `hall.jpg` úvod haly) |
| `foto/` | fotografie strojů z evidence sbírky |
| `katalog.pdf` | tisková kniha pro kupce (A4, 41 stran) |

## Náhled

```bash
npx serve sbirka-stroju
```

## Nasazení na vlastní doménu (Vercel)

Podle pravidel repozitáře se nasazuje jen na výslovný pokyn.

1. Vercel → Add New Project → tento repozitář.
2. Root Directory: `sbirka-stroju`, Framework Preset: Other, Build Command prázdný, Output Directory `.`.
3. Deploy, potom v Settings → Domains přidat vlastní doménu.

## Úpravy

Ceny a texty jsou přímo v `index.html` (tabulka ceníku, karty strojů a datový blok `<script id="data">`).
Při změně ceny upravte všechna tři místa, nebo web nechte vygenerovat znovu z podkladů.
