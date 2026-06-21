# 📸 Foticí návod — DESKY / PŘEKLIŽKY (čti jako první!)

> Tohle je **nejdůležitější dokument celého projektu.** Způsob focení rozhoduje o přesnosti víc než jakýkoli model. Když budou fotky konzistentní, model bude fungovat. Když ne, nepomůže ani sebelepší AI.

## Co počítáme
Počet desek/překližek **ve stohu z fotky jeho ČELA** — tedy hran naskládaných desek na sobě. Každá deska = jedna tenká vodorovná hrana.

```
   ┌───────────────────────┐   ← deska 1  (počítáme tyhle hrany)
   ├───────────────────────┤   ← deska 2
   ├───────────────────────┤   ← deska 3
   ├───────────────────────┤   ← deska 4
   └───────────────────────┘   ← deska 5
        čelo stohu (fotíš tohle)
```

## ✅ Jak fotit správně
1. **Kolmo na čelo stohu.** Telefon drž rovnoběžně s čelem, ne šikmo. Šikmý úhel = hrany se sbíhají perspektivou a splete se i člověk, nejen model.
2. **Celý stoh v záběru** a ostře zaostřeno na hrany.
3. **Vyplň záběr stohem**, co nejmíň pozadí.
4. **Rovnoměrné světlo.** Lehký boční stín mezi deskami pomáhá (zvýrazní spáry), ale ne přepal/odlesky přes celé čelo.
5. **Stejná vzdálenost pokaždé** (např. ~1–2 m). Konzistence = vyšší přesnost.
6. **Jeden stoh = jedna fotka.**
7. **Vysoké rozlišení**, hlavně u vysokých stohů (hrany jsou tenké = malé objekty).
8. **Pro start jen JEDNA tloušťka/typ desky.** Míchání tlouštěk = víc tříd = víc dat. Rozšíříš později.

## ❌ Čeho se vyvarovat
- Šikmý úhel / perspektiva
- Rozmazané nebo podexponované fotky
- Velké lesklé odlesky přes celé čelo
- Půlka stohu mimo záběr
- Míchání různých tlouštěk v prvním kole

## 📦 Kolik fotek a jakých
- **150–300 fotek** různých stohů.
- **Rozpětí počtů**: malé i velké stohy (5, 15, 30, 60+ desek). Ne jen jeden počet.
- Různá místa, světlo, drobně různé (ale pořád kolmé) úhly.
- **Ke každé fotce si poznač skutečný počet** (do názvu souboru nebo tabulky) — budeš to potřebovat na změření přesnosti (MAE).

## 🏷️ Jak značit (anotace v Roboflow)
- Každou viditelnou hranu desky orámuj **jedním boxem**, třída **`deska`**.
- Označuj **konzistentně**, i okrajové/částečně zakryté kusy.
- Validační sadu odděl **po stozích** (celé stohy do validace), ne náhodně po fotce — jinak podvádíš sám sebe.

## 🎯 Cíl prvního kola
Natrénovat model a změřit **počítací chybu (MAE)** na tvých fotkách. Když bude např. **< 5 %**, jdeme dál a škálujeme. Když ne, víme, co doladit (lepší focení / segmentace / SAHI dlaždice) — a stálo to jen víkend, ne měsíce.

---
Další krok po nasbírání a anotaci → `../training/README.md` (trénink RF‑DETR a export).
