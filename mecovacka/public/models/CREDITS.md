# Mečovačka — původ modelů

# Molo na jihočeském rybníce — model arény

Soubor: `arenas/molo.glb`. Původní low-poly prostředí autorsky modelované v Three.js z vlastní geometrie, bez externích modelů, textur či převzatých značek. Export GLTFExporter do glTF 2.0 binary. Autorování mimo repozitář: `tmp/mc3d/arena-build.mjs`. Materiály PBR, roughness 0,65–0,82, metalness 0,02–0,16; ploché normály zapečené do geometrie. Statická geometrie sloučena po materiálu a tematické skupině.

Obsah: 36 prken mola, podvodní piloty a diagonální podpěry, boční provazové zábradlí, 4 otevřené barevné veslice s vnitřními prkny, lavičkami, vesly, provazy a bójemi; osm prázdných diváckých uzlů; nepravidelné písčité a travnaté břehy, kameny, rákos s orobincem, lekníny s květy, kachní rodinka, břízy/listnáče/jehličnany, kopce, kostelík s červenou střechou a cibulovou věží, rybářská chata s pobřežním přístavištěm.

Rozměry bojového mola: přesně x = ±1,15 m, z = ±3,6 m, horní plocha y = 0. Hladina není součástí modelu (hra ji kreslí na y = −1,5 m). Oba konce mola mají volný pokračující koridor do z = ±9,6 m bez modelované geometrie nad y = 0. Uzly `spectator_1` až `spectator_8` stojí na podlahách loďek, +Z směřuje k molu.

Trojúhelníky: 47219. Velikost: 2878336 B. Meshů po sloučení: 78. Materiálů: 56. Ověřeno před exportem: limit 60 000 trojúhelníků / 3 MB, prázdné koncové koridory. Ověřeno načtením konečného GLB: 115 vzorků plochy mola v y=0, oba šestimetrové pádové koridory bez překážek, všech osm prázdných diváckých uzlů směrem k molu. Vizuálně zkontrolovány oba pohledy po délce mola, pohled lobby a celek; boční provazové zábradlí je souvislé.

Finální čištění geometrie: odstraněno 16 degenerovaných trojúhelníků na pólech rotačního profilu věže; export bez varování. Paty všech stromů dosedají na skutečný povrch břehu/kopce podle svislého raycastu (2,5 cm zasazení do terénu). Pobřežní rybářský domek doplněn čtyřmi nosnými pilotami. Herní záběry první úplné verze zkontroloval hlavní agent; finální revize obsahuje jen tyto technické opravy.
