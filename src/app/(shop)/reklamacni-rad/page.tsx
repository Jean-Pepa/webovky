import type { Metadata } from "next";
import LegalLayout, { type LegalSection, type LegalMeta } from "@/components/LegalLayout";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { altLinks } from "@/i18n/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t(lang, "legal.complaints"),
    description:
      "Reklamační řád společnosti EIKA ZNOJMO, a.s. – práva z vadného plnění, průběh reklamace, lhůty a reklamační formulář.",
    alternates: altLinks(lang, "/reklamacni-rad"),
  };
}

export default async function ComplaintsPage() {
  const lang = await getLang();

  const meta: LegalMeta[] = [
    { label: "Prodávající", value: "EIKA ZNOJMO, a.s." },
    { label: "Sídlo", value: "Evropská 6/41, Oblekovice, 671 81 Znojmo" },
    { label: "IČ", value: "63490439" },
    { label: "Reklamace", value: "eika@eika.cz · 515 244 662 · SMS 731 463 520" },
    { label: "Účinnost od", value: "1. 1. 2024" },
  ];

  const sections: LegalSection[] = [
    {
      id: "uvod",
      title: "Úvodní ustanovení",
      body: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Společnost EIKA ZNOJMO, a.s., IČ: 63490439, se sídlem Evropská 6/41, Oblekovice, 671 81 Znojmo (dále také
            jako „prodávající") vydává tímto Reklamační řád, který upravuje základní vzájemná práva a povinnosti
            kupujícího v souvislosti s uplatněním práv z vadného plnění (reklamace) při uzavírání kupních smluv pomocí
            prostředků komunikace na dálku, zejména prostřednictvím webového rozhraní internetového obchodu na adrese
            www.eika.cz, či v některé z kamenných prodejen prodávajícího.
          </li>
          <li>
            Práva a povinnosti neupravené tímto reklamačním řádem se řídí obchodními podmínkami a dále platnými právními
            předpisy České republiky. Strana kupující je povinna se seznámit s tímto reklamačním řádem ještě před koupí zboží.
          </li>
          <li>
            Tento reklamační řád se vztahuje pouze na prodej zboží straně kupující, která je spotřebitelem, pokud není
            mezi stranami dohodnuto jinak, nebo z jednotlivých ustanovení tohoto reklamačního řádu nevyplývá něco jiného.
          </li>
        </ul>
      ),
    },
    {
      id: "prava-z-vad",
      title: "Práva z vadného plnění (reklamace)",
      body: (
        <>
          <ul className="list-disc pl-5 space-y-2">
            <li>Strana kupující je oprávněna uplatnit právo z vady, která se na zboží projeví v době 24 měsíců od převzetí zboží.</li>
            <li>
              Prodávající odpovídá straně kupující, že zboží při převzetí nemá vady. Projeví-li se vada v průběhu jednoho
              roku od převzetí, má se za to, že zboží bylo vadné již při převzetí, jedná se tedy o vyvratitelnou právní domněnku.
            </li>
            <li>
              V případě, že je reklamace oprávněná, má strana kupující právo na bezplatnou opravu zboží, pokud lze vadu
              odstranit, případně má strana kupující nárok na dodání nového zboží bez vad, pokud se jedná o vadu
              neodstranitelnou. Pokud se vada týká pouze součásti věci, může strana kupující požadovat jen výměnu součásti;
              není-li možné postupovat ani jedním z výše uvedených způsobů, může odstoupit od smlouvy a požadovat vrácení
              kupní ceny v plné výši.
            </li>
            <li>
              Právo na dodání nového zboží, nebo výměnu součásti má strana kupující i v případě odstranitelné vady, pokud
              nemůže zboží řádně užívat pro opakovaný výskyt vady po opravě nebo pro větší počet vad. V takovém případě má
              strana kupující i právo od kupní smlouvy odstoupit.
            </li>
            <li>
              Neodstoupí-li strana kupující od smlouvy nebo neuplatní-li právo na dodání nového zboží bez vad, na výměnu
              jeho součásti nebo na opravu, může požadovat přiměřenou slevu z kupní ceny. Strana kupující má právo na
              přiměřenou slevu i v případě, že jí prodávající nemůže dodat nové zboží bez vad, vyměnit jeho součást nebo
              zboží opravit, jakož i v případě, že prodávající nezjedná nápravu v přiměřené době nebo že by zjednání
              nápravy kupujícímu působilo značné obtíže.
            </li>
            <li>
              V případě, že je reklamace oprávněná, neběží lhůta pro uplatnění práv z vadného plnění po dobu, po kterou
              strana kupující nemůže vadné zboží užívat. Právo z vadného plnění straně kupující nenáleží zejména, pokud
              strana kupující před převzetím věci věděla, že věc má vadu, anebo pokud strana kupující vadu sama způsobila.
            </li>
          </ul>
          <p className="mt-3">Nárok na uplatnění práva z vadného plnění zaniká v případě:</p>
          <ul className="mt-1 list-disc pl-5 space-y-1">
            <li>opotřebení věci jejím obvyklým užíváním nebo vyplývá-li to z povahy věci,</li>
            <li>existuje-li vada již v době převzetí a pro takovou vadu je sjednána sleva z kupní ceny,</li>
            <li>jde-li o zboží použité a vada odpovídá míře používání nebo opotřebení, které mělo zboží při převzetí stranou kupující,</li>
            <li>neodbornou manipulací a používáním v rozporu s návodem či uživatelskou příručkou,</li>
            <li>poškození živly (např. voda, oheň či blesk apod.) a vyšší mocí,</li>
            <li>poškození nadměrným zatěžováním,</li>
            <li>poškození zboží při přepravě (tato reklamace se řeší přímo s dopravcem),</li>
            <li>mechanickým poškozením zboží,</li>
            <li>zboží, které bylo upravováno zákazníkem (nátěry, ohýbání atd.), vznikla-li vada v důsledku této úpravy.</li>
          </ul>
          <p className="mt-3">
            Strana kupující bere na vědomí, že pokud je zboží dodáváno přepravcem, je strana kupující povinna zkontrolovat
            před potvrzením převzetí nepoškozenost obalu zásilky, lepicích pásek a v případě pochybností, že zásilka
            vykazuje vady, má strana kupující právo odmítnout převzetí neúplné nebo poškozené zásilky.
          </p>
        </>
      ),
    },
    {
      id: "prubeh",
      title: "Průběh reklamace",
      body: (
        <>
          <p>
            Strana kupující je povinna uplatnit práva z vadného plnění bez zbytečného odkladu poté, kdy měla možnost zboží
            prohlédnout a mohla vadu při dostatečné péči zjistit, a to buď označením vady, nebo oznámením, jak se projevuje;
            v opačném případě jí nemusí být právo z vadného plnění přiznáno. Strana kupující je zejména povinna před podpisem
            dodacího listu zboží řádně prohlédnout, zda nemá vady.
          </p>
          <p className="mt-3">Strana kupující má právo uplatnit reklamaci u prodávajícího, a to:</p>
          <ul className="mt-1 list-disc pl-5 space-y-1">
            <li>poštou na adresu: Evropská 6/41, Oblekovice, 671 81 Znojmo,</li>
            <li>e-mailem na adresu: <a href="mailto:eika@eika.cz" className="font-semibold text-[var(--color-accent)]">eika@eika.cz</a>,</li>
            <li>osobně na adrese: Evropská 6/41, Oblekovice, 671 81 Znojmo,</li>
            <li>pomocí SMS zprávy na tel. č.: <a href="tel:+420731463520" className="font-semibold text-[var(--color-accent)]">731 463 520</a>.</li>
          </ul>
          <p className="mt-3">Strana kupující je povinna při podávání reklamace zejména doložit a dodat:</p>
          <ul className="mt-1 list-disc pl-5 space-y-1">
            <li>doklad o prodeji zboží (daňový doklad, faktura),</li>
            <li>dodat straně prodávající reklamované zboží včetně veškerého příslušenství,</li>
            <li>podrobný popis závady.</li>
          </ul>
          <p className="mt-3">
            Reklamované zboží by mělo být důkladně zabezpečeno, aby nedošlo v průběhu přepravy k jeho poškození, balík by
            měl být označen viditelně „REKLAMACE" a obsahovat: reklamované zboží (včetně kompletního příslušenství),
            doporučujeme přiložit kopii nákupního dokladu, podrobný popis závady a dostatečné kontaktní údaje kupujícího
            (zejm. zpáteční adresa a tel. číslo). Bez výše uvedeného je znemožněna identifikace původu i závady zboží.
          </p>
          <p className="mt-3">
            Prodávající nebo jím pověřený pracovník je povinen o reklamaci rozhodnout ihned, ve složitějších případech do
            3 pracovních dnů. Do této lhůty se nezapočítává doba potřebná k odbornému posouzení vady. V provozovně
            prodávajícího je straně kupující vyhotoven doklad o přijetí zboží do reklamace, kde bude uvedeno zejména datum
            uplatnění reklamace, místo a důvod a způsob vyřízení. V případech, kdy je reklamované zboží doručeno prodávajícímu
            přepravcem, tedy nikoliv osobně v provozovně prodávajícího, pak takový doklad bude vyhotoven a zaslán straně
            kupující do e-mailové schránky, kterou sdělí strana kupující prodávajícímu, pokud se strany nedohodnou jinak.
          </p>
          <p className="mt-3">
            Strana kupující sdělí prodávajícímu, jaké právo si zvolila při oznámení vady, nebo bez zbytečného odkladu po
            oznámení vady. Provedenou volbu nemůže strana kupující změnit bez souhlasu prodávajícího, vyjma situace, kdy
            strana kupující žádá opravu vady, která se ukáže jako neopravitelná. Neodstraní-li prodávající vady v přiměřené
            lhůtě či oznámí-li straně kupující, že vady neodstraní, může strana kupující požadovat místo odstranění vady
            přiměřenou slevu z kupní ceny, nebo může od smlouvy odstoupit, pokud se strany nedohodnou na jiném postupu.
          </p>
          <p className="mt-3">
            Reklamace včetně odstranění vady musí být vyřízena bez zbytečného odkladu, nejpozději do 30 dnů ode dne uplatnění
            reklamace, pokud se prodávající se stranou kupující nedohodne jinak na delší lhůtě. Po marném uplynutí lhůty dle
            předešlé věty může strana kupující od smlouvy odstoupit nebo požadovat přiměřenou slevu.
          </p>
          <p className="mt-3">
            V případě nevyzvednutí reklamovaného zboží do jednoho měsíce od uplynutí doby, kdy měla být reklamace provedena,
            a byla-li provedena později, do jednoho měsíce od vyrozumění o jejím provedení (tj. zpravidla do 60 dnů od data
            podání reklamace) je prodávající oprávněn účtovat při výdeji reklamace částku za uskladnění.
          </p>
        </>
      ),
    },
    {
      id: "nepodnikatel",
      title: "Zvláštní ustanovení o reklamaci zboží kupujícím, který není spotřebitelem",
      body: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Jedná-li strana kupující při uzavření kupní smlouvy v rámci své podnikatelské činnosti (resp. není-li strana
            kupující spotřebitelem), činí lhůta k uplatnění práv z vadného plnění u zboží 12 měsíců od převzetí zboží
            kupujícím, přičemž musí doložit a prokázat takové vadné plnění, pokud není mezi prodávajícím a stranou kupující
            dohodnuto jinak.
          </li>
          <li>
            V případě, že strana kupující není spotřebitelem, neuplatní se lhůty dle tohoto reklamačního řádu, ale prodávající
            se zavazuje reklamace řešit v co nejkratší možné lhůtě s ohledem na odborné posouzení zboží prodávajícím nebo
            výrobcem.
          </li>
        </ul>
      ),
    },
    {
      id: "zaverecna",
      title: "Závěrečná ustanovení",
      body: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Strana kupující, která je spotřebitelem, má právo na mimosoudní řešení případných sporů ze smlouvy s prodávajícím
            v souladu s § 20d a násl. zákona č. 634/1992 Sb., o ochraně spotřebitele, ve znění pozdějších předpisů, a to
            prostřednictvím České obchodní inspekce (
            <a href="https://adr.coi.cz/cs" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--color-accent)]">coi.cz</a>).
          </li>
          <li>
            Pro uplatnění reklamace může strana kupující využít vzor, který tvoří přílohu tohoto reklamačního řádu a je
            v interaktivní elektronické podobě k dispozici rovněž na webových stránkách prodávajícího www.eika.cz a v listinné
            podobě v provozovně prodávajícího.
          </li>
          <li>Tento reklamační řád nabývá platnosti a účinnosti dne 1. 1. 2024.</li>
        </ul>
      ),
    },
  ];

  const appendices: LegalSection[] = [
    {
      id: "reklamacni-list",
      title: "Příloha: Vzorový formulář pro uplatnění reklamace (reklamační list)",
      body: (
        <>
          <p>
            Vyplňte tento formulář a pošlete jej společnosti EIKA ZNOJMO, a.s., IČ: 63490439, se sídlem Evropská 6/41,
            Oblekovice, 671 81 Znojmo, v případě, že chcete uplatnit právo z vadného plnění.
          </p>
          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 space-y-3">
            <p>
              <span className="font-semibold text-[var(--color-ink)]">Adresát:</span> EIKA ZNOJMO, a.s., IČ: 63490439,
              se sídlem Evropská 6/41, Oblekovice, 671 81 Znojmo
            </p>
            <p className="font-semibold text-[var(--color-ink)]">Kupující:</p>
            <p>Jméno a příjmení: ____________________________</p>
            <p>Adresa: ____________________________</p>
            <p>Telefon: ____________  Email: ____________  Číslo účtu: ____________</p>
            <p className="font-semibold text-[var(--color-ink)] pt-2">Reklamované zboží:</p>
            <p>Označení zboží: ____________  Číslo dokladu: ____________</p>
            <p>Číslo objednávky: ____________  Datum prodeje: ____________</p>
            <p>Popis závady: ____________________________</p>
            <p>Obsah balení při předání do reklamačního řízení: ____________________________</p>
            <p className="pt-1">Preferovaný způsob vyřízení reklamace: 1. oprava · 2. výměna · 3. sleva · 4. odstoupení od smlouvy</p>
            <p>Datum: ____________  Podpis: ____________</p>
          </div>
        </>
      ),
    },
  ];

  return (
    <LegalLayout
      eyebrow="Reklamace"
      title={t(lang, "legal.complaints")}
      home={t(lang, "crumb.home")}
      meta={meta}
      sections={sections}
      appendices={appendices}
      effectiveNote="Ve Znojmě dne 1. 1. 2024"
    />
  );
}
