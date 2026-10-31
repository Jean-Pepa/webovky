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

