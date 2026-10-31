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
