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


# Mečovačka — character portraits 0–3

Created 2026-10-31 with OpenAI built-in ImageGen, one separate generation/edit call per character. All four are original derivative game artworks using the project's own earlier TurboKáry portraits as identity/style references. No stock imagery, external logos or third-party character designs were used.

## Deliverables

Final images are staged outside the repository in `tmp/mc-portraits/chars/`. They are frozen for root's publication in the requested group order. No repository files were edited by this portrait task.

| File | Character | Dimensions | Bytes | Transparent pixels |
|---|---|---:|---:|---:|
| `0.png` | Zrzka, fox | 512 × 512 | 259655 | 115990 |
| `1.png` | Kvak, frog | 512 × 512 | 262519 | 117952 |
| `2.png` | Frak, penguin | 512 × 512 | 246003 | 120188 |
| `3.png` | Hop, rabbit | 512 × 512 | 250742 | 128745 |

All four are PNG with true alpha transparency and embedded sRGB profile. All four corner alpha values are zero. These are cutouts, not checkerboard backgrounds.

## Reference roles

Identity reference for each ID: `C:\Users\krist\OneDrive\Plocha\CLAUD DATA\webovky-mecovacka-design\turbokary\public\img\chars\{id}.png`. These are the existing original TurboKáry portraits already belonging to the project. Each local reference was visually inspected before generation.

ID 0 used only its own original fox identity reference. IDs 1–3 used their own original portrait as input image 1 and the new high-resolution ID 0 output as input image 2, strictly for matching the new costume, line style and bust composition. Each call set `transparent_background: true`. The game requirements in `mecovacka/AGENTS.md` supplied the character colors and costume brief.

## Generation sources and exact prompts

### 0.png

Generated source: `C:\Users\krist\.codex\generated_images\01a1922e-faf2-7f73-a493-a809c570402c\exec-414d8af7-914d-4217-a805-5094283c9f5f.png`

Exact submitted prompt:

```text
Use case: identity-preserve. Edit this original orange fox game character into a foam-sword sports competitor for the cheerful Czech game Mecovacka. Input image is the identity and style reference. Preserve exactly the same fox face, big expressive brown eyes, orange fur #f27a24, warm cream muzzle and inner ears #fff6ea, ears, hair tuft, dark nose, and thick clean dark-purple #1b1430 outlines. Keep the same head-and-shoulders crop, front-facing with very slight three-quarter turn, same apparent head size and head position, full ears inside canvas, balanced centered portrait on actual alpha-transparent background.
Change clothing: REMOVE the neck scarf completely. Add a plain ORANGE sports HEADBAND #ff7a1a across the forehead, and a thick PADDED ORANGE protective training VEST #ff7a1a over a plain navy T-shirt #2b2d42; navy sleeves visible at shoulders. Vest has simple rounded padded panels and warm cream #fff1d6 edging/short central fastening, no symbols or text. The headband is sporty and simple, with only short ties at the back. Expression is cheerful, confident and determined, friendly smile and slightly focused eyebrows, never angry. Polished soft cel shading, simple chunky cartoon shapes matching the existing character. One isolated portrait; target square512x512 RGBA. No scarf, goggles, sword, props, gloves, frame, backdrop, ground shadow, letters, text, emblem, watermark, or real brand. Preserve actual transparency.
```

### 1.png

Generated source: `C:\Users\krist\.codex\generated_images\01a1922e-faf2-7f73-a493-a809c570402c\exec-02de18e1-4cee-40ee-b0a9-554b92e0f806.png`

Exact submitted prompt:

```text
Use case: identity-preserve. Create the next matching head-and-shoulders portrait for cheerful foam-sword sports game Mecovacka. Input image1 is the FROG IDENTITY to preserve; input image2 is the NEW COSTUME AND COMPOSITION STYLE reference (fox), not an identity to copy. Preserve the same frog as image1: bright green skin #63d34c, pale yellow-green lower face #daf7a6, large rounded protruding eyes with dark pupils, broad cheerful frog smile, no fur or ears. Match image2's thick clean dark-purple #1b1430 outlines, soft cel shading, simple chunky cartoon shapes, apparent head size, centered bust crop and polished outfit design.
REMOVE the old neck scarf completely. Give the frog a plain GREEN sports HEADBAND #3ccf4e across its forehead below the eye bulges, with short ties behind the head, and a thick PADDED GREEN protective training VEST #3ccf4e over a plain coral-red T-shirt #ff6b6b with sleeves visible at both shoulders. Vest uses simple rounded padded panels, lemon-yellow #fff36b edging and simple short center fastenings, same construction as image2. Keep both eyes fully visible and unobstructed by headband. Expression cheerful, confident and determined with friendly smile, not angry. Front with slight three-quarter turn, head and shoulders only, entire silhouette within square with clear alpha margins, similar proportions as fox reference. Target512x512 PNG RGBA, actual transparent background. No scarf, goggles, sword, gloves, props, text, logo, frame, badge, backdrop or ground shadow.
```

