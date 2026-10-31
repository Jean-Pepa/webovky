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


## Ovládání telefonu

### `pad/shield.png`

Vytvořeno vestavěným OpenAI ImageGen. Původní kreslený návrh podle zadání Mečovačky, bez cizích značek a převzatých motivů.

Zdroj: `exec-af213ecc-cbcf-47a2-912e-c01a1b9139b0.png`. Reference: logo.png (vlastní stylová reference).

Mechanický export sharp: 512×512, Lanczos3 contain, ořez prázdných alfa okrajů, sRGB ICC, PNG komprese 9 bez kvantizace a zachování alfa kanálu.

Přesný prompt:

```text
Use case: stylized-concept. Asset: large GUARD button pictogram for Mečovačka, a friendly cartoon foam-sword game, final512x512 PNG with transparent background. Reference image is ONLY style/color reference, do not include its lettering or sword. Create a single broad rounded protective SHIELD, warm white/light ivory face with a simple cyan #4fd1ff central inset, thick softly rounded silver-white rim, bold dark purple #1b1430 inner outline and a thin luminous ivory outside keyline so it reads on a dark #14123a button. A strong simple silhouette, upper corners rounded, bottom gently tapered and rounded, no sharp spikes. Soft cel shading with restrained pale lilac shadows and one broad clean white highlight. Centered, frontal with slight threequarter depth, icon occupies80percent of square, ample transparent padding. Very legible at64px. Only the shield: no letters, writing, coat of arms, cross, stars, jewels, characters, background tile, badge or groundshadow. Genuine alpha transparency. Cheerful clean polished 2D game illustration consistent with reference.
```

### `pad/hold.png`

Vytvořeno vestavěným OpenAI ImageGen. Původní návodná ilustrace správného držení telefonu; cílenou následnou úpravou byla odstraněna samostatná rukojeť nad telefonem, takže rukojeť tvoří přímo telefon. První výstup: exec-91e35b18-18db-4740-b661-435bab0b8a6a.png.

Zdroj: `exec-7c958e7b-81df-4ed4-a6f7-74754c317f82.png`. Reference: logo.png (vlastní stylová reference).

Mechanický export sharp: 300×400, Lanczos3 contain, ořez prázdných alfa okrajů, sRGB ICC, PNG komprese 9 bez kvantizace a zachování alfa kanálu.

Přesný prompt:

```text
Původní generování:
Use case: stylized-concept. Asset: clear portrait instructional illustration for Mečovačka phone controller, final300x400 PNG with genuinely transparent background. Reference image is ONLY the cartoon linework and cyan/yellow/purple palette reference, do not include text. Show ONE anatomically plausible HUMAN RIGHT HAND holding one smartphone upright in PORTRAIT orientation like the HANDLE of a toy sword. View the phone screen from the front at a slight threequarter angle. Palm supports the BACK of the phone; the four fingers curl securely around the far edge, and the ONE thumb is visibly resting ON THE FRONT TOUCHSCREEN over the lower part of a simple bright shield symbol. Wrist enters from bottom right, clean natural wrist crop. Hand has warm light-peach skin, simplified friendly cartoon anatomy with exactly five fingers total and sensible joints. Phone is a rounded dark-purple #14123a rectangle, thick small rim, dark screen with a single large pale-white/cyan shield pictogram, no writing or numbers. From the phone TOP EDGE, centered along the phone's vertical axis, a soft thick cyan FOAM TRAINING BLADE extends straight upward with a large rounded WHITE safety tip; it reads as an illustrated metaphor for the phone becoming the sword handle, never a sharp metallic weapon. Keep the white rounded tip and complete phone fully visible with safe margins. Composition compact and vertically balanced; white-tipped blade fills the upper third, phone and secure hand grip fill the lower two thirds. Thick clean dark-purple #1b1430 outlines, broad soft cel shading, warm highlights, simple shapes, clean professional explanatory game art. No other hand, no person, no arrows, no text, no logos, no scenery, no background panel, no frame, no cast shadow outside artwork. Transparency around silhouette and fingers.

Cílená úprava spojení čepele:
Use case: precise-object-edit. Edit only the connection above the smartphone in this instructional illustration. The smartphone ITSELF is the sword handle: REMOVE the separate purple ribbed sword handle and the lower gold pommel ring currently floating between the phone and the cyan blade. Bring the cyan foam blade and its small upper yellow guard DOWN so the yellow guard sits directly flush on the phone TOP EDGE and the cyan blade starts immediately above it. There must be NO separate sword grip above the phone. Preserve the single hand exactly as is, all five fingers and thumb on the screen shield, phone shape, dark screen, white rounded safety tip, cyan blade, cartoon shading, dark outlines and genuine transparency. Do not change the hand anatomy or add anything. Keep all intended artwork visible within a portrait frame with margin, no text.
```


## Ikony aplikace a náhled odkazu

Created 2026-10-31 with the built-in OpenAI ImageGen tool. No API/CLI fallback was used.

### Deliverables

| File | Dimensions | Format | Bytes |
|---|---:|---|---:|
| `icon-512.png` | 512 × 512 | Opaque PNG, embedded sRGB profile | 142091 |
| `icon-192.png` | 192 × 192 | Opaque PNG, embedded sRGB profile | 28975 |
| `og.png` | 1200 × 630 | RGBA PNG, embedded sRGB profile, true alpha surroundings | 1025691 |

The app icon consists of two crossed original foam training swords with cyan/orange blades, round white padded safety tips, yellow guards/pommels and purple grips. Its background is the exact opaque color `#14123a` (RGB 20, 18, 58). The 192 px file is mechanically derived from the final 512 px file.

The link preview uses the game's original Mečovačka logo and Zrzka/Kvak identities, a friendly foam-sword duel on a wooden pier with pond reeds and lily pads, and genuine alpha around the compact scene. The logo is the only text; both Czech carons in “Mečovačka” are present.

### References

All references were visually inspected before generation:

1. `mecovacka\public\img\logo.png` — official original project logo, preserve lettering and style.
2. `mecovacka\public\img\chars\0.png` — original Mečovačka Zrzka portrait, face and costume identity.
3. `mecovacka\public\img\chars\1.png` — original Mečovačka Kvak portrait, face and costume identity.
4. `C:\Users\krist\OneDrive\Plocha\CLAUD DATA\tmp\mc3d\previews\arena-lobby.png` — actual project arena render, environment reference only; diagnostic caption excluded.

The icon was generated without external input imagery. Its first output was subsequently used as the target of a background-extraction edit, preserving the sword artwork while producing true alpha for exact opaque background matting at export. No stock artwork or external brand assets were used.

### Sources and exact prompts

### App icon — initial generation

Generated source: `C:\Users\krist\.codex\generated_images\01a1922e-faf2-7f73-a493-a809c570402c\exec-a6b196af-72e9-4dc6-a5a9-419a7f09c146.png`

`transparent_background: false`

