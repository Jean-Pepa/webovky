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