### 2.png

Generated source: `C:\Users\krist\.codex\generated_images\01a1922e-faf2-7f73-a493-a809c570402c\exec-85e247a1-3e14-41b6-a96e-c0048b487736.png`

Exact submitted prompt:

```text
Use case: identity-preserve. Create the next matching head-and-shoulders portrait for cheerful foam-sword sports game Mecovacka. Input image1 is the PENGUIN IDENTITY to preserve; input image2 is the NEW COSTUME AND COMPOSITION STYLE reference (fox), not an identity to copy. Preserve the same penguin as image1: round charcoal-black head #23272e, white face patches #ffffff, tuft of feathers, expressive dark eyes and cheerful orange beak. Match image2's thick clean dark-purple #1b1430 outlines, soft cel shading, simple chunky cartoon shapes, apparent head size, centered bust crop and polished outfit design.
REMOVE the old neck scarf completely. Give the penguin a plain CYAN-BLUE sports HEADBAND #22b8f0 across the forehead above the eyes with short ties behind the head, and a thick PADDED CYAN-BLUE protective training VEST #22b8f0 over a plain golden-yellow T-shirt #ffb703 with sleeves visible at both shoulders. Vest uses simple rounded padded panels, WHITE #ffffff edging and simple short center fastenings, same construction as image2. Expression cheerful, confident and determined with a friendly open-beak smile and slightly focused brows, not angry. Front with slight three-quarter turn, head and shoulders only, entire silhouette within square with clear alpha margins, similar proportions as fox reference. Target512x512 PNG RGBA, actual transparent background. No scarf, goggles, sword, gloves, props, text, logo, frame, badge, backdrop or ground shadow.
```

### 3.png

Generated source: `C:\Users\krist\.codex\generated_images\01a1922e-faf2-7f73-a493-a809c570402c\exec-5e457ab8-4969-4cf9-ad49-ea7cb76faab1.png`

Exact submitted prompt:

```text
Use case: identity-preserve. Create the next matching head-and-shoulders portrait for cheerful foam-sword sports game Mecovacka. Input image1 is the RABBIT IDENTITY to preserve; input image2 is the NEW COSTUME AND COMPOSITION STYLE reference (fox), not an identity to copy. Preserve the same white rabbit as image1: white fur #f4f4f4, soft pink inner ears #ffb3c9, small pink nose, two long upright bunny ears FULLY visible, friendly big brown eyes, small front teeth, same original face. Match image2's thick clean dark-purple #1b1430 outlines, soft cel shading, simple chunky cartoon shapes, apparent face width, centered bust crop and polished outfit design.
REMOVE the old neck scarf completely. Give the rabbit a plain bright PINK sports HEADBAND #ff5fa8 across the forehead below the ears, with short ties behind the head, and a thick PADDED PINK protective training VEST #ff5fa8 over a plain violet T-shirt #7b61ff with sleeves visible at both shoulders. Vest uses simple rounded padded panels, WHITE #ffffff edging and simple short center fastenings, same construction as image2. Expression cheerful, confident and determined with friendly smile and slightly focused brows, never angry. Front with slight three-quarter turn, head and shoulders only, ears and full silhouette within square with clear alpha margins. Keep portrait head width similar to the fox while accommodating the long rabbit ears. Target512x512 PNG RGBA, actual transparent background. No scarf, goggles, sword, gloves, props, text, logo, frame, badge, backdrop or ground shadow.
```

## Mechanical export