```text
Use case: logo-brand.
Asset type: square app icon for the original cheerful Czech foam-sword game Mečovačka.
Primary request: a polished bold symbol of TWO CROSSED FOAM TRAINING SWORDS on a completely opaque, perfectly FLAT solid dark purple #14123a background filling the entire square edge to edge. No rounded-corner tile or outer frame.
Subject: two thick soft cylindrical toy foam blades forming a balanced X, one bright cyan #4fd1ff and one vivid orange #ff7a1a, each with a prominent smooth ROUND WHITE padded safety cap at its upper tip, simple rounded yellow #ffd21f guards, and short dark-purple ribbed handles toward the lower corners. Clearly soft sports equipment, broad blunt rounded ends, no pointed blade and no metal weapon appearance.
Style: cheerful polished cartoon, thick clean dark-purple #1b1430 outlines, soft cel shading, subtle highlights on the foam, chunky simple geometry, memorable silhouette that stays clear at 48px.
Composition: centered symmetrical crossed swords; show both complete handles, both guards, both long foam blades and both white tips, comfortable even safe padding around entire icon, fill about 78 percent of square. Keep the solid flat background uniform with zero gradient, texture, glow or vignette.
Target: 512x512 PNG sRGB, opaque.
No text, letters, logo lettering, characters, extra ornaments, badge, border, backdrop objects, watermark or real brand.
```

### App icon — targeted background extraction

Generated source selected for final export: `C:\Users\krist\.codex\generated_images\01a1922e-faf2-7f73-a493-a809c570402c\exec-0f8aea5f-58d9-4a85-974f-94ce8c1128fe.png`

Input: initial app icon source above, inspected before editing. `transparent_background: true`. This isolated the existing sword artwork; final export then matted its alpha onto the exact requested opaque color.

```text
Use case: background-extraction.
Remove ONLY the solid dark purple background from this original app icon, replacing it with genuine alpha transparency. Preserve the exact two crossed foam swords, cyan and orange cylindrical blades, large white rounded padded tips, yellow guards and pommels, dark-purple grips, dark outline, proportions, position, colors, shading and clean edges. No redesign or movement. Retain all dark outlines around the swords; do not mistake their dark outlines or handle details for background. Only empty background becomes transparent, including the spaces between the crossed swords and handles. One square RGBA cutout of the same artwork, full silhouettes intact with the same margins. No text, shadow backdrop, checkerboard pixels or new elements. This is an intermediate cutout for mechanical export onto the exact solid app background color.
```

### Open Graph illustration

Generated source: `C:\Users\krist\.codex\generated_images\01a1922e-faf2-7f73-a493-a809c570402c\exec-795fbecc-04aa-45b6-85f7-c032afb8e85e.png`

Input references in the order listed above. `transparent_background: true`.

```text
Use case: compositing.
Asset type: horizontal social link preview / open graph illustration for the original cheerful Czech game Mečovačka. Target 1200x630, approximately 1.9:1 aspect ratio.
Input image 1: EXACT OFFICIAL LOGO to preserve, including its original lettering, colors, outlines and foam sword underline. The text is exactly "Mečovačka", letter by letter M-e-č-o-v-a-č-k-a, both lowercase č letters have their carons. This is the only text allowed.
Input image 2: original FOX Zrzka character identity and costume reference; preserve her face, orange fur, cream muzzle, orange headband and padded orange vest, dark navy sleeves.
Input image 3: original FROG Kvak character identity and costume reference; preserve his face, bright green skin, pale yellow-green muzzle, green headband and padded green vest with yellow edging, coral-red sleeves.
Input image 4: ENVIRONMENT REFERENCE ONLY: the actual game's wooden duel pier on a South Bohemian pond, narrow plank deck, rope rails ONLY along the long sides, both short ends fully OPEN with no gates or rails. Ignore the screenshot's diagnostic text and camera framing.
Composition: a beautiful compact cheerful cartoon vignette with the EXACT PROVIDED LOGO prominently centered across the upper third, and an energetic friendly sporting duel below it. Two fully visible recognizable animal fencers, FOX to left and FROG to right, face each other in active balanced playful fencing stances on the wooden pier. Large expressive heads and faces readable at preview size. They wear padded training vests and headbands matching the portrait references, dark trousers and chunky cream/yellow shoes. Each holds ONE thick, visibly SOFT cylindrical foam sword, fox's orange and frog's green, both with big ROUND WHITE safety tips and simple guards; the two soft blades meet in a clear playful crossing above the middle of the pier without hiding faces. No sharp points or metal weapons.
Show the pier in three-quarter slightly elevated view as a narrow horizontal stage with visible warm wooden planks and posts; side rope railings low enough not to cover faces or vests, OPEN short ends left and right. Under and around it a compact turquoise pond water shape with a few ripples, reeds and lily pads, forming a charming self-contained cutout scene. No solid full-canvas sky or background.
Style: same thick clean dark-purple #1b1430 outlines and polished soft cel shading as our character portraits; vivid cheerful orange, green, cyan, warm wood, creamy white. Warm friendly afternoon light. Strong clear silhouette and balanced hierarchy: logo first, two smiling focused fencers second, pier and pond third.
Actual alpha TRANSPARENT surroundings outside the logo and contained pond vignette; full artwork and logo stay safely within canvas with clean margins. Clean crisp professional game artwork, not a screenshot, not a poster panel. Do not add any words, subtitles, badges, annotation, watermark, extra characters or real brands. Preserve correct Czech logo accents and original identities.
```

### Mechanical export

Bundled Sharp performed format export only. The icon cutout was resized to 512 × 512 with contain/transparent padding and matted onto `#14123a`, then converted to/embedded with sRGB and encoded with PNG compression level 9 and adaptive filtering. The 192 × 192 icon was resized from the resulting 512 × 512 PNG. The OG source was resized with contain and transparent padding to exactly 1200 × 630; its alpha was preserved. No drawing, scene compositing or content synthesis was done in code.

Export helper: `tmp/mc-app-export.cjs`. Diagnostic metadata: `tmp/mc-app/qa.json`. All original generated sources are retained at the paths above.

### QA and freeze

Inspected original generations and final exports. The 192 px icon remains readable with both full handles, colored foam blades and large round white ends. Both icons are fully opaque and the top-left background pixel is exactly RGB 20, 18, 58. OG has the correct dimensions, embedded sRGB and 278416 fully transparent pixels; its corner is RGBA (0, 0, 0, 0). Inspected the complete OG over the game's dark purple background via `tmp/mc-app/og-preview.png`: lettering and both accents are clear, original character identities/costumes are recognizable, faces are unobstructed, foam sword tips are blunt white caps, and the wooden pier has rope side railing with open ends. The foreground is drawn open to keep the full fencing poses visible. No added subtitle, diagnostic caption, text or watermark is present.





## Rozcestník — původ a technická kontrola

Projektové cesty: `turbokary/public/img/hub/kary.png`, `mece.png`, `bg.jpg`.

Vytvořeno vestavěným ImageGen podle imagegen/SKILL.md; tři samostatné ilustrace, u Mečovačky dvě cílené úpravy (doplnění blízkého bočního zábradlí, odstranění nechtěného horního oparu). Bez API/CLI fallbacku. Vlastní původní postavy, materiály a prostředí projektu; žádné převzaté značky ani postavy. Datum 31. 10. 2026.

