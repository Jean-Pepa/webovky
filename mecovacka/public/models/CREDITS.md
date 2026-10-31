# Mečovačka — původ modelů

# Molo na jihočeském rybníce — model arény

Soubor: `arenas/molo.glb`. Původní low-poly prostředí autorsky modelované v Three.js z vlastní geometrie, bez externích modelů, textur či převzatých značek. Export GLTFExporter do glTF 2.0 binary. Autorování mimo repozitář: `tmp/mc3d/arena-build.mjs`. Materiály PBR, roughness 0,65–0,82, metalness 0,02–0,16; ploché normály zapečené do geometrie. Statická geometrie sloučena po materiálu a tematické skupině.

Obsah: 36 prken mola, podvodní piloty a diagonální podpěry, boční provazové zábradlí, 4 otevřené barevné veslice s vnitřními prkny, lavičkami, vesly, provazy a bójemi; osm prázdných diváckých uzlů; nepravidelné písčité a travnaté břehy, kameny, rákos s orobincem, lekníny s květy, kachní rodinka, břízy/listnáče/jehličnany, kopce, kostelík s červenou střechou a cibulovou věží, rybářská chata s pobřežním přístavištěm.

Rozměry bojového mola: přesně x = ±1,15 m, z = ±3,6 m, horní plocha y = 0. Hladina není součástí modelu (hra ji kreslí na y = −1,5 m). Oba konce mola mají volný pokračující koridor do z = ±9,6 m bez modelované geometrie nad y = 0. Uzly `spectator_1` až `spectator_8` stojí na podlahách loďek, +Z směřuje k molu.

Trojúhelníky: 47219. Velikost: 2878336 B. Meshů po sloučení: 78. Materiálů: 56. Ověřeno před exportem: limit 60 000 trojúhelníků / 3 MB, prázdné koncové koridory. Ověřeno načtením konečného GLB: 115 vzorků plochy mola v y=0, oba šestimetrové pádové koridory bez překážek, všech osm prázdných diváckých uzlů směrem k molu. Vizuálně zkontrolovány oba pohledy po délce mola, pohled lobby a celek; boční provazové zábradlí je souvislé.

Finální čištění geometrie: odstraněno 16 degenerovaných trojúhelníků na pólech rotačního profilu věže; export bez varování. Paty všech stromů dosedají na skutečný povrch břehu/kopce podle svislého raycastu (2,5 cm zasazení do terénu). Pobřežní rybářský domek doplněn čtyřmi nosnými pilotami. Herní záběry první úplné verze zkontroloval hlavní agent; finální revize obsahuje jen tyto technické opravy.


## Šermíři a cvičný panák

Originální kloubové low-poly modely vytvořené v Three.js a exportované GLTFExporter do glTF 2.0 binary. Žádné převzaté modely ani textury. Identita hlav 0–7 pochází z našich vlastních původních GLB postav TurboKár; načtené head geometrie byly přepočítány do krčního pivotu Mečovačky a zmenšeny na 80 % původní velikosti se středem hlavní hlavy y≈0,27 m nad krkem. Nově ručně navržené stojící postavy mají čelenku, vycpanou vestu s panely, švy a stehy, pásek s přezkou, rukávy, tmavé kalhoty a boty v doplňkové barvě. Panák je původní pytlové a slaměné tělo s terčem, stehy, svázanými pažemi a dřevěným kůlem.

Hierarchie a místní polohy všech 15 kloubů přesně podle AGENTS.md. Klouby bez měřítka a natočení, s výjimkou úchopů grip_r/grip_l (+90° kolem X). Metry, Y nahoru, +Z dopředu. Pevné části se slučují pouze uvnitř stejného kloubu podle materiálu; ploché normály jsou zapečené do geometrie, bez skeletonu a textur. Běžné PBR materiály, roughness 0,78–0,8, metalness 0,03–0,04.

| Soubor | Postava | Trojúhelníky | Meshes | Velikost B | Výška m včetně uší |
|---|---|---:|---:|---:|---:|
| fighters/0.glb | Liška Zrzka | 3408 | 32 | 269860 | 1.930 |
| fighters/1.glb | Žabák Kvak | 3656 | 32 | 287832 | 1.839 |
| fighters/2.glb | Tučňák Frak | 3392 | 32 | 268644 | 1.856 |
| fighters/3.glb | Králík Hop | 3656 | 32 | 287600 | 1.957 |
| fighters/4.glb | Kocour Mour | 3668 | 33 | 289348 | 1.866 |
| fighters/5.glb | Medvěd Huňáč | 3928 | 32 | 307280 | 1.849 |
| fighters/6.glb | Robot Šroubek | 3612 | 32 | 284256 | 1.804 |
| fighters/7.glb | Prasátko Kvík | 3668 | 33 | 289316 | 1.856 |
| fighters/dummy.glb | Cvičný panák | 2720 | 28 | 217084 | 1.916 |

Exportovaný rozsah: finální public/models/fighters. Vizuálně ověřeny finální GLB a pohyb postav v souboji a tréninku skutečného sestavení hry; všech deset dosud dodaných GLB načteno bez chyb nebo varování.