Bundled Sharp was used for format/export only, with no drawn or synthesized content added: resize to 512 × 512 using `fit: 'contain'` and transparent padding, convert/embed the sRGB profile with `withIccProfile('srgb')`, encode PNG with compression level 9 and adaptive filtering. Alpha was retained. No palette quantization was needed: every final is below 300 kB. Export script is external at `tmp/mc-portraits-a-export.cjs`; diagnostic metadata is `tmp/mc-portraits/a-qa.json`. Original generated files are retained at the source paths listed above.

## Visual QA and freeze

Inspected all four source images and exported finals, including a 256 px per portrait contact sheet on the game's dark purple background (`tmp/mc-portraits/a-preview.png`). Verified recognizable identities, cheerful determined expressions, complete ears and head silhouettes, matching dark outlines and soft cel shading, sports headbands, rounded padded vests, correct sleeve/accent color families, and actual transparent surroundings. Confirmed absence of scarves, goggles, swords, props, text, logos, badges and watermarks. Root additionally reviewed and accepted all four exported portraits visually before publication. The rabbit retains long ears within the canvas; the frog's eye bulges remain clearly unobstructed.

Status: **FROZEN — ready for root to copy into `mecovacka/public/img/chars/0.png` through `3.png`, then commit/push with the full portrait group.**


## Portréty Mečovačky 4–7

Vytvořeno vestavěným OpenAI ImageGen, každá postava samostatným voláním v režimu úpravy vlastní dříve vytvořené ilustrace. Identita a původní tvář pochází z odpovídajícího portrétu TurboKáry `turbokary/public/img/chars/<id>.png`. Druhou referencí byla nová Mečovačka Liška Zrzka (`chars/0.png`) pouze pro kompozici a styl sportovní čelenky/vycpané vesty. Žádné externí obrázky, značky ani převzaté postavy.

Export: mechanické zmenšení celého generovaného obrazu na 512×512 pomocí Windows System.Drawing, HighQualityBicubic a SourceCopy, uložen PNG RGBA s potvrzeným sRGB chunkem. Vygenerovaná alfa zachována. Finály jsou připraveny mimo repo v `tmp/mc-portraits/chars/4.png` až `7.png` pro pozdější přesun do `public/img/chars/`.

QA: jednotlivé zdroje a společný kontaktní náhled vedle referenční Zrzky vizuálně zkontrolovány. Shodný výřez, měkké kreslené stínování, tmavá obrysová linka, zachované identity, barvy čelenek/vest/rukávů podle AGENTS.md; dvě oblé středové přezky. Žádné šátky, brýle, meče ani text. Všechny čtyři soubory přesně 512×512, RGBA, sRGB, rohová alfa 0 a přes 99 tisíc plně průhledných pixelů na obrázek.

| Soubor | Postava | Bajtů |
|---|---|---:|
| `chars/4.png` | Mour | 341600 |
| `chars/5.png` | Huňáč | 345436 |
| `chars/6.png` | Šroubek | 360506 |
| `chars/7.png` | Kvík | 309618 |

### `chars/4.png` — Mour

Zdrojový generovaný soubor: `exec-b43dac6b-70a4-4a17-9371-e73216deb19f.png`.

Role předloh: 1. původní portrét TurboKáry ID 4 = identita a výřez; 2. nový portrét Mečovačky ID 0 = pouze styl kostýmu a série.

Přesný prompt:

```text
Use case: identity-preserve. Edit the first reference image into a Mečovačka foam-sword sport character portrait. Image 1 is the original character identity and composition to preserve. Image 2 is ONLY the costume, linework, padding style, and overall head-and-shoulders framing reference; do not copy Image 2's fox face or species. Preserve the original character's recognizable face, fur/head colors, ears, nose, eyes, apparent head size and cheerful identity. Head-and-shoulders front or very slight three-quarter crop, entire ears visible, portrait fills the square similarly to Image 2. Thick clean dark-plum #1b1430 outlines, softly shaded simple cartoon forms, bright polished cel shading. Remove the original neck scarf completely. Add a plain sports headband across the forehead with short tied tails behind the head, and a thick protective padded training vest over the visible T-shirt sleeves, simple rounded quilted panels and TWO small rounded central fastenings, matching reference 2. Cheerful confident determined friendly smile with slightly focused eyebrows, never angry. No glasses, goggles, scarf, sword, weapons, hands, text, letters, logos, scenery, frame or badge. Genuinely transparent background with clean alpha, no checkerboard or white fill. Final intended asset 512x512 PNG. Character: Mour, friendly gray tomcat with pointed ears, tousled gray forelock, white muzzle and cheeks, pink nose, three whiskers on each side. Exact palette: primary fur/head #8d8d9b, secondary facial color #f0f0f0; headband and padded vest #9b4dff; vest edging and two fastenings #2b2b33; visible short T-shirt sleeves #06d6a0. Preserve face details and all species cues from image 1.
```

