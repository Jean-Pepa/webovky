# TurboKáry — původ grafiky

Grafika vytvořená pro tento projekt podle `turbokary/AGENTS.md`. Originální postavy a motivy; bez převzatých značek nebo herních assetů. PNG používají skutečnou průhlednost tam, kde ji zadání vyžaduje. Barevné hodnoty jsou určeny pro sRGB.

## Logo

- `logo.png` — vytvořeno vestavěným OpenAI ImageGen; mechanicky zmenšeno na 1600 × 560 PNG pomocí System.Drawing, průhlednost zachována. Vizuálně ověřen nápis i diakritika.
- Prompt: Use case: logo-brand. Create the final polished original logo asset for a cheerful Czech cartoon kart racing game. Wide horizontal transparent PNG canvas approximately 1600x560. Exact single word text "TurboKáry" (capital T and K, acute accent on lowercase á; spelling T u r b o K á r y). Large wonderfully chunky playful rounded display lettering, yellow #ffd21f to orange #ff7a1a to coral red #ff4d6d gradient, very thick dark purple #1b1430 outline plus thin pale cream outer keyline for strong readability on dark purple #160f33 or a colorful 3D race scene. Dynamic slight slant, soft simple cel shading. Small original waving black and cream checker racing flag to one side. Composition fills wide canvas, all glyphs and accents fully inside with comfortable padding. Transparent empty space, no background panel, no watermark, no other text. Original visual identity, absolutely no Nintendo, Mario Kart, mushrooms, shells, question blocks, existing brands. Deliver one logo only.
## Oblohy tratí

Všechny tři oblohy byly vytvořeny vestavěným nástrojem OpenAI ImageGen (`transparent_background=false`) z níže uvedených původních promptů, bez cizích předloh. Zdrojové PNG mají 2172×724 px. Technický export přes Windows System.Drawing/GDI+: bicubic převzorkování na 4096×1024, jemné symetrické sjednocení okrajů v pásu 96 px pro horizontální opakování, plynulý přechod spodních 160 px do mlhy dané trati, RGB/sRGB a JPEG kvalita 85. JPEG může mlhovou barvu změnit o jednotku kanálu. Nezměnil se žádný zdrojový kód hry.

### `sky-meadow.jpg`

Prompt:

> Use case: stylized-concept. Asset type: seamless horizontal sky panorama for an original cheerful low-poly kart racing game TurboKáry. Create a polished 4096 by 1024 pixel 4:1 landscape illustration, a complete 360-degree cylindrical horizon whose left and right edge continue seamlessly. Upper two-thirds: rich blue sky #3a8dff with soft chunky cumulus clouds. Lower third: layered distant blue-gray mountains with snow on a few peaks and rounded green meadow hills, gently fading into pale blue fog; bottom edge must be uniform #d6eeff. Happy colorful cartoon style, simple confident shapes, soft cel shading, clean dark indigo outlines #1b1430 softened in distant scenery. Broad continuous horizon, distant scenery only, no foreground objects, no road. Entire image opaque. No sun, moon, text, letters, logos, characters, vehicles, stars, Nintendo references, mushrooms, question blocks. Carefully match cloud placement and horizon heights at both left/right boundaries so this tiles horizontally without a seam.

### `sky-desert.jpg`

Prompt:

> Use case: stylized-concept. Asset type: seamless horizontal sky panorama for the original cheerful low-poly kart racing game TurboKáry, desert course. Create a polished extra-wide 4096 by 1024 pixel 4:1 landscape illustration, a complete 360-degree cylindrical horizon whose left and right edge continue seamlessly with precisely identical colors, ridge heights and clouds. Upper two-thirds: rich saturated blue sky gradually softening into warm peach at the horizon, a few chunky stylized clouds. Lower third: layers of distant red-brown sandstone mesas with flat tops and softly rounded desert buttes, warm coral-orange stone faces, gently fading into pale warm fog. Bottom edge must be uniform #ffe3b8. Cheerful colorful clean cartoon game style, simple confident shapes, soft cel shading, dark indigo #1b1430 outlines softened with distance. Broad continuous horizon, distant scenery only, no foreground objects, no road. Entire image opaque. No sun, moon, text, letters, logos, characters, vehicles, Nintendo references, mushrooms, question blocks. Carefully match both left/right boundaries for seamless horizontal wrapping.

