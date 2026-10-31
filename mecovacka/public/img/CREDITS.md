# Mečovačka — původ obrázků

## Obloha arény — `sky-molo.jpg`

Původní panoramatická ilustrace vytvořená vestavěným OpenAI ImageGen (`transparent_background=false`), bez cizích obrazových předloh. Námět vychází z `mecovacka/AGENTS.md`: jihočeský rybník v odpoledním světle, vzdálené zalesněné kopce a pole. Styl a měřítko vzdálené krajiny navazují na panoramata TurboKár.

Technický export přes Windows System.Drawing/GDI+: zdrojové PNG 2172×724 px bylo bicubic převzorkováno na 4096×1024 px. Pro horizontální opakování byly sladěny levý a pravý okraj v pásu 128 px, s plně symetrickým prvním 16px pásem. Horních 96 px přechází do #4d8fe8, spodních 160 px do #f3dcc0. JPEG kvalita 85. Explicitní sRGB ICC profil (480 B, ověřený standardní profil používaný také v ikonách TurboKár) byl vložen jako APP2 metadata bez dalšího překódování.

### Přesný prompt

> Use case: stylized-concept. Asset type: seamless 360-degree horizontal sky panorama for an original cheerful low-poly foam-sword game called Mečovačka, set on a wooden pier at a South Bohemian pond. Create a polished very wide 4096 by 1024 pixel 4:1 landscape illustration. A warm, impressive yet peaceful golden-afternoon South Bohemian countryside atmosphere. Upper two-thirds: open blue sky #4d8fe8 fading smoothly toward warm peach #ffe2bd near the horizon, with a few generous rounded cumulus cloud clusters softly lit in warm ivory, lavender-gray lower planes. Lower quarter: gentle distant rolling forested hills, mixed deciduous woodland and a few dark conifer patches, small golden and green patchwork fields separated by hedgerows, layered atmospheric depth. Hills must remain distant and low, with no steep mountains. Forests and fields fade smoothly into warm pale fog, the entire bottom edge becomes uniform #f3dcc0. Cheerful clean cartoon game illustration, simple confident shapes, soft cel shading, subtle dark indigo #1b1430 contour accents softened with distance, vivid but tasteful colors. Match the scale of panoramic scenery for a low-poly kart game: huge open sky, modest distant horizon, no foreground props or detailed near trees. This wraps around a cylindrical sky dome: left and right edges MUST continue seamlessly with matching sky gradients, cloud shapes and hill heights. No visible sun or sun disk, no moon, no text, no logos, no people or animals, no buildings, no roads, no boats, no pier, no foreground water, no Nintendo motifs. Entire image opaque.

### Ověření výsledku

- Rozměry 4096×1024 px; velikost 255 041 B, pod limitem 1,5 MB.
- JPEG 85, RGB, explicitní sRGB ICC profil ověřen čtením výsledného souboru.
- Vizuální kontrola celku i pásu přes skutečný spoj: teplý jihočeský den, kupovité mraky, vzdálené lesy a pole, bez slunce, textu a postav. Okraje navazují bez viditelného svislého švu.
- Průměrný rozdíl spojovaných krajních sloupců po JPEG je 0,31836/255 na barevný kanál; maximální jednotlivý rozdíl 9/255. 668 z 1024 řádků má krajní pixely identické.
- Horní středový pixel RGB(77,142,232), spodní RGB(244,220,192); odchylka od předepsaných barev nejvýše 1 na kanál kvůli JPEG.
- V repozitáři v rámci této dílčí práce přidán pouze `mecovacka/public/img/sky-molo.jpg`, bez zásahu do kódu.

Zdroj vestavěného generátoru: `exec-4a9f9287-b868-4a1c-ba17-34ebd59bea1a.png`.