### Reference pro identitu a styl

Všechny před generováním vizuálně prohlédnuty:
- 1. `turbokary\public\img\chars\0.png`
- 2. `turbokary\public\img\chars\1.png`
- 3. `C:\Users\krist\OneDrive\Plocha\CLAUD DATA\tmp\tk3d\previews\gallery.png`
- 4. `mecovacka\public\img\chars\0.png`
- 5. `mecovacka\public\img\chars\1.png`
- 6. `C:\Users\krist\OneDrive\Plocha\CLAUD DATA\tmp\mc3d\previews\arena-lobby.png`

První dva portréty určují tváře a oblečení pro kartu TurboKár, galerie GLB pouze tvary a barvy motokár (žádné její popisky). Další dva portréty určují šermířský úbor. Skutečný render arény určuje molo, boční provazové zábradlí, rybník a krajinu.

### Přesné prompty

### kary.png

```text
Use case: illustration-story. Create a NEW polished game-selection card illustration, widescreen 16:9, intended final PNG 960×540 with genuinely TRANSPARENT outer background. Reference image 1 defines our original cheerful orange fox Zrzka, cream cheeks and ear interiors, navy shirt and orange neckerchief. Reference image 2 defines our original bright green frog Kvak, cream muzzle, red shirt and green neckerchief. Reference image 3 is ONLY the visual design reference for their orange/cream and green/yellow open racing karts: chunky four black tires, low broad nose, small steering wheel, rear wing, no branding. Do not copy the gallery layout or any text. Scene: these TWO friends racing their matching karts through a sweeping countryside bend, energetic three-quarter front view with one kart ahead and the second close behind, steering into the curve. Both faces visible and distinct, delighted competitive expressions, hands correctly gripping their own steering wheels. A compact curved strip of gray race road with red-and-white curbing, green meadow tufts and a few stylized motion dust puffs forms a scenic vignette under the karts. The road fragment and vegetation have a clean organically cut outer silhouette and all surrounding canvas is real transparent alpha. Composition: wide coherent single scene filling about 94% of width and 88% of height, readable at thumbnail size, both vehicles entirely in frame, strong depth and attractive diagonal action; leave slim clear transparent breathing room all around. Style: high quality friendly cartoon with subtle low-poly faceting, thick clean dark purple #1b1430 contour lines, soft warm shading, bright orange #ff7a1a, green #3ccf4e, cream/yellow accents. No enclosing rectangle, no border/frame, no opaque backdrop, no white halo, no lettering, no numbers, no logos, no UI, no watermark, no additional characters. Preserve original character identities from the references.
```

Generovaný zdroj: `C:\Users\krist\.codex\generated_images\01a1922f-3d1b-7c62-abfa-698fd23900fc\exec-59e0bf53-e875-4220-a42e-167abc126c3d.png`.

### mece.png — základní generování

```text
Use case: illustration-story. Create a NEW polished game-selection card illustration, wide 16:9 landscape, intended final PNG 960×540 with genuinely TRANSPARENT outer background. Reference 1 defines our original orange fox Zrzka wearing orange headband and orange padded fencing vest with cream trim over navy sleeves. Reference 2 defines our original green frog Kvak wearing green headband and green padded vest with pale yellow trim over coral-red sleeves. Preserve their friendly expressive faces and character identities. Reference 3 is environment reference ONLY: a narrow warm wooden pier over a turquoise South Bohemian pond, timber pilings, two horizontal rope rails along the TWO LONG SIDES, BOTH SHORT ENDS OPEN with no barriers, little reeds/lily pads and green countryside. Do not copy any screenshot labels or UI. Scene: exactly TWO full-body animal fencers, fox and frog, smiling with enthusiastic concentration as they playfully meet/cross their thick brightly colored FOAM TRAINING SWORDS above the center of the pier. Fox uses an orange foam sword, frog green foam sword; both swords have very obvious large rounded WHITE soft blunt tips and chunky simple guards. Correct hands grasping handles, clear silhouettes and faces, dynamic but friendly balanced poses, dark pants and pale accent boots. Use three-quarter eye-level view showing both characters side-on facing one another, the pier deck and a small broad patch of turquoise pond water beneath, with restrained reeds and a few illustrated splashes at the low edges. No real blades, no sharp metal points, no injuries. Composition: one compact wide scenic vignette with clean organically cut outer silhouette, real transparent alpha everywhere outside the pier/pond scene. Fill about 94% canvas width and 88% height, all heads, sword tips and feet safely inside with slim transparent breathing room. Style: polished cheerful cartoon illustration with subtle low-poly faceting, thick clean #1b1430 outlines, soft sunny warm shading, orange #ff7a1a, green #3ccf4e, turquoise #4fd1ff and cream accents. No surrounding rectangle, no frame, no opaque sky/background panel, no text, no labels, no logo, no UI, no watermark, no additional characters. Rope rails stay on long sides only and must not cross either open end or obscure the central sword action.
```

Základní zdroj: `C:\Users\krist\.codex\generated_images\01a1922f-3d1b-7c62-abfa-698fd23900fc\exec-bb78500c-b380-4b66-8729-f21460643944.png`.

Cílená úprava zábradlí:

```text
Use case: precise-object-edit. Edit only the near/front long-side railing of this transparent illustration. Preserve EXACTLY the fox, frog, both foam swords with rounded white tips, their poses, faces, clothing, pier deck shape, water, plants, composition, colors, style and real transparent outer background. Add the missing near/front long-side rope railing so this wooden fighting pier has two complete side railings, one on each LONG edge, matching the existing far-side railing: modest wooden posts and two gently sagging horizontal natural tan ropes. Use the visible solitary front-right post as part of this near railing, add the necessary matching near-left/intermediate posts along the LONG near edge. The rail should remain low enough to keep both faces, arms and crossed swords unobstructed. Leave BOTH SHORT ENDS COMPLETELY OPEN with no rope across them. Do not put a rope barrier across the short right or left end. Preserve wide compact scene and transparent margins. No text, no frame, no opaque background.
```

Mezivýsledek: `C:\Users\krist\.codex\generated_images\01a1922f-3d1b-7c62-abfa-698fd23900fc\exec-b159006a-be16-40d7-869b-f3ead0c53950.png`.

Cílená oprava průhledného okolí:

```text
Use case: background-extraction / precise-object-edit. Correct only the unwanted gray-green cloudy backdrop in the UPPER CENTER of this PNG. Remove that large gray-green haze/blob behind and between the fox, crossed swords and frog, restoring TRUE TRANSPARENT ALPHA in all empty upper-background space above the low distant green bank. Keep every actual illustration element EXACTLY: both characters, both foam swords, the completed foreground and background rope railings, posts, deck, pond water, plants, low green distant bank, proportions, colors and outlines. The empty space around and between the character silhouettes and swords must be clean transparent, not gray, black, white, checkerboard or painted haze. Preserve the compact full scenic vignette and transparent outside edges. Do not add or redraw any content, no text, no frame.
```