### `sky-ice.jpg`

Prompt:

> Use case: stylized-concept. Asset type: seamless horizontal sky panorama for the original cheerful low-poly kart racing game TurboKáry, frozen lake course. Create a polished extra-wide 4096 by 1024 pixel 4:1 landscape illustration, a complete 360-degree cylindrical horizon whose left and right edge continue seamlessly with precisely identical colors and mountain heights. Upper two-thirds: cool blue-violet clear sky, a few soft chunky pale icy clouds. Lower third: layered distant angular snowy mountain peaks, white snow faces with periwinkle and blue shadows, gently fading into pale blue-lilac fog. Bottom edge must be uniform #e3ecff. Cheerful colorful clean cartoon game style, simple confident shapes, soft cel shading, dark indigo #1b1430 outlines softened with distance. Broad continuous horizon, distant scenery only, no foreground objects, no road. Entire image opaque. No sun, moon, stars, aurora, text, letters, logos, characters, vehicles, Nintendo references, mushrooms, question blocks. Carefully match both left/right boundaries for seamless horizontal wrapping.

## Reklamní plachty

Všechny čtyři plachty byly jednotlivě vytvořeny vestavěným OpenAI ImageGen. Mechanicky oříznuté prázdné okraje podle alfa kanálu (práh 24), proporčně zmenšené a vystředěné na průhledné plátno 1024 × 256 s minimálně 6 px okrajem pomocí System.Drawing. České názvy a diakritika byly vizuálně ověřeny.

### banners/1.png — Turbo Knedlík

Prompt: Use case: ads-marketing. Final original trackside sponsor billboard texture for the Czech cartoon kart game TurboKáry. One very wide 4:1 banner, final use 1024x256 PNG. Cheerful simple cartoon with bold thick dark purple #1b1430 outlines, soft cel shading, no photorealism. A bright yellow #ffd21f and orange #ff7a1a rounded rectangular sign panel occupies almost the entire image, transparent exterior corners, no wall or environment. VERY LARGE playful chunky rounded type in dark purple #1b1430 saying EXACTLY "Turbo Knedlík" and no other words. Czech accents must be correct. Text takes about 75 percent of the width; modest decorative mascot at one end: a smiling white Czech bread dumpling sliced with golden motion streaks. Simple tiny checker race accent. Readable at a distance. Front-on completely flat sign, centered, generous safety margin all around, no frame cropping. No actual companies, no Nintendo imagery, no watermark. ONLY the complete sign on transparent background.

### banners/2.png — Pneu Hop

Prompt: Use case: ads-marketing. Final original trackside sponsor billboard texture for the Czech cartoon kart game TurboKáry. One very wide 4:1 banner, final use 1024x256 PNG. Cheerful simple cartoon with bold thick dark purple #1b1430 outlines, soft cel shading, no photorealism. A bright turquoise #7cf3ff and teal rounded rectangular sign panel occupies almost the entire image, transparent exterior corners, no wall or environment. VERY LARGE playful chunky rounded type in dark purple #1b1430 saying EXACTLY "Pneu Hop" and no other words. Czech accents must be correct. Text takes about 75 percent of the width; modest decorative mascot at one end: one cheerful stylized black rubber tire bouncing with two small white rabbit ears. Simple tiny checker race accent. Readable at a distance. Front-on completely flat sign, centered, generous safety margin all around, no frame cropping. No actual companies, no Nintendo imagery, no watermark. ONLY the complete sign on transparent background.

### banners/3.png — U Žabáka

Prompt: Use case: ads-marketing. Final original trackside sponsor billboard texture for the Czech cartoon kart game TurboKáry. One very wide 4:1 banner, final use 1024x256 PNG. Cheerful simple cartoon with bold thick dark purple #1b1430 outlines, soft cel shading, no photorealism. A bright purple #160f33 rounded rectangular sign panel occupies almost the entire image, transparent exterior corners, no wall or environment. VERY LARGE playful chunky rounded type in bright yellow #ffd21f with a cream keyline saying EXACTLY "U Žabáka" and no other words. Czech accents must be correct. Text takes about 75 percent of the width; modest decorative mascot at one end: a friendly simple green frog face in a racing goggle beside a small fuel droplet. Simple tiny checker race accent. Readable at a distance. Front-on completely flat sign, centered, generous safety margin all around, no frame cropping. No actual companies, no Nintendo imagery, no watermark. ONLY the complete sign on transparent background.