### `chars/5.png` — Huňáč

Zdrojový generovaný soubor: `exec-9bc14871-be2f-4afe-83d0-46ff04eea101.png`.

Role předloh: 1. původní portrét TurboKáry ID 5 = identita a výřez; 2. nový portrét Mečovačky ID 0 = pouze styl kostýmu a série.

Přesný prompt:

```text
Use case: identity-preserve. Edit the first reference image into a Mečovačka foam-sword sport character portrait. Image 1 is the original character identity and composition to preserve. Image 2 is ONLY the costume, linework, padding style, and overall head-and-shoulders framing reference; do not copy Image 2's fox face or species. Preserve the original character's recognizable face, fur/head colors, ears, nose, eyes, apparent head size and cheerful identity. Head-and-shoulders front or very slight three-quarter crop, entire ears visible, portrait fills the square similarly to Image 2. Thick clean dark-plum #1b1430 outlines, softly shaded simple cartoon forms, bright polished cel shading. Remove the original neck scarf completely. Add a plain sports headband across the forehead with short tied tails behind the head, and a thick protective padded training vest over the visible T-shirt sleeves, simple rounded quilted panels and TWO small rounded central fastenings, matching reference 2. Cheerful confident determined friendly smile with slightly focused eyebrows, never angry. No glasses, goggles, scarf, sword, weapons, hands, text, letters, logos, scenery, frame or badge. Genuinely transparent background with clean alpha, no checkerboard or white fill. Final intended asset 512x512 PNG. Character: Huňáč, friendly brown bear with round ears, warm tan muzzle and inner ears, dark rounded nose and small furry forelock. Exact palette: primary fur/head #8a5a2b, secondary facial color #d9a46c; headband and padded vest #2f6bff; vest edging and two fastenings #ffd23f; visible short T-shirt sleeves #ef476f. Preserve face details and all species cues from image 1.
```

### `chars/6.png` — Šroubek

Zdrojový generovaný soubor: `exec-a5e8f56f-d7d3-45f7-8e2a-e55c9bfa78c4.png`.

Role předloh: 1. původní portrét TurboKáry ID 6 = identita a výřez; 2. nový portrét Mečovačky ID 0 = pouze styl kostýmu a série.

Přesný prompt:

```text
Use case: identity-preserve. Edit the first reference image into a Mečovačka foam-sword sport character portrait. Image 1 is the original character identity and composition to preserve. Image 2 is ONLY the costume, linework, padding style, and overall head-and-shoulders framing reference; do not copy Image 2's fox face or species. Preserve the original character's recognizable face, fur/head colors, ears, nose, eyes, apparent head size and cheerful identity. Head-and-shoulders front or very slight three-quarter crop, entire ears visible, portrait fills the square similarly to Image 2. Thick clean dark-plum #1b1430 outlines, softly shaded simple cartoon forms, bright polished cel shading. Remove the original neck scarf completely. Add a plain sports headband across the forehead with short tied tails behind the head, and a thick protective padded training vest over the visible T-shirt sleeves, simple rounded quilted panels and TWO small rounded central fastenings, matching reference 2. Cheerful confident determined friendly smile with slightly focused eyebrows, never angry. No glasses, goggles, scarf, sword, weapons, hands, text, letters, logos, scenery, frame or badge. Genuinely transparent background with clean alpha, no checkerboard or white fill. Final intended asset 512x512 PNG. Character: Šroubek, friendly rounded silver robot with a dark face screen, glowing cyan eyes #4fe3ff, circular ear sensors and a cheerful digital smile, retaining the same robot identity. Exact palette: primary fur/head #c3ccd3, secondary facial color #4fe3ff; headband and padded vest #e53935; vest edging and two fastenings #b0bec5; visible short T-shirt sleeves #37474f. Preserve face details and all species cues from image 1. The red cloth sports headband wraps around the upper silver forehead casing, above the dark face screen, never obscuring the cyan eyes. Preserve the rounded silver robot shell, side circular ear sensors and cyan digital smile.
```

