# Zdroje přehledu světa

Odtud každé ráno v 5:30 stahuje skript `agent-novinky svet` zprávy za posledních 24 hodin
a lokální model z nich složí přehled `svet/RRRR-MM-DD.md`. Jiné weby nenavštěvuje.
Jeden zdroj na řádek: `- kategorie | název | adresa`. Kategorie: valka, cesko, svet,
ekonomika, technologie, ostatni. Stačí adresa webu, kanál RSS si skript najde sám.

Adresy jsem nemohl ověřit odsud. Po instalaci spusť `agent-novinky zkontroluj`: u každého
zdroje vypíše, kolik zpráv má. Nefunkční řádek oprav nebo smaž. Víc zdrojů = delší ranní běh.

## Česko

- cesko | iROZHLAS | https://www.irozhlas.cz/rss/irozhlas
- cesko | ČT24 | https://ct24.ceskatelevize.cz/
- cesko | Novinky.cz | https://www.novinky.cz/rss
- cesko | Seznam Zprávy | https://www.seznamzpravy.cz/
- cesko | Deník N | https://denikn.cz/feed/

## Válka a bezpečnost

- valka | Kyiv Independent | https://kyivindependent.com/rss/

## Svět

- svet | BBC News | https://feeds.bbci.co.uk/news/world/rss.xml
- svet | The Guardian | https://www.theguardian.com/world/rss
- svet | Al Jazeera | https://www.aljazeera.com/xml/rss/all.xml
- svet | DW | https://rss.dw.com/xml/rss-en-all
- svet | France 24 | https://www.france24.com/en/rss

## Ekonomika

- ekonomika | BBC Business | https://feeds.bbci.co.uk/news/business/rss.xml
- ekonomika | CNBC | https://www.cnbc.com/id/100003114/device/rss/rss.html
- ekonomika | E15 | https://www.e15.cz/

## Technologie a věda

- technologie | BBC Technology | https://feeds.bbci.co.uk/news/technology/rss.xml
- technologie | BBC Science | https://feeds.bbci.co.uk/news/science_and_environment/rss.xml
- technologie | Ars Technica | https://feeds.arstechnica.com/arstechnica/index
