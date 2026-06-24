// Výchozí úkoly pro každou roli — „rozdané dopředu" podle manuálu. Když se založí
// nový ročník, tyto úkoly se předvyplní a v Úkolech se seskupí pod jednotlivé role.
// Každý, kdo si roli vezme, tak rovnou vidí, co ho čeká.

export const ROLE_TASKS: Record<string, string[]> = {
  hlavni: [
    "Založit komunikační skupinu a sezvat tým",
    "Sestavit harmonogram příprav a rozdělit role",
    "Pohlídat souběh akcí při volbě termínu",
    "Hlídat, že každý úkol má svého majitele",
  ],
  ekonom: [
    "Založit společný účet na jednu důvěryhodnou osobu",
    "Vybrat třídní vklad (cca 1500 Kč/os.) — 3 upomínací kola",
    "Vést tabulku příjmů a výdajů (sekce Finance)",
    "Po Mařeně udělat vyúčtování a vrátit vklady",
  ],
  fakulta: [
    "Domluvit se Soňou termín a co fakulta zaplatí",
    "Zajistit přes děkana otevření fakulty do půlnoci (vrátnice)",
    "Nahlásit příjezdy externistů na vrátnici",
    "Zařídit podpisy formulářů BOZP (p. Hasala)",
  ],
  kapelnik: [
    "Sestavit seznam kapel a DJs a obeslat je",
    "Vyžádat a poslat ridery zvukaři",
    "Zajistit aparaturu a stany pro kapely",
    "Naplánovat večerní program (dvůr / Archa)",
  ],
  prednasky: [
    "Obeslat zahraniční přednášející (půl roku předem)",
    "Obeslat české přednášející (2–3 měsíce předem)",
    "Zamluvit aulu u Forteho a pohlídat souběh se sborem",
    "Připravit medailonky přednášejících",
  ],
  vyzdoba: [
    "Navrhnout téma a rozdělit školu do zón",
    "Dát každé skupince budget na výzdobu",
    "Nechat plán schválit (tajemník / p. Hasala)",
    "Zajistit materiál a skladování v Arše/kotelně",
  ],
  grafik: [
    "Vytvořit vizuál ročníku podle tématu",
    "Připravit šablony pro sociální sítě",
    "Nachystat příspěvky a programy dopředu",
    "Vše ve verzi CZ i EN",
  ],
  propagace: [
    "Spustit propagaci v červnu (zápis prváků)",
    "Založit FB událost a rozjet instagram",
    "Házet program každý den (CZ i EN)",
    "Rozesílat denní newsletter studentům i akademikům",
  ],
  sponzoring: [
    "Sestavit seznam oslovitelných sponzorů",
    "Rozeslat poptávky z mařena e-mailu",
    "Ozvat se osvědčeným (např. The Roses)",
    "Evidovat přislíbené dary",
  ],
  merch: [
    "Připravit eshop (Shopify) a předobjednávky",
    "Najít flexibilní a levnou tiskárnu",
    "Spustit shop ~10. září, zavřít ~19. září",
    "Zorganizovat výdej merche na dvoře",
  ],
  bar: [
    "Postavit velký bar na dvoře",
    "Půjčit pípu a domluvit sudy (info u Rada)",
    "Připravit kasu na tabletech",
    "Udělat rozvrh směn za barem",
  ],
  kuchyn: [
    "Naplánovat, kdo a kdy vaří (ať nevaří jeden)",
    "Zajistit nákupy v Makru (a auto)",
    "Sehnat plotýnky, várnice a dost nádobí",
    "Zveřejňovat denní menu (obědy venku)",
  ],
  program: [
    "Naplánovat Vlaštovkiádu a Formát 400",
    "Připravit workshopy, dílny, promítání, fašák",
    "Zveřejnit denní program a sdílet s kantory",
  ],
  pruvod: [
    "Sepsat trasu průvodu ulici po ulici",
    "Zařídit povolení (odbor dopravy, min. 30 dní předem)",
    "Projít BKOM → DPMB → policie → kulturní akce",
    "Sehnat vesty, megafon a označit organizátory",
  ],
  fleda: [
    "Zamluvit Flédu co nejdřív a podepsat smlouvu",
    "Spustit prodej lístků (od půlky týdne)",
    "Den předem obalit podium fóliemi",
    "Naplánovat průběh křtu a hudební podkres",
  ],
  prvaci: [
    "Pozvat prváky už na zápisu (Forte/Doubravová)",
    "Připravit úvodní prezentaci první den (slot u Soni)",
    "Rozdat QR na instagram a zvát na program",
    "Připravit prváky na průvod a křest (najíst se)",
  ],
  foto: [
    "Sehnat fotografy na celý týden",
    "Zajistit focení průvodu a křtu na Flédě",
    "Archivovat materiály pro příští almanach",
  ],
};