### `chars/7.png` — Kvík

Zdrojový generovaný soubor: `exec-d026c739-359a-4b39-ab2d-ad9cf9664422.png`.

Role předloh: 1. původní portrét TurboKáry ID 7 = identita a výřez; 2. nový portrét Mečovačky ID 0 = pouze styl kostýmu a série.

Přesný prompt:

```text
Use case: identity-preserve. Edit the first reference image into a Mečovačka foam-sword sport character portrait. Image 1 is the original character identity and composition to preserve. Image 2 is ONLY the costume, linework, padding style, and overall head-and-shoulders framing reference; do not copy Image 2's fox face or species. Preserve the original character's recognizable face, fur/head colors, ears, nose, eyes, apparent head size and cheerful identity. Head-and-shoulders front or very slight three-quarter crop, entire ears visible, portrait fills the square similarly to Image 2. Thick clean dark-plum #1b1430 outlines, softly shaded simple cartoon forms, bright polished cel shading. Remove the original neck scarf completely. Add a plain sports headband across the forehead with short tied tails behind the head, and a thick protective padded training vest over the visible T-shirt sleeves, simple rounded quilted panels and TWO small rounded central fastenings, matching reference 2. Cheerful confident determined friendly smile with slightly focused eyebrows, never angry. No glasses, goggles, scarf, sword, weapons, hands, text, letters, logos, scenery, frame or badge. Genuinely transparent background with clean alpha, no checkerboard or white fill. Final intended asset 512x512 PNG. Character: Kvík, friendly pink piglet with softly folded ears, a round pink snout with two nostrils, large lively brown eyes and plump cheeks. Exact palette: primary fur/head #ffa7bb, secondary facial color #ff7f9e; headband and padded vest #ffd21f; vest edging and two fastenings #ff6f91; visible short T-shirt sleeves #118ab2. Preserve face details and all species cues from image 1.
```

## Ikony režimů Mečovačky

Tři samostatná generování vestavěným OpenAI ImageGen; nejde o CLI/API fallback. Předlohy jsou vlastní již vytvořené logo Mečovačky a náhledy skutečných herních GLB modelů meče a tréninkového panáka. Logo je pouze referencí barev a kresleného stylu, modelové náhledy pouze referencí tvaru. Žádné externí obrázky, značky, text ani převzaté herní postavy.

Výsledné soubory: `modes/duel.png`, `modes/slice.png`, `modes/train.png`. Export 256×256 RGBA PNG sRGB: mechanické oříznutí prázdného okolí podle alfa > 16/255 s osmipixelovým ochranným lemem, proporční bicubické zmenšení do 230×230 a vystředění na průhledné plátno 256×256. Původní vygenerovaná alfa zachována; bez překreslování motivu. Použito Windows System.Drawing.

Motivy: Souboj — právě dva zkřížené žluté/tyrkysové pěnové meče se zaoblenými bílými konci; Krájení — dvě půlky melounu a výrazná směrová šipka; Trénink — veselý slaměný panák s velkým červenobílým terčem. Vizuální kontrola jednotlivých generovaných motivů a konečného přehledu na tmavě fialovém pozadí, včetně velikosti 48 px.

### `modes/duel.png`

Zdrojový generovaný soubor: `exec-0c18cfac-d3b1-4491-8e02-1eb3351ab3b5.png`.

Reference: `img/logo.png`, `previews/sword.png`.

Přesný prompt:

```text
Use case: stylized-concept. Asset: one compact square game mode icon, DUEL, for original cheerful foam-sword sports game Mečovačka. Image 1 is only the graphic style reference: thick dark plum #1b1430 contour, vivid yellow and turquoise, soft cel shading and clean cream highlights. Do NOT reproduce any text from it. Image 2 is only the safe foam training sword SHAPE reference, not a background or realistic render to copy. Create exactly two crossed friendly FOAM TRAINING SWORDS in a balanced X silhouette: one cylindrical blade golden yellow #ffd21f, the other cylindrical blade turquoise #4fd1ff. Both blades have uniform thick soft round foam sides and big rounded WHITE HEMISPHERICAL TIPS; absolutely no pointed ends, sharp blades, metallic edges or realistic weapons. Short dark-purple ribbed handles and broad rounded soft guards with contrasting yellow/turquoise accents. Simplify their length and detail for instant readability at 48 px. The two white rounded tips occupy upper left and upper right, handles lower left and lower right, crossing in the middle. Cheerful premium cartoon game UI illustration, strong thick #1b1430 outline and a restrained fine cream outer keyline as in the logo, soft simple shading, no tiny details. Center the complete icon in a square with 9% clear padding. Genuine transparent background, no checkerboard, no background color, no panel, no frame, no badge, no text, no lettering, no logos, no sparks, no extra objects. Final intended output 256x256 PNG with alpha.
```