Použitý finální zdroj: `C:\Users\krist\.codex\generated_images\01a1922f-3d1b-7c62-abfa-698fd23900fc\exec-27c0989f-8ed7-4e12-966e-2003516ba24c.png`.

### bg.jpg

```text
Use case: stylized-concept. Create an opaque seamless-looking full-bleed background illustration for a friendly browser-game selection page, widescreen 16:9, intended final JPEG 1920×1080. A quiet South Bohemian countryside pond at violet twilight: smooth calm water with very restrained broad reflections, distant softly layered forested hills and fields, a few reeds and low foliage placed only near the far lower corners. No people or animals, no vehicles, no buildings as focal points, no text, no logos, no stars or bright sun/moon disk. Style: tasteful softly painted cartoon landscape with gentle low-poly-inspired facets, compatible with playful animal games but MUCH calmer and lower contrast than foreground cards. Composition must keep the large middle 65% of the canvas smooth, uncluttered and dim, with a low, distant horizon and no salient object in center. Deep midnight-purple #14123a corners and edges gradually soften into muted violet/blue/teal center; subtle dusk warmth near remote horizon, restrained saturation, no sharp bright highlights. Strong natural dark edge vignette for clear colorful game-card readability. Elegant atmosphere, quiet depth, no border or frame, no transparency.
```

Generovaný zdroj: `C:\Users\krist\.codex\generated_images\01a1922f-3d1b-7c62-abfa-698fd23900fc\exec-52b23227-02d2-42fa-b891-39323ceaa4ec.png`.

### Mechanický export

Sharp: oba PNG zdroje rovnoměrně zmenšeny do 936×516 metodou contain, bez deformace; přidán průhledný okraj 12 px na každé straně pro finálních 960×540. Zachována generovaná alfa, bez odstraňování pozadí nebo kreslení skriptem. PNG bezeztrátově, komprese 9. Pozadí přepočteno na 1920×1080 metodou cover, JPEG quality 85 (mozjpeg), bez alfa. Všechny finály převedeny na sRGB a obsahují explicitní 480bajtový ICC profil sRGB. Originály ponechány v generated_images.

| Soubor | Rozměry | Velikost B | Skutečné alfa okolí | Průhledné pixely | ICC sRGB |
|---|---|---:|---|---:|---|
| kary.png | 960×540 | 611572 | ano; všechny rohy alfa 0 | 219002 | ano, 480 B |
| mece.png | 960×540 | 670812 | ano; všechny rohy alfa 0 | 212371 | ano, 480 B |
| bg.jpg | 1920×1080 | 97774 | neprůhledné JPEG | 0 | ano, 480 B |

Vizuálně ověřeny tváře a identita lišky/žabáka, správné úbory, motokáry v zatáčce, dva pěnové meče s bílými tupými špičkami, oba boční provazové pásy mola, absence textu a rámů. Ve finálních kartách zůstává průhledný odstup od hran; postavy ani špičky nejsou uříznuty. Pozadí je klidné, bez postav a s tmavými okraji. Kompozitní kontrola obou karet na výsledném pozadí: `CLAUD DATA/tmp/mc-hub/preview.png`. Strojové hodnoty: `CLAUD DATA/tmp/mc-hub/qa.json`.

## Návrhy PC lobby a herního HUD

Created 2026-10-31 with the built-in OpenAI ImageGen tool, one separate call for each design. No API or CLI fallback was used. These are visual design proposals for implementation, not screenshots of changes already applied to the game.

Projektové cesty: `mecovacka/public/img/design/lobby.png` and `mecovacka/public/img/design/hud.png`.

### Read-only implementation review

The proposal was grounded in `mecovacka/AGENTS.md` and the current `src/game/screens.ts`, `hud.ts`, `duel-mode.ts`, `main.ts` and `src/shared/protocol.ts`.

Supported elements reflected in the lobby: joining by QR / four-character room code; one player and computer opponent; Souboj, Krájení and Trénink modes; computer difficulty (Pohodový / Rytířský / Mistrovský), match length of one, two or three wins, START, sound and fullscreen. The shown state uses Souboj, Rytířský and “na 2 vítězná”. The QR area is intentionally a clear nonfunctional placeholder labeled “UKÁZKA”, with only three broad finder-square shapes and no encoded data. The room code is four dashes, and no real address or code appears.

Supported HUD elements: player portraits/names at left/right, computer subtitle, round-win dots, round number, 60-second timer shown as “1:00”, and a small guard/calibration-related prompt. No health, stamina, XP, inventory or unsupported game system is proposed. Zrzka and Frak provide the requested orange/cyan foam sword colors. The screenshot's behind-player camera and arena layout ground the scene.

Typography is a raster visual approximation of the project's Lilita One / Baloo 2 treatment; implementation should use the real existing font files. The source review does not imply that these proposed layouts were implemented.

### References

All image inputs were visually inspected before use. References are the project's own original logo/portraits and actual local game captures.

### Lobby input order

1. `mecovacka\public\img\logo.png` — official Mečovačka logo and exact Czech lettering.
2. `mecovacka\public\img\chars\0.png` — Zrzka identity and outfit.
3. `mecovacka\public\img\chars\2.png` — Frak identity and outfit.
4. `C:\Users\krist\OneDrive\Plocha\CLAUD DATA\tmp\mc3d\game\fighters-lobby.png` — actual lobby; supported feature set only, old QR/debug details excluded.
5. `C:\Users\krist\OneDrive\Plocha\CLAUD DATA\tmp\mc3d\game\arena-scene.png` — actual arena environment: pier, pond, wooded shore.

### HUD input order

1. `C:\Users\krist\OneDrive\Plocha\CLAUD DATA\tmp\mc3d\game\fighters-mode-0.png` — actual behind-fighter view, arena and camera layout; old HUD removed.
2. `mecovacka\public\img\chars\0.png` — Zrzka identity and outfit.
3. `mecovacka\public\img\chars\2.png` — Frak identity and outfit.
4. `C:\Users\krist\.codex\generated_images\01a1922e-faf2-7f73-a493-a809c570402c\exec-d8481cb8-144c-4681-9707-9c8fd2996fd8.png` — new lobby proposal for matching interface styling only.

### Exact generation prompts

### lobby.png

Generated source: `C:\Users\krist\.codex\generated_images\01a1922e-faf2-7f73-a493-a809c570402c\exec-d8481cb8-144c-4681-9707-9c8fd2996fd8.png`

`transparent_background: true`