Finální geometrická revize: hlavy na 80 % původní velikosti kolem pevného středu 0,27 m nad krkem, čelenky poměrově sladěny, vyšší polstrovaný límec, zakrytý pas. Pytlové tělo panáka tvoří jediná souvislá rotační geometrie. Degenerované trojúhelníky odstraněny; ploché normály znovu vypočítány a normalizovány. Všech 9 modelů prošlo nezávislým kontraktním validátorem bez chyb i varování, včetně kloubů, PBR, geometrie a limitů. Výška hlavního objemu lebky je přibližně 1,75–1,81 m, uši a účesy mohou přesahovat. Vizuální ověření skutečných finálních GLB probíhá před commitem.

Poslední oprava panáka: prodloužení kůlu od y=0 do y=0,84 m, s překryvem 4 cm do pytle (pytel začíná v y=0,80 m). Upravená pouze geometrie kůlu; všech 15 kloubů a soubory 0–7 beze změny, ověřeno kontrolními součty.


# Pěnový tréninkový meč — původ a specifikace

Původní model vytvořený vlastní geometrií v Three.js; export GLTFExporter do glTF 2.0 binary. Bez externích modelů, textur, značek nebo předloh skutečných zbraní. Generátor mimo repo: `tmp/mc3d/sword-build.mjs`. Výsledek: `models/sword.glb`.

Design: měkká pěnová tyč o průměru přibližně 9–10 cm, široká zaoblená bezpečná záštita 29,8 cm, krémově bílá polokulová špička, tři jemné světlé pásky, pryžový úchop se skutečnými mělkými drážkami a barevnými lemy, měkká zaoblená hlavice. Veškeré materiály roughness 0,80–0,87 a metalness 0,0.

Počátek je střed rukojeti; směr čepele +Y. Prázdné uzly přímo pod identity kořenem: `tip` = (0; 1,16; 0), `guard` = (0; 0,15; 0). Střed hlavice y = −0,132 m, spodní bod přibližně −0,171 m. Přesné přebarvitelné materiály `foam` a `accent`; bílá špička a tmavá rukojeť mají vlastní stálé materiály.

Trojúhelníky: 1430; velikost: 87580 B; po sloučení 5 meshů. Ploché normály zapečeny, degenerované trojúhelníky odstraněny. Ověřeny limity 1500 trojúhelníků, přesná výška špičky a neměnné lokální uzly pro integraci sword.ts.


## Věci na krájení

Devět originálních low-poly modelů ručně navržených v Three.js, export glTF 2.0 binary pomocí GLTFExporter. Bez převzatých modelů, textur, externích souborů nebo kostry. Barvy PBR materiálů, roughness 0,68–0,8; metalness 0,03, u zlatého jablka 0,15–0,18. Ploché jednotkové normály, odstraněné nulové trojúhelníky.

Osm krájených objektů má identity uzly half_a (x≥0) a half_b (x≤0), geometrii v souřadnicích celého plodu, obě části uzavřené v rovině x=0 materiálem flesh. Řezy mají vytriangulované barevné vložky bez překryvných koplanárních ploch: meloun pecky a světlou kůru, dýně semínkovou komoru, jablka jadřinec a semínka, okurka tři komory se semínky, knedlík kousky housky, poleno letokruhy. Sýrové díry jsou uzavřené skutečné zahloubené misky, nikoli otvory skrz model. Ježek je celý, roztomilá tvář do +Z, vlastní jehličky, oči, ouška a tlapky.

| Soubor | Předmět | Trojúhelníky | Velikost B | Bounds X×Y×Z m |
|---|---|---:|---:|---|
| slice/meloun.glb | Meloun | 860 | 70152 | 0.500 × 0.500 × 0.500 |
| slice/dyne.glb | Dýně | 880 | 72796 | 0.520 × 0.503 × 0.520 |
| slice/jablko.glb | Jablko | 612 | 54196 | 0.300 × 0.316 × 0.300 |
| slice/okurka.glb | Okurka | 724 | 60660 | 0.500 × 0.150 × 0.156 |
| slice/knedlik.glb | Houskový knedlík | 348 | 33532 | 0.420 × 0.260 × 0.260 |
| slice/poleno.glb | Poleno | 1208 | 94108 | 0.500 × 0.260 × 0.260 |
| slice/syr.glb | Sýr | 1112 | 87380 | 0.160 × 0.440 × 0.440 |
| slice/zlate.glb | Zlaté jablko | 612 | 54132 | 0.320 × 0.334 × 0.320 |
| slice/jezek.glb | Ježek | 1428 | 109012 | 0.398 × 0.342 × 0.432 |

Modelování vychází z rozměrů AGENTS.md; stopky, listy a bodliny jsou přirozené drobné přesahy hlavního objemu. Podlouhlé tvary i sýrové kolo mají osu X. Export do finální složky. Nezávislá kontraktní kontrola prošla; všechny celky i rozevřené poloviny byly vizuálně ověřeny z finálních GLB.

QA finálních GLB: kontraktní validátor PASS. U řezů zachováno obvyklé doporučení vizuální prohlídky. Doplněný geometrický audit svařuje shodné pozice s přesností 1 mikrometr a kontroluje počet přilehlých ploch každé hrany: všech 16 polovin a celý ježek mají 0 otevřených hran a 0 hran s více než dvěma plochami. Žádné degenerované trojúhelníky; velikosti a počty podle tabulky výše. Vizuální kontrola celých i rozevřených modelů probíhá skutečným Three.js renderem před commitem.
