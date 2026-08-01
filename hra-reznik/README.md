# POSLEDNÍ EXEKUCE

Arkádová hororová řežba shora. Jeden HTML soubor, žádné závislosti, žádné externí
soubory — grafika je kreslená do canvasu, zvuk se skládá z oscilátorů za běhu.

## Spuštění

Otevři `index.html` v prohlížeči. To je celé.

Kdyby to mělo být na webu, stačí složku hodit do `public/` některé z aplikací
v repu a je to na `/hra-reznik/`.

## Ovládání

| | klávesnice a myš | dotyk |
|---|---|---|
| pohyb | `WSAD` / šipky | levá půlka obrazovky |
| míření a palba | myš + levé tlačítko | pravá půlka obrazovky |
| úhyb | `mezerník` / `shift` | — |
| pauza | `Esc` / `P` | klepnutí |
| zvuk | `M` | — |

Na telefonu hra chce landscape; na výšku ukáže výzvu k otočení.

## Průběh

Čtyři části: **MÁRNICE → JATKA → KREMATORIUM → POSLEDNÍ EXEKUCE**. První tři
jsou vlny nepřátel, poslední je souboj s **KATEM**. Po každé zvládnuté části si
vybíráš jedno ze tří vylepšení, takže každý běh vypadá jinak.

Nepřátelé:

- **hnát** — pomalý, je jich hodně
- **řezník** — občas se rozeběhne a nabere tě
- **sestra** — drží si odstup a plive
- **tlusťoch** — vydrží dost a po smrti se rozpadne na tři hnáty
- **KAT** — tři fáze, rázová vlna sekerou, hází sekery, přivolává pomoc

Zbraně padají z mrtvých: brokovnice, vrhací sekáček (prostřelí několik těl)
a motorovka na blízko. Základní pistole má nekonečno nábojů, takže nikdy
neskončíš úplně s prázdnou.

Skóre roste s komby — zabíjej rychle po sobě, prodleva delší než tři vteřiny
kombo shodí. Rekord se drží v `localStorage`.

## Poznámky k technice

- Logické rozlišení je pevných 960 × 540, plátno se škáluje na velikost okna
  a kreslí v `devicePixelRatio`, takže je ostré na retina displejích.
- Krev na podlaze se maluje do samostatného offscreen plátna, takže zůstává
  ležet bez ceny za překreslování.
- Zvuk je Web Audio: pár oscilátorů, jeden sdílený šumový buffer a dolní
  propust. Kontext se nastartuje až po prvním vstupu uživatele.
