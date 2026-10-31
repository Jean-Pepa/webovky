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


### `logo.png`

Vytvořeno vestavěným OpenAI ImageGen. Původní logo Mečovačka se dvěma háčky nad č, motivem měkkého pěnového meče a šplouchnutí, v žluto-tyrkysové paletě. Následovala cílená úprava čistoty průhledného obrysu při zachování nápisu a motivů. První výstup: exec-c93e2149-092a-493c-9cdb-3aa88922b6d9.png.

Zdroj: `exec-8f7ae8d2-7c3e-44fb-84e1-327aa887c0a1.png`. Reference: turbokary/public/img/logo.png (vlastní grafika, pouze styl).

Mechanický export sharp: 1600×560, Lanczos3 contain, ořez prázdných alfa okrajů, sRGB ICC, PNG komprese 9 bez kvantizace a zachování alfa kanálu.

Přesný prompt:

```text
Původní generování:
Use case: logo-brand.
Asset type: finished wide transparent title logo for an original Czech cheerful foam-sword game, final 1600x560.
Reference image is ONLY a reference for the polished thick cartoon lettering, clean dark-purple outlines and cream outer keyline that make the sister game's logo readable. Create a NEW independent logo, no racing flag, no kart, no copied lettering word.
Exact text: "Mečovačka". Spell M e č o v a č k a, with a clear Czech caron on BOTH lowercase č characters. No other text.
Make the word the dominant element, on ONE horizontal line, friendly chunky rounded italic display lettering, confident thick dark purple #1b1430 outline and subtle 3D extrusion, warm ivory thin outer keyline. First part "Mečo" in rich golden yellow #ffd21f with soft warm highlights, remaining "vačka" in vivid turquoise #4fd1ff with soft cyan highlights. Letters and both carons remain extremely legible; carons must not be covered by props.
Below the word is a single thick rounded FOAM TRAINING SWORD used like a playful underline, colorful turquoise cylindrical foam blade, large rounded WHITE safety cap, small warm yellow rounded guard and dark-purple padded grip. It clearly looks like a soft sports toy, not a sharp metal weapon. One compact turquoise water splash curls around the right end to suggest a pond. Keep these motifs secondary so the logo stays clean at small scale.
Composition: wide 20:7 landscape, complete centered silhouette with comfortable transparent margins; no cropping.
Style: energetic premium 2D cartoon game logo, simple bold shapes, soft cel shading, crisp dark outlines. Transparent background with genuine alpha. It must work on dark #14123a and on a busy 3D pond scene.
Avoid: real brands, realistic weapons, metallic sharp blades, blood, existing game motifs, people, crests, shields, stars, question mark blocks, mushroom motifs, any background panel, extra text, watermark.

Cílená úprava obrysu:
Use case: precise-object-edit. The provided image is the finished transparent Mečovačka logo. Keep its exact layout, shapes, text spelling "Mečovačka", BOTH Czech carons, yellow and cyan letters, dark outlines, cream outer keyline, foam sword and water splash. Change ONLY the cutout quality: remove all detached tiny specks, ragged white fringe, colored noise and semi-transparent background remnants outside the intended continuous cream outer keyline. Make the outer silhouette smooth, crisp and professionally antialiased with clean real alpha. Preserve genuine full transparency outside the artwork and inside intended holes; no replacement background or panel. Do not redesign, move or redraw any letter or motif. Preserve 20:7 wide composition with safe margin.
```
