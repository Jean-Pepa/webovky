---
name: zapis-diktatu
description: Lokální přepis hlasové poznámky v češtině a její zařazení do úkolů, nákupu, deníku nebo paměti. Použij, když uživatel pošle nahrávku nebo řekne „zapiš si".
---

# Zápis diktátu

1. Nahrávku ulož do složky `prichozi/` ve workspace (pokud tam ještě není).
2. Spusť `~/.local/bin/agent-prepis prichozi/NAZEV`. Volbu `--gpu` přidej jen u dlouhé
   nahrávky, když zrovna nepracuje velký jazykový model.
3. Z přepisu vyber:
   - úkoly → `ukoly.md`,
   - nákup → `nakupy.md` (aktuální seznam),
   - fakta a myšlenky → deník (trvalé věci navrhni do `MEMORY.md`),
   - lidi → `lide/`.
4. Pošli mi krátké shrnutí, co kam zapisuješ. U nejistých jmen a čísel se zeptej.
5. Přepis ulož do deníku pod nadpis „Diktát HH:MM". Nahrávku nemaž, o tom rozhoduji já.