```text
Use case: ui-mockup.
Asset type: polished PC lobby visual design proposal for the original Czech foam-sword game Mečovačka, full-screen interface canvas 1920x1080 (16:9).
Reference image 1 is the EXACT official logo, preserving its typography, both Czech č accents, yellow/cyan colors and foam-sword underline. Image 2 is the original fox Zrzka portrait. Image 3 is the original penguin Frak portrait. Image 4 is the ACTUAL current lobby, reference for supported features only, NOT for its old typography, temporary network/debug warnings, URLs or real QR content. Image 5 is the actual low-poly pond arena, environment reference.
Design a refined inviting game menu with clean information hierarchy, large readable controls, rounded dark-purple #14123a cards, warm yellow #ffd21f primary action, cyan #4fd1ff accents, white text, soft subtle depth, generous spacing, thick clean #1b1430 outlines for illustrated assets. Typography visually matching Lilita One for headings and Baloo 2 for UI labels. Bright afternoon low-poly pond and long narrow wooden pier visible behind the interface, preserving the game's wooded shore, water, side rope railings and open short ends.
Layout: official logo prominent across the upper left/center; small supporting exact text "Mečem je tvůj telefon". Main content is an elegantly organized wide dark translucent panel. Left column is joining: heading "Připoj telefon", a large white square NONFUNCTIONAL QR PLACEHOLDER with only three broad corner finder squares and an otherwise sparse empty center bearing the clear bold word "UKÁZKA"; do NOT make a real scannable QR and do NOT copy any QR from reference. Below it exact label "KÓD: — — — —". No real link or address anywhere.
Right area has TWO equal player cards: first uses the exact fox portrait with name "Zrzka", small status "Hráč 1"; second uses the exact penguin portrait with name "Frak", small status "Počítač". Under the cards is a single horizontal row of THREE large mode buttons with clear simple icons and exactly these labels: "Souboj" (selected, crossed colorful FOAM swords with white round tips), "Krájení" (split watermelon and small arrow), "Trénink" (straw dummy with target).
Below modes, compact setup controls: header "Počítač" above a minus button, value "Rytířský", and plus button; header "Zápas" above minus button, value "na 2 vítězná", and plus button. To the right a large cheerful yellow primary button reading only "START" with a simple play triangle.
A quiet small footer can contain just "Zvuk" with speaker symbol and "Celá obrazovka" with expand symbol. No extra menu features.
All Czech text must be exactly spelled as quoted, clean and large, real typography, no invented microtext. Only the described controls; no health bars, XP, shop, rewards, matchmaking or other unsupported features.
This is the full UI itself, no monitor, laptop, console, phone or browser chrome; no photo of a device, no perspective on the UI panel. A complete opaque fullscreen UI design INSIDE a softly rounded rectangle almost filling the canvas, with only a tiny 8–12 px genuinely ALPHA TRANSPARENT outside margin and rounded outer corners. Do not make the actual interface content transparent or cut out individual controls. Keep all content safely within the rectangle. No watermark or additional text.
```

### hud.png

Generated source: `C:\Users\krist\.codex\generated_images\01a1922e-faf2-7f73-a493-a809c570402c\exec-ba764cc5-24af-4f9a-a52e-1d2eacef7374.png`

`transparent_background: true`

```text
Use case: ui-mockup.
Asset type: in-match PC HUD design for the original Czech foam-sword game Mečovačka, fullscreen 1920x1080 (16:9). This is the game's interface itself, not a device photograph.
Image 1 is the ACTUAL behind-the-fighter game screenshot, authoritative for camera angle and arena layout. Preserve the long narrow wooden pier viewed along its length, rope rails on both long sides, open far end, pond around it, green wooded shore and boats. Preserve third-person behind-player camera at slightly elevated head level. Remove the old HUD and mouse prompt.
Image 2 is the original FOX Zrzka portrait, identity/costume reference for the local player. Image 3 is original PENGUIN Frak portrait, identity/costume reference for the opponent. Image 4 is the new approved LOBBY VISUAL STYLE, reference only for crisp purple panels, friendly round typography, yellow/cyan accents and portrait presentation; do not copy the lobby layout, logo or mode controls into gameplay.
Scene: actual gameplay-style low-poly 3D view, NOT a flat cartoon battle illustration and NOT a side-on spectator view. The near FOX wears orange headband and padded vest with dark navy sleeves, seen from behind in the lower foreground, slightly semi-transparent just like the game screenshot so the opponent and blade remain visible. The PENGUIN opponent stands farther along the same narrow pier, facing the player, with cyan blue headband and padded vest, white face and golden-yellow sleeves. Each has one thick rounded FOAM sword: fox ORANGE, penguin CYAN BLUE, both with conspicuous WHITE ROUND PADDED CAPS, simple rounded guards and short grips. Blades visible diagonally in the middle without covering opponent's face. Friendly sporting stance, no metallic weapon, sharp points or violence. Warm sunny pond lighting and clear stylized low-poly geometry. Keep foreground body and swords in lower half so the opponent and pier are readable. A couple of small spectator boats beside the pier may remain from the scene.
HUD only: at TOP LEFT, compact dark-purple #14123a rounded panel with the exact fox portrait in a small circle, name "Zrzka", and TWO small empty outlined circular round-win pips. At TOP RIGHT, a matching panel with the exact penguin portrait, name "Frak", small subtitle "Počítač", and TWO small empty outlined circular round-win pips. These are round points, never health bars or meters. Compact center-top timer pill: small heading "Kolo 1" above large "1:00" (sixty seconds). White letters, warm yellow timer digits, subtle cyan/orange outlines. Heading letterforms visually match Lilita One and supporting text Baloo 2. Generous safe padding at top and sides. Keep the center of the view unobstructed.
At bottom center ONLY a discreet slim rounded prompt chip with a small shield symbol and exact short text "Podrž KRYT". No progress bar. No other words.
Do not show health, stamina, XP bars, inventory, skill buttons, joystick, crosshair, huge score numerals, victory banners, debug text, logo, lobby controls, fake console buttons, phones or browser chrome.
The complete fullscreen scene and HUD are inside an almost full-canvas subtly rounded rectangle with ONLY a tiny 8–12 px true alpha-transparent outer margin and rounded outer corners. The main scene itself is opaque. Crisp professional game UI proposal, clean consistent spacing, no watermark. Only the exact quoted Czech labels.
```

### Mechanical export and QA

Both generated sources are 1672 × 941 PNG. Bundled Sharp performs a mechanical contain resize to 1904 × 1064 with transparent padding, followed by an 8 px transparent extension on each side to reach exactly 1920 × 1080. This retains the complete UI and provides the requested thin true-alpha outer margin. Existing generated alpha, including the HUD's rounded corners, is retained. The export embeds/converts to sRGB and encodes PNG with compression level 9 and adaptive filtering. No text, icons or scene content was drawn or patched in code.

External export helper: `tmp/mc-design-pc-export.cjs`; technical QA: `tmp/mc-design/pc-qa.json`. Original source images remain at the paths listed above. The 960 × 540 preview PNGs in the staging directory are QA aids only.

| Final | Dimensions | Bytes | Fully transparent pixels | Alpha at all corners |
|---|---:|---:|---:|---|
| `lobby.png` | 1920 × 1080 | 2743844 | 61576 | 0 |
| `hud.png` | 1920 × 1080 | 2734350 | 61667 | 0 |

Both finals are RGBA PNG with embedded sRGB profiles. Inspected source generations and the resized final previews. Checked exact logo carons and Czech labels, clear nonfunctional joining placeholder, readable control hierarchy, recognizable portraits and color families. HUD check: behind-Zrzka view along the pier, Frak visible ahead, orange/cyan foam swords with rounded white ends, side rope rails, open far end, two empty round-win dots per player, “Kolo 1”, “1:00”, and “Podrž KRYT”. No health bars, browser chrome, monitor/device frame, debug/console details, or extraneous controls. The middle view remains uncluttered.