### `modes/slice.png`

Zdrojový generovaný soubor: `exec-e09694d0-3f2c-47ab-835a-ae8f43f65f86.png`.

Reference: `img/logo.png`.

Přesný prompt:

```text
Use case: stylized-concept. Asset: one compact square game MODE icon for original cheerful foam-sword sports game Mečovačka. Primary request: exactly TWO separated halves of one round watermelon, cut faces clearly visible, red #ff4d6d juicy flesh, a few large dark plum seeds, pale cream inner rind and thick green striped outer rind. The two halves tilt slightly apart across a clear diagonal gap. One bold turquoise #4fd1ff curved directional slicing arrow passes diagonally through the gap from upper-left towards lower-right; a single obvious large arrowhead, thick cream highlight and dark outline, still recognizable when the whole icon is 48 px. No knife or sword. No fruit juice splash, droplets or extra fruit. Compact balanced composition with the melon halves and arrow functioning as one simple readable symbol. Reference image is ONLY the thick-outline cheerful cel-shading style and clean cream/yellow/turquoise highlight treatment, never copy its lettering. Style: premium cheerful cartoon UI illustration, very thick clean dark plum #1b1430 outline, restrained fine cream outer keyline matching the logo, simple rounded shapes, soft cel shading, big clear silhouettes, minimal fine detail. Center the complete icon within square with 9% transparent padding, similar scale to a large inventory power-up icon. Genuine transparent background with clean alpha; no checkerboard, no background color, no panel, no frame, no badge, no text, lettering, labels, logo or watermark. Final intended output 256x256 PNG with alpha.
```

### `modes/train.png`

Zdrojový generovaný soubor: `exec-ce6fe2d1-912f-4c4c-be15-768804fef337.png`.

Reference: `img/logo.png`, `previews/fighter-dummy.png`.

Přesný prompt:

```text
Use case: stylized-concept. Asset: one compact square game MODE icon for original cheerful foam-sword sports game Mečovačka. Primary request: a friendly straw practice dummy with a very large round red-and-cream bullseye target centered on its stuffed burlap torso. Compact full dummy, big simple rounded straw head, two simple stitched X eyes and a tiny cheerful stitched curved smile, a few short golden straw tufts. Two short padded straw arms extend out and down in a welcoming stance, a short brown wooden support post below. Warm golden tan #c7a66a body and golden straw, dark brown rope ties, clean target with two thick red #ff4d6d concentric rings and cream center. The target must be the clearest largest detail, instantly legible at 48 px. Cheerful safe sports training mascot, not spooky or injured, no weapons. Image1 is ONLY the thick-outline cheerful graphic style reference with clean cream highlights; do not copy its letters. Image2 is ONLY the actual game's dummy design reference (straw body, stitched face, chest target, wooden support), simplify it into this compact strong icon and do not copy its studio background, text or realistic 3D rendering. Style: premium cheerful cartoon UI illustration, very thick clean dark plum #1b1430 outline, restrained fine cream outer keyline matching the logo, simple rounded shapes, soft cel shading, big clear silhouettes, minimal fine detail. Center the complete icon within square with 9% transparent padding, similar scale to a large inventory power-up icon. Genuine transparent background with clean alpha; no checkerboard, no background color, no panel, no frame, no badge, no text, lettering, labels, logo or watermark. Final intended output 256x256 PNG with alpha.
```


Finální QA: všechny tři soubory přesně 256×256, PNG RGBA, sRGB chunk potvrzen, rohová alfa = 0. Velikosti: duel.png 74 592 B; slice.png 89 223 B; train.png 53 881 B. Kontaktní přehled s náhledy 256 px a skutečnými 48 px: tmp/mc-images/modes-preview.png. Ikony jsou barevně i tvarově rozeznatelné při 48 px; žádný text ani pozadí.

