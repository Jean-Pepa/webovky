# E2E smoke test

Proklikání všech hlavních tlačítek a funkcí Mařeny v reálném prohlížeči
(Chromium přes `playwright-core`). Pokrývá veřejnou homepage, přihlášení,
identity gate a celé zázemí (nástěnka, hlasování, tým & role, provoz,
finance + denní kasa, merch + veřejná objednávka + automatika do financí,
kalendář, úkoly, kontakty, program, mazání s potvrzením, odhlášení).

## Spuštění

V jednom terminálu spusť dev server, v druhém test:

```bash
npm run dev      # http://localhost:3000
npm run e2e      # proklikání všeho
```

Test funguje i **bez Redisu** (demo režim přes `localStorage`) — heslo do
zázemí je libovolné platné `marena<rok>` (např. `marena2026`). Každý běh
startuje v čistém kontextu prohlížeče, takže testovací data se nehromadí.

## Konfigurace (env)

| Proměnná      | Význam                                   | Výchozí                  |
| ------------- | ---------------------------------------- | ------------------------ |
| `BASE_URL`    | adresa běžící appky                      | `http://localhost:3000`  |
| `CHROME_PATH` | cesta k prohlížeči                       | autodetekce              |
| `E2E_SHOT`    | kam uložit závěrečný screenshot          | systémové temp           |
| `E2E_W`       | šířka okna (px) — test na telefonu/tabletu | `1400`                 |
| `E2E_H`       | výška okna (px)                          | `1000`                   |

Test napříč velikostmi displejů (telefon → desktop):

```bash
E2E_W=320 npm run e2e     # nejmenší telefon
E2E_W=390 npm run e2e     # běžný telefon
E2E_W=768 npm run e2e     # tablet
npm run e2e               # desktop (1400)
```

Návratový kód je nenulový, pokud nějaký krok selže nebo na stránce nastane
neodchycená JS výjimka. Hlášky `503 /api/db` (demo režim) a `401` (test
špatného hesla) v konzoli jsou očekávané — nejde o chyby aplikace.