## Návrhy telefonního ovládání

Datum: 2026-10-31. Autor: Codex za pomoci vestavěného OpenAI ImageGen. Každý návrh a každá následná úprava byly samostatným voláním ImageGen; všude `transparent_background: true`. Bez API/CLI fallbacku, bez externích stažených obrázků.

### Finální zmrazené soubory

| Soubor ve stagingu | Projektový soubor | Rozměry / formát | Bytes | SHA-256 |
|---|---|---|---:|---|
| `tmp/mc-design/pad-lobby.png` | `mecovacka/public/img/design/pad-lobby.png` | 780×1688, PNG RGBA 8 bit, sRGB | 2162517 | `DCCCC05537D628023102FB5106713D6D0DF9B77FAABEED76B55CE9B0F69D0477` |
| `tmp/mc-design/pad-game.png` | `mecovacka/public/img/design/pad-game.png` | 780×1688, PNG RGBA 8 bit, sRGB | 2086406 | `4DD4E374ACDCDC18CF5EA17AD720BB23479C88A562A6FF51BD577B40FB6A4B9A` |

Staging root: `C:\Users\krist\OneDrive\Plocha\CLAUD DATA\tmp\mc-design`.
Soubory jsou návrhy rozvržení a vzhledu pro Claude; nejde o implementaci funkčních ovladačů.

### Původ a reference

Přečteny read-only `mecovacka/AGENTS.md`, `mecovacka/src/pad/main.ts`, `mecovacka/pad.html`, `mecovacka/src/styles/pad.css` a definice herních režimů/obtížností. Lobby odpovídá stavu hostitele: jméno, spojení, stav gyroskopu, 8 postav, dominantní ruka, vibrace, Souboj/Krájení/Trénink, počítač a počet vítězných kol, START. Herní návrh předpokládá funkční gyroskop: Vyrovnat, skóre kola, pauza hostitele a jediný velký přidržovaný KRYT; žádný útočný/jump/joystick ovladač nebyl přidán. Jméno/portrét a stav spojení jsou přidány do návrhu dle zadání; tato data již hra má. `Pepa` je ukázkové jméno.

Všechny vstupní ilustrace jsou již vytvořené vlastní assety projektu:
- `mecovacka/public/img/logo.png`: originální logo Mečovačky.
- `mecovacka/public/img/chars/0.png` až `7.png`: vlastní finální postavy Zrzka, Kvak, Frak, Hop, Mour, Huňáč, Šroubek, Kvík.
- `tmp/mc-design/phone-portraits-reference.png`: mechanický kontaktní přehled uvedených osmi portrétů, vytvořený jen jako reference pro ImageGen.
- `tmp/mc-images/pad/shield.png`: vlastní finální kulatý štít, jako ilustrace jediného herního tlačítka.
- Již vygenerovaná lobby byla referencí vizuální konzistence hry; finální herní panel byl později referencí neprůhledné podkladové karty lobby.

Vstupy byly před použitím vizuálně prohlédnuty. Není použit cizí brand, stock ilustrace ani licencovaný fontový soubor; typografie je rastrová interpretace stylu Lilita One/Baloo 2.

### Export a kontrola

Vestavěný ImageGen uložil originály do uživatelského adresáře generated_images. Vybrané finální zdroje obou obrazovek mají 853×1844. Byly celé, bez ořezu či další obsahové úpravy, přepočteny na přesných 780×1688 pomocí System.Drawing, HighQualityBicubic/HighQuality/SourceCopy, do Format32bppArgb. Alfa kanál byl zachován. PNG export obsahuje sRGB a gAMA chunky. Zachovány skutečně průhledné vnější okraje a zaoblené rohy; obě levé horní rohové hodnoty alfa jsou 0.

Export: `tmp/mc-design/export-phone.ps1`. Metadata a hashe: `tmp/mc-design/phone-qa.json`.
Kontaktní kontrola při přesném zobrazení 390×844 na kontrastním podkladu: `tmp/mc-design/phone-preview.png`.
Vizuálně ověřeny všechny názvy, česká diakritika, správné pořadí 8 postav a čitelnost základních ovladačů. Nejsou přidány okolní telefony, ruce ani hardwarové rámy. První návrh hry byl nástrojem znovu rozvržen na správný vysoký poměr stran. První lobby měla průhledné plochy uvnitř; vybraný finální průchod dostal souvislý neprůhledný fialový panel a prošel kontrolou na světlém podkladu.

### Přesná volání a prompty

### Lobby — první návrh

Režim: vestavěný ImageGen, `transparent_background: true`.

Vstupní cesty:
- `mecovacka\public\img\logo.png`
- `C:\Users\krist\OneDrive\Plocha\CLAUD DATA\tmp\mc-design\phone-portraits-reference.png`

Výstupní originál: `C:\Users\krist\.codex\generated_images\01a1922f-1647-7ba3-b7cf-ddb0fa6306df\exec-ce341c87-2502-46d3-a551-3bd7a9ade741.png`.

```text
Use case: ui-mockup. Create a finished DIRECT PIXEL UI DESIGN for a Czech mobile web controller lobby for the original cheerful foam-sword game Mečovačka. Exact target canvas 780 wide × 1688 high, portrait aspect 390:844. This is the UI itself, NOT a photographed phone, NO hardware, NO bezel, NO perspective, NO hands, NO device status bar. One complete rounded dark-purple #14123a screen panel nearly fills the canvas; only a tiny 6px outer margin and softly rounded corner cutouts are genuinely transparent. All UI remains opaque and fully visible. Reference 1 is the real Mečovačka logo: reproduce its original correct lettering Mečovačka at the top. Reference 2 is the actual ordered eight-character roster: preserve species, faces, costumes and colors, use those portraits in a four-column by two-row selector; do not copy the reference sheet layout beyond the portraits. Polished, implementable game UI with simple rounded cards, thick clean dark-plum outlines, subtle soft shadows, restrained cyan #4fd1ff accents, golden yellow #ffd21f selected states and primary button. Typography looks like Lilita One for chunky headings and Baloo 2 for rounded readable labels. Legible clean Czech text, exact diacritics, all labels at least 28px at this 780px canvas. No invented features, no shop, currency, health bars, chat, tabs, bottom nav or joystick.

Layout top to bottom, everything fits without scrolling in this single view, with sensible spacing and 32px horizontal content padding:
1. Compact centered existing logo, about 110px high, at the top.
2. Player identity card: fox portrait at left; right label exactly "Tvoje jméno", a clear name input containing "Pepa", then a tiny green connected dot and text "Připojeno · Hráč 1". This is the HOST lobby.
3. Thin calm cyan status strip: check icon and exact text "Meč sleduje telefon". Below it, a short instruction line "Drž telefon na výšku.".
4. Heading exactly "Vyber si šermíře". Eight compact portrait cards in a precise 4×2 grid, with one short name each. Top row in order: fox "Zrzka", frog "Kvak", penguin "Frak", rabbit "Hop". Bottom row: gray cat "Mour", brown bear "Huňáč", silver robot "Šroubek", pink pig "Kvík". The fox card is selected with a yellow outline and small checkmark. Portraits around 110px high, no extra trait descriptions.
5. One clear control row: segmented buttons "Pravák" (selected yellow) and "Levák"; alongside them a switch ON labeled "Vibrace". No third handedness option.
6. Host section with three mode tabs in one row: "Souboj" selected, "Krájení", "Trénink". Small section label "Hra". Keep these as simple clear text tabs.
7. Compact opponent line exactly "Soupeř: počítač". One stepper row labeled "Počítač", with left chevron, value "Pohodový", right chevron. Another stepper row labeled "Zápas", with left chevron, value "na 2 vítězná", right chevron. Both are genuine settings already in the game.
8. Large full-width raised golden yellow button at the bottom reading exactly "START", about 110px high. Leave small safe-area spacing below. No additional action buttons.

Use only the quoted UI text plus the supplied logo. No lorem ipsum, no extra descriptions, no duplicate words, no explanatory annotations, no numeric layout labels. Ensure every label remains inside its control and no content is cropped.
```

