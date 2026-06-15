import type { GuideArticle } from '@/types';

/**
 * Obsahová sekce „Průvodce“ — kurátorované články o péči, zdraví, výživě,
 * plemenech a cestování. Zdravotní témata odkazují na veterináře.
 */
export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    id: 'krmeni-stene',
    title: 'Jak často krmit štěně',
    category: 'vyziva',
    readMin: 3,
    excerpt: 'Rozvrh krmení podle věku a proč na pravidelnosti záleží.',
    body: [
      'Štěňata mají malý žaludek a rychlý metabolismus, proto potřebují jíst častěji než dospělí psi. Pravidelný režim navíc pomáhá i s nácvikem čistotnosti — co jde dovnitř pravidelně, jde i ven předvídatelně.',
      'Orientační rozvrh podle věku:',
      '• 8–12 týdnů: 4× denně',
      '• 3–6 měsíců: 3× denně',
      '• 6–12 měsíců: 2× denně',
      '• od 12 měsíců: 1–2× denně (podle plemene a doporučení veterináře)',
      'Vybírejte kvalitní krmivo odpovídající věku a velikosti plemene. Velká a obří plemena mají speciální požadavky na růst kloubů — nepřekrmujte je. Vždy mějte k dispozici čerstvou vodu a množství porcí přizpůsobte kondici psa.',
    ].join('\n\n'),
    affiliate: { label: 'Krmivo podle věku a plemene', note: 'Granule pro štěňata mají jiné složení než pro dospělé psy.' },
    vetNote: true,
  },
  {
    id: 'ockovani',
    title: 'Očkování a odčervení — základní přehled',
    category: 'zdravi',
    readMin: 4,
    excerpt: 'Proč a kdy chránit psa před nemocemi a parazity.',
    body: [
      'Očkování chrání psa před vážnými, často smrtelnými nemocemi (psinka, parvoviróza, infekční hepatitida, vzteklina). Štěňata dostávají první vakcíny zpravidla kolem 6.–8. týdne a následují přeočkování podle schématu, které určí veterinář.',
      'Do dokončení základního očkování je dobré volit bezpečná prostředí pro socializaci a vyhýbat se místům s vysokou koncentrací neznámých psů.',
      'Odčervení je potřeba opakovat pravidelně — frekvenci ovlivňuje věk, prostředí a životní styl psa. Nezapomínejte ani na ochranu proti vnějším parazitům (blechy, klíšťata), zvlášť v sezóně.',
      'Konkrétní termíny a přípravky vždy konzultujte se svým veterinářem a veďte si očkovací průkaz.',
    ].join('\n\n'),
    vetNote: true,
  },
  {
    id: 'vyber-plemene',
    title: 'Jak vybrat plemeno podle životního stylu',
    category: 'plemena',
    readMin: 5,
    excerpt: 'Energie, velikost, péče — na co se ptát před pořízením psa.',
    body: [
      'Nejčastější příčinou problémů není „špatný pes“, ale nesoulad mezi potřebami plemene a životem majitele. Než si psa pořídíte, buďte k sobě upřímní v několika bodech.',
      'Kolik pohybu reálně zvládnete? Pastevecká a severská plemena (border kolie, husky) potřebují hodně pohybu i práce pro hlavu. Klidnější společenská plemena se spokojí s méně.',
      'Kolik času máte na péči a výcvik? Dlouhá srst znamená pravidelnou údržbu. Mladý pes jakéhokoli plemene potřebuje čas na výchovu.',
      'Jaký máte prostor a rodinu? Velikost dospělého psa, snášenlivost s dětmi nebo jinými zvířaty — to vše zvažte předem. V appce u každého plemene najdete orientační energii a cvičitelnost, které vám pomohou v rozhodování.',
    ].join('\n\n'),
  },
  {
    id: 'pece-srst',
    title: 'Péče o srst a drápky',
    category: 'pece',
    readMin: 3,
    excerpt: 'Základní rutina, aby byl pes čistý a v pohodě.',
    body: [
      'Pravidelná péče není jen o vzhledu — předchází zdravotním problémům a je skvělou příležitostí všimnout si změn na kůži, uších nebo tlapkách.',
      'Srst: krátkosrstá plemena stačí kartáčovat jednou týdně, dlouhosrstá klidně denně, aby se netvořily zacuchané chuchvalce. Koupání jen v případě potřeby a vždy psím šamponem.',
      'Drápky: příliš dlouhé drápky psa bolí a mění postoj. Stříhejte opatrně po malých kouscích, abyste nezasáhli cévní zásobení. Pokud si nejste jistí, nechte si poradit od veterináře nebo psího kadeřníka.',
      'Uši a zuby: kontrolujte uši (zápach, zarudnutí) a dbejte na péči o zuby. Na péči zvykejte psa pozitivně už od štěněte — s pamlskem a po malých dávkách.',
    ].join('\n\n'),
  },
  {
    id: 'cestovani-autem',
    title: 'Cestování autem se psem bezpečně',
    category: 'cestovani',
    readMin: 4,
    excerpt: 'Jak zajistit psa v autě a naplánovat cestu bez stresu.',
    body: [
      'Nezajištěný pes je v autě riziko pro sebe i pro posádku. Při prudkém brzdění se z neukotveného psa stává nebezpečný projektil.',
      'Možnosti zajištění: přepravní box odpovídající velikosti, bezpečnostní postroj připnutý do pásu, nebo zábrana v zavazadlovém prostoru. Pes by měl mít pohodlí, ale nesmí se volně pohybovat po kabině.',
      'Před delší cestou psa vyvenčete a nakrmte s předstihem (ne těsně před jízdou). Plánujte pravidelné přestávky na protažení a vodu. Nikdy nenechávejte psa v rozpáleném autě — i pár minut může být životu nebezpečných.',
      'Na cestu se psem se hodí naplánovat i pet-friendly zastávky a ubytování. Mnoho hotelů dnes psy vítá — vyplatí se ověřit podmínky předem.',
    ].join('\n\n'),
    affiliate: { label: 'Pet-friendly ubytování a pojištění na cesty', note: 'Ověřte podmínky pro psy a krytí pojištění před odjezdem.' },
  },
  {
    id: 'lekarnicka',
    title: 'První pomoc — co mít v psí lékárničce',
    category: 'zdravi',
    readMin: 3,
    excerpt: 'Základní vybavení pro klidnější řešení drobných úrazů.',
    body: [
      'Dobře vybavená lékárnička vám pomůže zvládnout drobnosti a získat čas, než se dostanete k veterináři. Není náhradou odborné péče — při vážnějším stavu vždy volejte veterináře.',
      'Základ do lékárničky:',
      '• Obvazový materiál (sterilní krytí, obinadlo, samolepicí ovin)',
      '• Pinzeta a háček na klíšťata',
      '• Dezinfekce vhodná pro zvířata',
      '• Digitální teploměr',
      '• Náhradní vodítko a náhubek (i přátelský pes může při bolesti kousnout)',
      'Mějte po ruce telefon na svého veterináře i na nejbližší pohotovost. Naučte se předem, jak vypadá normální dech, dásně a teplota vašeho psa — odchylky pak poznáte rychleji.',
    ].join('\n\n'),
    vetNote: true,
  },
];

export function getArticle(id: string | undefined): GuideArticle | undefined {
  return id ? GUIDE_ARTICLES.find((a) => a.id === id) : undefined;
}
