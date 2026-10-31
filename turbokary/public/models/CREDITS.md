# TurboKáry — původ a kontrakt 3D modelů

Originální geometrické modely vytvořené pro TurboKáry podle oddílu „3D modely postav a motokár (GLB)“ v `turbokary/AGENTS.md` na větvi hry s podporou GLB (výchozí commit `8a7fb90`). Nejde o ukázkové krabicové modely ani převzaté modely třetích stran.

Modelování: vlastní parametricky navržené polygonální sítě a upravené základní geometrické tvary v Three.js 0.187.0. Export přes GLTFExporter do samostatných glTF 2.0 binary souborů. Ploché normály jsou zapsané přímo ve vrcholech. Statické sítě se stejným materiálem byly sloučeny uvnitř příslušného rodiče; animační uzly zůstaly oddělené. Bez textur, externích souborů, kompresních dekodérů, převzatých značek nebo motivů jiných her. Autorské/exportní nástroje a testy vznikly mimo zdrojový kód hry.

## Společná motokára — kart.glb

Vlastní nízká závodní karoserie: klínovitá příď, boční pontony se vstupy vzduchu, ochranné nárazníky, pětipaprsková kola, sedačka, volant, kryt motoru, zadní křídlo a dva výfuky.

- Rozměry šířka × výška × délka: **1,915 × 1,110 × 2,630 m**.
- **3788 trojúhelníků**, 26 sítí, **291304 B**.
- Osy: Y nahoru, +Z dopředu, +X vlevo. Počátek na zemi u středu motokáry.
- `paint`: hlavní lak, výchozí oranžová `#ff7a1a`; hra jej přebarví.
- `accent`: pruhy, vložky a detaily, výchozí žlutá `#ffd21f`; hra jej přebarví.
- Ostatní materiály: tmavofialový podvozek, pryž, potah, slitina, motor a světla. Roughness 0,65–0,90; metalness 0,01–0,18.

| Uzel | Poloha X / Y / Z v metrech | Účel |
|---|---|---|
| wheel_fl | 0,78 / 0,30 / 0,82 | přední levé kolo |
| wheel_fr | −0,78 / 0,30 / 0,82 | přední pravé kolo |
| wheel_rl | 0,78 / 0,30 / −0,82 | zadní levé kolo |
| wheel_rr | −0,78 / 0,30 / −0,82 | zadní pravé kolo |
| seat | 0 / 0,55 / −0,30 | prázdný uzel pro spodek pánve řidiče |
| exhaust_l | 0,28 / 0,53 / −1,28 | prázdný uzel pro levý plamen turba |
| exhaust_r | −0,28 / 0,53 / −1,28 | prázdný uzel pro pravý plamen turba |

Kola mají identické výchozí natočení (identity quaternion), osu podél X a poloměr 0,30 m. Natočená je geometrie uvnitř uzlu, nikoli pivot. Volant `steering_wheel` je v poloze 0 / 0,85 / 0,30, poloměr ráfku 0,235 m.

## Řidiči — chars/0.glb až chars/7.glb

Vlastní low-poly interpretace již dodaných portrétů, s předepsanými barvami srsti, druhé barvy, trička a šátku. Společná sedící postava má samostatně modelované paže, dlaně a nohy; druhové rysy hlavy tvoří skutečná geometrie, nikoli textura.

Počátek je spodek pánve. Samostatný uzel `head` je u krku v poloze 0 / 0,54 / 0,015 m; celá hlava, uši i obličej jsou jeho potomci. Dlaně `hand_l` / `hand_r` jsou ve ±0,235 / 0,30 / 0,60 m. Po přičtení `seat` přesně objímají ráfek volantu. Materiály mají roughness 0,78 a metalness 0,04. Statické části jsou sloučené po materiálech, celkem 11–12 sítí na postavu.

| Soubor | Postava / vlastní modelované rysy | Trojúhelníky | Velikost B | Výška od sedáku m |
|---|---|---:|---:|---:|
| chars/0.glb | Liška Zrzka — špičaté uši, krémové tváře, čenich a chomáček | 1888 | 144824 | 1,265 |
| chars/1.glb | Žabák Kvak — vystouplé oči, široká tlama a světlá brada | 2136 | 162716 | 1,131 |
| chars/2.glb | Tučňák Frak — bílá obličejová maska, žlutý zobák a chocholka | 1872 | 143676 | 1,188 |
| chars/3.glb | Králík Hop — dlouhé bílé uši s růžovým vnitřkem, zoubky | 2136 | 162640 | 1,268 |
| chars/4.glb | Kocour Mour — špičaté uši, lícní srst, vousky a růžový čumák | 2148 | 164340 | 1,175 |
| chars/5.glb | Medvěd Huňáč — kulaté uši, velký světlý čenich a nos | 2408 | 182280 | 1,164 |
| chars/6.glb | Robot Šroubek — zkosená schránka, černý panel, tyrkysové oči a šrouby | 2248 | 170556 | 1,121 |
| chars/7.glb | Prasátko Kvík — sklopené uši, růžový rypáček a nozdry | 2148 | 164328 | 1,166 |