### Hra — první návrh

Režim: vestavěný ImageGen, `transparent_background: true`.

Vstupní cesty:
- `C:\Users\krist\.codex\generated_images\01a1922f-1647-7ba3-b7cf-ddb0fa6306df\exec-ce341c87-2502-46d3-a551-3bd7a9ade741.png`
- `mecovacka\public\img\logo.png`
- `mecovacka\public\img\chars\0.png`
- `C:\Users\krist\OneDrive\Plocha\CLAUD DATA\tmp\mc-images\pad\shield.png`

Výstupní originál: `C:\Users\krist\.codex\generated_images\01a1922f-1647-7ba3-b7cf-ddb0fa6306df\exec-31ff1069-349b-45f9-8252-7a693c589d6b.png`.

```text
Use case: ui-mockup. Create a finished DIRECT PIXEL UI DESIGN for the active play screen of the original Czech mobile foam-sword controller game Mečovačka. Exact target canvas 780 wide × 1688 high, portrait aspect 390:844. This is the interface itself, NOT a phone photograph, NO hardware, NO bezel, NO perspective, NO hands, NO device status bar. One complete rounded dark-purple #14123a UI panel nearly fills the canvas; only a tiny 6px outer margin and softly rounded corner cutouts are genuinely transparent. Everything inside the panel is opaque. Reference 1 is the already approved lobby screen: match its exact polished visual language, rounded raised controls, plum borders, cyan highlights, golden-yellow primary controls, typography like Lilita One and Baloo 2, soft restrained shadows. Reference 2 is the real existing logo with correct lettering Mečovačka. Reference 3 is the selected fox character portrait, preserve her orange padded vest and headband, happy determined face. Reference 4 is the actual shield icon: use its broad friendly rounded white/cream shield with cyan interior and dark-plum outline, as the KRYT symbol.

Design a clean IMPLEMENTABLE host gameplay screen assuming working phone motion sensors. This is a thumb-friendly game controller, not a conventional action game HUD. No attack buttons, no jump, no dodge, no weapon selector, no joystick, no directional arrows, no inventory, no currency, no health meter, no timer, no tabs, no bottom navigation. The only gameplay button is ONE giant HOLD control labelled KRYT. The only additional utility controls are Vyrovnat and pause. All visible Czech text must be precisely as quoted below with correct diacritics, highly readable, at least 30px at this 780px canvas.

Layout top to bottom:
1. Compact real Mečovačka logo centered at top, about 95px high. Retain its lettering.
2. Short player identity strip, fox portrait on left around 95px tall, large name "Pepa", a green connected status dot and label "Připojeno" on the right. Do not show name editing.
3. Top utility bar: left rounded button with small circular-arrow symbol and exact label "Vyrovnat"; center scoreboard with small "Kolo 1" above a large "0 : 0"; right compact rounded pause button showing only the standard two-bar pause symbol. Do not spell Pause.
4. Quiet narrow cyan-tinted status strip with a small checkmark and exact text "Meč sleduje telefon". Below, on dark purple, one short gentle instruction "Pohyb telefonu řídí meč."
5. A single enormous rounded rectangular cyan HOLD BUTTON occupies most of the lower half to lower two-thirds of the screen, around 700px wide and 790px high, with a clean thick plum border, subtly dimensional edge, and generous empty touch area. Use the provided actual shield icon prominently centered in its upper-middle; below it very large dark-plum bold exact text "KRYT", then smaller dark-plum exact helper text "drž palcem". This button is one uninterrupted touch target. No circular button on top of another button. Show the idle, ready-to-hold state, not a finger or a hand.
6. Beneath this giant button, leave a short calm footer/safe area with one small subtle green check badge and exact text "Vyrovnáno". No second button and no other text.

Use the hierarchy and spacing to communicate: player connected; utility controls at top; one big comfortable shield hold target below. Keep the complete interface comfortably inside the canvas, no cropped controls. Do not copy the lobby character grid or lobby START/settings into this screen. No extra annotations, no explanatory text outside the UI. Genuine transparent tiny outer margins/corners, never a checkerboard background drawn into the image.
```

### Hra — úprava poměru stran

Režim: vestavěný ImageGen, `transparent_background: true`.

Vstupní cesty:
- `C:\Users\krist\.codex\generated_images\01a1922f-1647-7ba3-b7cf-ddb0fa6306df\exec-31ff1069-349b-45f9-8252-7a693c589d6b.png`

Výstupní originál: `C:\Users\krist\.codex\generated_images\01a1922f-1647-7ba3-b7cf-ddb0fa6306df\exec-6edb3190-40eb-4119-ad9c-aa1bfa557409.png`.

```text
Edit this supplied Mečovačka gameplay UI to the REQUIRED MUCH TALLER PHONE CANVAS: exactly 780 pixels wide by 1688 pixels tall, width:height = 390:844 = 0.4621, height is 2.1641 times the width. The supplied design is too broad. Reflow the layout into this tall narrow aspect without squashing or stretching the lettering, portrait, shield, or logo. This is a complete pixel UI, no phone device. Preserve the entire excellent design, exact Czech wording and spelling, and all same controls. Keep dark-purple #14123a, cyan #4fd1ff and yellow #ffd21f, rounded Lilita One/Baloo 2 style. Only transparent tiny outer margin and rounded outside corner cutouts, otherwise all opaque. Target full 780×1688 canvas.

Specific tall layout:
Top logo about 95px high.
Player card around 150px high, fox portrait on left, "Pepa" and "Připojeno" right.
Utility bar around 130px high with "Vyrovnat", center "Kolo 1" over "0 : 0", and pause symbol.
Narrow status strip "Meč sleduje telefon".
Single quiet instruction "Pohyb telefonu řídí meč."
Make the ONE cyan KRYT hold button MUCH TALLER to fill the extra vertical space: approximately 700px wide and 900px high. Add generous empty cyan space above and below its artwork instead of distorting it. Rounded cream-and-cyan shield in its upper middle, bold huge "KRYT" below, smaller "drž palcem" beneath. All inside one continuous touch area.
Footer with green check and "Vyrovnáno".
Everything fits within 780×1688 with modest 30px side margins. No new text, no new controls, no phone bezel. The final image must be conspicuously tall, same tall aspect as a 390×844 CSS-pixel phone screen.
```