### banners/4.png — Koblihy Zrzka

Prompt: Use case: ads-marketing. Final original trackside sponsor billboard texture for the Czech cartoon kart game TurboKáry. One very wide 4:1 banner, final use 1024x256 PNG. Cheerful simple cartoon with bold thick dark purple #1b1430 outlines, soft cel shading, no photorealism. A bright coral #ff4d6d and warm orange rounded rectangular sign panel occupies almost the entire image, transparent exterior corners, no wall or environment. VERY LARGE playful chunky rounded type in cream white with dark purple outline saying EXACTLY "Koblihy Zrzka" and no other words. Czech accents must be correct. Text takes about 75 percent of the width; modest decorative mascot at one end: an orange fox ear silhouette behind a plump golden Czech jam doughnut with a tiny red jam dot. Simple tiny checker race accent. Readable at a distance. Front-on completely flat sign, centered, generous safety margin all around, no frame cropping. No actual companies, no Nintendo imagery, no watermark. ONLY the complete sign on transparent background.

## Ikony věcí

Vytvořeno 31. října 2026 vestavěným nástrojem OpenAI ImageGen (nikoli API/CLI fallback). Osm samostatných generování podle zadání TurboKáry; bez externích obrazových předloh. Originální kreslená grafika, žádné značky či převzaté herní postavy. Mechanické zmenšení na 256×256 pomocí Windows System.Drawing, vysoce kvalitní bicubická interpolace, průhledný kanál alfa zachován. Export PNG sRGB. Kontrola vzhledu jednotlivě a společně ve velikosti 48 px.

### `items/turbo.png`

Zdrojový generovaný soubor: `exec-ae28b48d-77c8-4da7-8b42-169c7946cb77.png`.

Přesný prompt:

```text
Use case: stylized-concept. Asset type: single inventory power-up icon for original cheerful kart-racing game TurboKáry, square PNG with genuine transparent background. Subject: one chunky yellow-to-orange lightning bolt representing turbo speed, dynamic diagonal silhouette. Style: polished cheerful hand-drawn cartoon, simple rounded shapes, very thick dark plum outline #1b1430, soft two-tone shading, crisp edge highlights. Palette: golden yellow #ffd21f, orange #ff7a1a, tiny pale cream highlight. Composition: one centered isolated icon, generous 10% transparent margin, fills square well and recognizable at 48 px. No text, no border, no badge, no background, no cast shadow outside shape, no trademarks, no Nintendo motifs, no extra objects. Deliver clean transparent alpha artwork for final 256x256 size.
```

### `items/turbo3.png`

Zdrojový generovaný soubor: `exec-f0078ecd-d8e9-4cba-bee5-7526d17fdb1b.png`.

Přesný prompt:

```text
Use case: stylized-concept. Asset type: single inventory power-up icon for original cheerful kart-racing game TurboKáry, square PNG with genuine transparent background. Style: polished cheerful hand-drawn cartoon, simple rounded shapes, very thick dark plum outline #1b1430, soft two-tone shading, crisp edge highlights. Composition: centered isolated icon, generous 10% transparent margin, fills square well and unmistakably recognizable at 48 px. No text, no border, no badge, no background, no cast shadow outside shape, no trademarks, no Nintendo motifs, no extra objects. Deliver clean transparent alpha artwork for final 256x256 size. Subject: Exactly THREE clearly distinct chunky lightning bolts side by side in a dynamic fan, each yellow #ffd21f with orange #ff7a1a edges and pale cream highlight. They must form one balanced inventory icon with exactly three visible zigzag bolt silhouettes, visually legible as triple turbo speed.
```

### `items/oil.png`

Zdrojový generovaný soubor: `exec-21ebb0ac-1277-4f6f-b61d-45c71df73b1f.png`.

Přesný prompt:

```text
Use case: stylized-concept. Asset type: single inventory power-up icon for original cheerful kart-racing game TurboKáry, square PNG with genuine transparent background. Style: polished cheerful hand-drawn cartoon, simple rounded shapes, very thick dark plum outline #1b1430, soft two-tone shading, crisp edge highlights. Composition: centered isolated icon, generous 10% transparent margin, fills square well and unmistakably recognizable at 48 px. No text, no border, no badge, no background, no cast shadow outside shape, no trademarks, no Nintendo motifs, no extra objects. Deliver clean transparent alpha artwork for final 256x256 size. Subject: One chunky black-charcoal oil jerrycan in slight three-quarter view with handle and spout, a wide horizontal yellow #ffd21f stripe on its front and one bold black oil droplet symbol in that stripe. The can is the whole silhouette, with a warm gray edge highlight. No lettering.
```

### `items/coconut.png`

Zdrojový generovaný soubor: `exec-08144e14-5406-4ff5-abbf-6bce133fd487.png`.

Přesný prompt:

```text
Use case: stylized-concept. Asset type: single inventory power-up icon for original cheerful kart-racing game TurboKáry, square PNG with genuine transparent background. Style: polished cheerful hand-drawn cartoon, simple rounded shapes, very thick dark plum outline #1b1430, soft two-tone shading, crisp edge highlights. Composition: centered isolated icon, generous 10% transparent margin, fills square well and unmistakably recognizable at 48 px. No text, no border, no badge, no background, no cast shadow outside shape, no trademarks, no Nintendo motifs, no extra objects. Deliver clean transparent alpha artwork for final 256x256 size. Subject: One whole round brown coconut with three dark circular coconut pores arranged as two eyes and a tiny mouth, cute and mischievous. Warm brown simple segmented shell shading, a few broad curved husk marks, pale tan highlights. No limbs and no cut-open flesh. Very simple big silhouette.
```

### `items/rocket.png`

Zdrojový generovaný soubor: `exec-568a0b53-87b1-49b0-9f48-cbe867943ecb.png`.

Přesný prompt:

```text
Use case: stylized-concept. Asset type: single inventory power-up icon for original cheerful kart-racing game TurboKáry, square PNG with genuine transparent background. Style: polished cheerful hand-drawn cartoon, simple rounded shapes, very thick dark plum outline #1b1430, soft two-tone shading, crisp edge highlights. Composition: centered isolated icon, generous 10% transparent margin, fills square well and unmistakably recognizable at 48 px. No text, no border, no badge, no background, no cast shadow outside shape, no trademarks, no Nintendo motifs, no extra objects. Deliver clean transparent alpha artwork for final 256x256 size. Subject: One chunky toy-like red-and-white rocket diagonally pointing to upper right, red rounded nose cone #ff4d6d, white main body, red triangular fins, simple cyan porthole, short bright golden yellow and orange exhaust flame. Friendly playful power-up, not a realistic weapon.
```

### `items/bees.png`

Zdrojový generovaný soubor: `exec-6067b942-2b80-4428-8ab3-f034406bc5eb.png`.

Přesný prompt:

```text
Use case: stylized-concept. Asset type: single inventory power-up icon for original cheerful kart-racing game TurboKáry, square PNG with genuine transparent background. Style: polished cheerful hand-drawn cartoon, simple rounded shapes, very thick dark plum outline #1b1430, soft two-tone shading, crisp edge highlights. Composition: centered isolated icon, generous 10% transparent margin, fills square well and unmistakably recognizable at 48 px. No text, no border, no badge, no background, no cast shadow outside shape, no trademarks, no Nintendo motifs, no extra objects. Deliver clean transparent alpha artwork for final 256x256 size. Subject: Exactly THREE happy chubby yellow-and-black bees flying together in a compact triangular swarm. One larger central bee and two smaller bees at its sides. Each has black stripes, tiny antennae, two pale cyan wings, smiling cute face. The three separate bodies must be clearly countable and recognizable at tiny icon size. Very simple big shapes.
```

### `items/shield.png`

Zdrojový generovaný soubor: `exec-16f09ba1-34cf-4e07-b85a-e1d2325c6a20.png`.

Přesný prompt:

