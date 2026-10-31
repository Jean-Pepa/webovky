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