### Hra — zaoblený neprůhledný panel, vybraný zdroj

Režim: vestavěný ImageGen, `transparent_background: true`.

Vstupní cesty:
- `C:\Users\krist\.codex\generated_images\01a1922f-1647-7ba3-b7cf-ddb0fa6306df\exec-6edb3190-40eb-4119-ad9c-aa1bfa557409.png`

Výstupní originál: `C:\Users\krist\.codex\generated_images\01a1922f-1647-7ba3-b7cf-ddb0fa6306df\exec-5fb7b3c5-6deb-4ed9-a44d-03212b6e5208.png`.

```text
Make one extremely small production finishing edit to this finished Mečovačka gameplay UI. Keep the exact same tall aspect ratio, the exact same interface, all pixel composition, all Czech lettering and spelling, same colors, same logo, same fox portrait, same single enormous KRYT button and all other controls. DO NOT redesign or reflow anything. ONLY change the outermost boundary: the complete dark-purple interface should be a rounded rectangle with gently rounded OUTER corners of about 24 pixels radius, surrounded by a tiny 5-pixel genuinely transparent clear margin on all four sides. The four outer corner cutouts are transparent too. The screen interior must be fully opaque dark purple/cyan/yellow as it is now. No phone hardware, no extra framing and no checkerboard painted into the image. A tall rounded UI card cutout, full screen size target 780×1688, for a 390×844 mobile UI concept. All existing Czech text remains exactly unchanged.
```

### Lobby — první pokus opravy alfa, nepoužitý

Režim: vestavěný ImageGen, `transparent_background: true`.

Vstupní cesty:
- `C:\Users\krist\.codex\generated_images\01a1922f-1647-7ba3-b7cf-ddb0fa6306df\exec-ce341c87-2502-46d3-a551-3bd7a9ade741.png`

Výstupní originál: `C:\Users\krist\.codex\generated_images\01a1922f-1647-7ba3-b7cf-ddb0fa6306df\exec-f7af9f9e-d2f1-46be-8293-b25848771544.png`.

```text
Make a production alpha-channel correction to this finished Mečovačka PHONE LOBBY UI. Do NOT redesign the screen. Preserve the exact same tall 390:844 aspect ratio, layout, logo, all eight portraits and Czech text. Do not add, remove, reflow, rename or crop anything. Exact final canvas target 780×1688.
CRITICAL CORRECTION: the current image has unwanted patches of transparency WITHIN the purple screen, particularly behind the logo, behind the roster heading and between controls. Replace all that interior transparency with a completely opaque uninterrupted dark-purple #14123a background. The whole rectangular screen interior must have alpha 255, including every background gap and every control. Absolutely NO see-through/cloudy/translucent areas anywhere inside the screen. ONLY a tiny clear margin outside the full UI and its smoothly rounded outer corner cutouts are genuinely transparent. Think an opaque printed UI card with rounded corners, cut out from a transparent canvas. No phone device, no new frame, no checkerboard in artwork.
Keep all existing lettering exactly unchanged and readable: Mečovačka logo; "Tvoje jméno"; "Pepa"; "Připojeno · Hráč 1"; "Meč sleduje telefon"; "Drž telefon na výšku."; "Vyber si šermíře"; roster top row "Zrzka", "Kvak", "Frak", "Hop"; bottom "Mour", "Huňáč", "Šroubek", "Kvík"; "Pravák", "Levák", "Vibrace"; "Hra"; "Souboj", "Krájení", "Trénink"; "Soupeř: počítač"; "Počítač", "Pohodový"; "Zápas", "na 2 vítězná"; "START". Preserve selected states and all control arrows, the happy original characters, yellow/cyan colors and rounded style. All UI stays entirely opaque, with transparent external margin only.
```

### Lobby — finální neprůhledný panel, vybraný zdroj

Režim: vestavěný ImageGen, `transparent_background: true`.

Vstupní cesty:
- `C:\Users\krist\.codex\generated_images\01a1922f-1647-7ba3-b7cf-ddb0fa6306df\exec-ce341c87-2502-46d3-a551-3bd7a9ade741.png`
- `C:\Users\krist\.codex\generated_images\01a1922f-1647-7ba3-b7cf-ddb0fa6306df\exec-5fb7b3c5-6deb-4ed9-a44d-03212b6e5208.png`

Výstupní originál: `C:\Users\krist\.codex\generated_images\01a1922f-1647-7ba3-b7cf-ddb0fa6306df\exec-58011531-7b73-42e5-a177-bc36d31f48fd.png`.

```text
Use case: compositing. Reference image 1 is the exact finished lobby interface to preserve. Reference image 2 is a finished gameplay interface with the correct SOLID ROUNDED PURPLE BACKING PANEL. Give image 1 the same solid opaque rounded purple card backing as image 2. The lobby's logo, identity card, roster, controls and all text are printed ON the single solid flat dark-purple backing card. They are not floating cutout fragments. Only OUTSIDE that one solid card is transparent. The card is ONE opaque object. Its dark-purple surface must stay perfectly solid across the entire rectangle behind the logo, behind the headings, between the controls and all the way to its four rounded corners. Add a subtle continuous purple perimeter edge that fully encloses the card, matching image 2. Interior alpha must be fully opaque everywhere. A tiny outer transparent margin surrounds the whole card.

Keep all image 1 content intact, no content from image 2 except its opaque rounded card shape. Keep the exact tall 390:844 aspect, target 780×1688. Do not invent phone hardware. No redesign. Exact same eight original characters, same sizes, selected fox, yellow START button, all settings, Czech wording, palette. Keep all existing text from image 1: "Tvoje jméno", "Pepa", "Připojeno · Hráč 1", "Meč sleduje telefon", "Drž telefon na výšku.", "Vyber si šermíře", "Zrzka", "Kvak", "Frak", "Hop", "Mour", "Huňáč", "Šroubek", "Kvík", "Pravák", "Levák", "Vibrace", "Hra", "Souboj", "Krájení", "Trénink", "Soupeř: počítač", "Počítač", "Pohodový", "Zápas", "na 2 vítězná", "START". Keep correct Mečovačka logo at top. No transparent holes anywhere in the card surface. No translucent glow or smoke; just dark-purple opaque background between the unchanged crisp UI controls.
```

## Závěrečná kontrola obrázků

Dodáno 21 povinných obrázků a 4 volitelné návrhy obrazovek. Ověřeny přesné cesty a rozměry, barevný prostor sRGB (ICC nebo PNG sRGB chunk), průhlednost podle zadání a neprůhledné pozadí ikon aplikace #14123a. Skutečná hra správně načítá logo, portréty, ikony režimů, oblohu i telefonní ilustrace; rozcestník ověřen společným náhledem karet na finálním pozadí. Čtyři soubory design/ jsou pouze obrazové podklady pro následnou implementaci rozhraní.