```text
Use case: stylized-concept. Asset type: single inventory power-up icon for original cheerful kart-racing game TurboKáry, square PNG with genuine transparent background. Style: polished cheerful hand-drawn cartoon, simple rounded shapes, very thick dark plum outline #1b1430, soft two-tone shading, crisp edge highlights. Composition: centered isolated icon, generous 10% transparent margin, fills square well and unmistakably recognizable at 48 px. No text, no border, no badge, no background, no cast shadow outside shape, no trademarks, no Nintendo motifs, no extra objects. Deliver clean transparent alpha artwork for final 256x256 size. Subject: One round translucent blue protective bubble shield. Thick dark plum outer contour, bright cyan #7cf3ff rim and white curved reflection highlights, clear softly blue transparent center with subtle light azure glass shading. Single spherical bubble, not a medieval shield and no emblem, no object inside. Bold simple silhouette recognizable at 48 px.
```

### `items/ram.png`

Zdrojový generovaný soubor: `exec-285418d7-3595-4b6a-8609-35b57e1fd108.png`.

Přesný prompt:

```text
Use case: stylized-concept. Asset type: single inventory power-up icon for original cheerful kart-racing game TurboKáry, square PNG with genuine transparent background. Style: polished cheerful hand-drawn cartoon, simple rounded shapes, very thick dark plum outline #1b1430, soft two-tone shading, crisp edge highlights. Composition: centered isolated icon, generous 10% transparent margin, fills square well and unmistakably recognizable at 48 px. No text, no border, no badge, no background, no cast shadow outside shape, no trademarks, no Nintendo motifs, no extra objects. Deliver clean transparent alpha artwork for final 256x256 size. Subject: A symmetrical pair of thick curled ram horns made from glowing golden yellow metal, facing front. Two clearly separated spiral curls join at short central golden bridge, with a small warm orange golden halo close around the horns and two tiny gleam marks. No ram head or face. The two spiral horns are the entire power-up symbol. Thick dark plum contour, bright gold #ffd21f and orange #ff7a1a shade.
```


## Portréty postav

Všech osm portrétů vzniklo vestavěným nástrojem OpenAI ImageGen s požadavkem na skutečně průhledné pozadí. Portrét lišky byl vygenerován jako první a použit jako vlastní stylová a kompoziční reference pro ostatní postavy; nebyly použity cizí obrázky. Po generování následovalo vizuální ověření každého portrétu a mechanický export přes sharp: zmenšení na 512×512 (Lanczos3), vložení profilu sRGB a bezeztrátová PNG komprese úrovně 9 s adaptivním filtrováním, RGBA bez kvantizace. Všechny soubory mají alpha kanál, průhledné rohy a velikost 215–268 kB.

### `chars/0.png` — Liška Zrzka

Zdrojový výstup ImageGen: `exec-62988ca6-35fa-47b7-bdf1-0a01d576b2d7.png`.

Přesný prompt:

```text
Use case: stylized-concept. Asset: square 512x512 transparent PNG character portrait for original Czech cartoon kart-racing game TurboKáry. Character 0: a happy orange fox racer, head and shoulders, slightly turned three-quarter toward viewer. Fur #f27a24, warm cream muzzle and inner ears #fff6ea; dark navy plain T-shirt #2b2d42; orange scarf #ff7a1a at neck. Large friendly dark eyes, confident cheerful smile, two triangular ears and small head tuft. Thick clean dark-purple outline #1b1430, soft simple cel-shading, rounded chunky shapes matching a low-poly animal kart game. Polished hand-drawn 2D game UI art, simple not furry detailed, no photorealism. Composition centered, head at x256 y215 about 290px wide excluding ears, shoulders end near y460, entire ears and bust visible with generous transparent margins. No kart, no props, no text, no border, no shadow on a background, no Nintendo elements or existing characters. Actual alpha-transparent background. Render just one character.
```

### `chars/1.png` — Žabák Kvak

Zdrojový výstup ImageGen: `exec-6206faab-4183-45d7-9eeb-b7f523cb2919.png`.
Stylová reference: vlastní generovaný portrét `chars/0.png` (plné původní rozlišení).

Přesný prompt:

```text
Use case: stylized-concept. Make one new original character portrait for the same kart-racing game as the reference. Input image is STYLE/COMPOSITION reference only, NOT a fox character to preserve. New subject: cheerful green FROG racer, Character 1 Kvak. Bright green skin #63d34c, pale yellow-green lower face #daf7a6, big rounded protruding eyes with friendly dark pupils, broad smiling frog mouth, no ears or fur. Coral-red plain T-shirt #ff6b6b, vivid green neck scarf #3ccf4e. Match the reference's thick dark-purple #1b1430 outline, clean rounded cartoon shapes, soft cel shading, high-quality 2D game UI rendering, cheerful personality, bust crop, and same apparent head size. Front with very slight three-quarter turn, shoulders visible, all contours inside square with breathing room. Full portrait isolated on REAL TRANSPARENT BACKGROUND. Square 512x512 target. No text, no badge, no kart, no background, no existing cartoon characters.
```

### `chars/2.png` — Tučňák Frak

Zdrojový výstup ImageGen: `exec-9e993124-d24c-49b3-af9b-5e9e99b286a3.png`.
Stylová reference: vlastní generovaný portrét `chars/0.png` (plné původní rozlišení).

Přesný prompt:

```text
Use case: stylized-concept. Make one new original character portrait for the same kart-racing game as the reference. Input image is STYLE/COMPOSITION reference only, NOT a fox character to preserve. New subject: cheerful PENGUIN racer, Character 2 Frak. Round charcoal black head #23272e with white face patches #ffffff, large friendly dark eyes, small orange beak with joyful smile, no ears or fur. Golden-yellow plain T-shirt #ffb703 and bright cyan-blue neck scarf #22b8f0. Match the reference's thick dark-purple #1b1430 outline, clean rounded cartoon shapes, soft cel shading, high-quality 2D game UI rendering, cheerful personality, bust crop, and same apparent head size. Front with very slight three-quarter turn, shoulders visible, all contours inside square with breathing room. Full portrait isolated on REAL TRANSPARENT BACKGROUND. Square 512x512 target. No text, no badge, no kart, no background, no existing cartoon characters.
```

### `chars/3.png` — Králík Hop

Zdrojový výstup ImageGen: `exec-14b47d06-890b-451a-9764-c2de43f22a24.png`.
Stylová reference: vlastní generovaný portrét `chars/0.png` (plné původní rozlišení).

Přesný prompt:

```text
Use case: stylized-concept. Make one new original character portrait for the same kart-racing game as the reference. Input image is STYLE/COMPOSITION reference only, NOT a fox character to preserve. New subject: cheerful white RABBIT racer, Character 3 Hop. White fur #f4f4f4, soft pink inner ears and small nose #ffb3c9, two long upright bunny ears fully visible, round friendly eyes and a happy smile with small front teeth. Violet plain T-shirt #7b61ff, bright pink neck scarf #ff5fa8. Match the reference's thick dark-purple #1b1430 outline, clean rounded cartoon shapes, soft cel shading, high-quality 2D game UI rendering, cheerful personality, bust crop, and same apparent head width. Front with very slight three-quarter turn, shoulders visible, ears entirely inside square with breathing room. Full portrait isolated on REAL TRANSPARENT BACKGROUND. Square 512x512 target. No text, no badge, no kart, no background, no existing cartoon characters.
```

### `chars/4.png` — Kocour Mour

Zdrojový výstup ImageGen: `exec-bb2ab554-98ef-493d-bdef-b447f813ef33.png`.
Stylová reference: vlastní generovaný portrét `chars/0.png` (plné původní rozlišení).

Přesný prompt:

```text
Use case: stylized-concept. Make one new original character portrait for the same kart-racing game as the reference. Input image is STYLE/COMPOSITION reference only, NOT a fox character to preserve. New subject: cheerful gray tomcat racer, Character 4 Mour. Gray fur #8d8d9b, pale gray rounded muzzle #f0f0f0, triangular cat ears, small pink cat nose, a few clean whiskers, friendly dark eyes and playful confident smile. Mint-green plain T-shirt #06d6a0, rich purple neck scarf #9b4dff. Cat anatomy with short round muzzle, no long fox muzzle. Match the reference's thick dark-purple #1b1430 outline, clean rounded cartoon shapes, soft cel shading, high-quality 2D game UI rendering, cheerful personality, bust crop, and same apparent head size. Front with very slight three-quarter turn, shoulders visible, all contours inside square with breathing room. Full portrait isolated on REAL TRANSPARENT BACKGROUND. Square 512x512 target. No text, no badge, no kart, no background, no existing cartoon characters.
```

### `chars/5.png` — Medvěd Huňáč

Zdrojový výstup ImageGen: `exec-b64d0b2e-1f76-4b9c-9451-72a2decf855f.png`.
Stylová reference: vlastní generovaný portrét `chars/0.png` (plné původní rozlišení).

Přesný prompt:

```text
Use case: stylized-concept. Make one new original character portrait for the same kart-racing game as the reference. Input image is STYLE/COMPOSITION reference only, NOT a fox character to preserve. New subject: cheerful brown BEAR racer, Character 5 Hunac. Round broad bear head, small ROUND ears, warm brown fur #8a5a2b, tan muzzle and inner ears #d9a46c, big black nose, friendly dark eyes and warm smile. Pink-red plain T-shirt #ef476f, royal-blue neck scarf #2f6bff. Match the reference's thick dark-purple #1b1430 outline, clean rounded cartoon shapes, soft cel shading, high-quality 2D game UI rendering, cheerful personality, bust crop, and same apparent head size. Front with very slight three-quarter turn, shoulders visible, all contours inside square with breathing room. Full portrait isolated on REAL TRANSPARENT BACKGROUND. Square 512x512 target. No text, no badge, no kart, no background, no existing cartoon characters.
```

### `chars/6.png` — Robot Šroubek

Zdrojový výstup ImageGen: `exec-3671ed85-4501-48c0-be80-780a9818dd76.png`.
Stylová reference: vlastní generovaný portrét `chars/0.png` (plné původní rozlišení).

Přesný prompt:

```text
Use case: stylized-concept. Make one new original character portrait for the same kart-racing game as the reference. Input image is STYLE/COMPOSITION reference only, NOT a fox character to preserve. New subject: cheerful ROBOT racer, Character 6 Sroubek. A friendly rounded rectangular silver-metal robot head #c3ccd3, two cyan luminous eyes #4fe3ff in a dark face inset, simple smiling mouth display, small bolt details and round mechanical ear discs. No animal fur or animal ears. Dark blue-gray plain T-shirt #37474f on chunky robot shoulders, bright red neck scarf #e53935. Match the reference's thick dark-purple #1b1430 outline, clean rounded cartoon shapes, soft cel shading, high-quality 2D game UI rendering, cheerful personality, bust crop, and same apparent head size. Front with very slight three-quarter turn, shoulders visible, all contours inside square with breathing room. Full portrait isolated on REAL TRANSPARENT BACKGROUND. Square 512x512 target. No text, no numbers, no badge, no kart, no background, no existing cartoon characters.
```

### `chars/7.png` — Prasátko Kvík

Zdrojový výstup ImageGen: `exec-049f29bf-4600-4165-ab21-064cdd45b677.png`.
Stylová reference: vlastní generovaný portrét `chars/0.png` (plné původní rozlišení).

Přesný prompt:

```text
Use case: stylized-concept. Make one new original character portrait for the same kart-racing game as the reference. Input image is STYLE/COMPOSITION reference only, NOT a fox character to preserve. New subject: cheerful pink PIGLET racer, Character 7 Kvik. Round pink head #ffa7bb, darker pink snout and inner ears #ff7f9e, two small folded triangular pig ears, short round snout with exactly two nostrils, large friendly dark eyes and warm joyful smile, no fur. Teal-blue plain T-shirt #118ab2, golden-yellow neck scarf #ffd21f. Match the reference's thick dark-purple #1b1430 outline, clean rounded cartoon shapes, soft cel shading, high-quality 2D game UI rendering, cheerful personality, bust crop, and same apparent head size. Front with very slight three-quarter turn, shoulders visible, all contours inside square with breathing room. Full portrait isolated on REAL TRANSPARENT BACKGROUND. Square 512x512 target. No text, no badge, no kart, no background, no existing cartoon characters.
```



