import type { Metadata } from "next";
import type { ReactNode } from "react";
import LegalLayout, { type LegalSection, type LegalMeta } from "@/components/LegalLayout";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { altLinks } from "@/i18n/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t(lang, "legal.terms"),
    description:
      "Obchodní podmínky společnosti EIKA ZNOJMO, a.s. – objednávky, ceny, dodání, platba, odstoupení od smlouvy a reklamace.",
    alternates: altLinks(lang, "/obchodni-podminky"),
  };
}

// Číslovaný odstavec (s červenou odrážkou jako na originále)
function Cl({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className="flex gap-2">
      <span className="text-[var(--color-accent)] font-medium shrink-0">{n}</span>
      <span>{children}</span>
    </p>
  );
}

export default async function TermsPage() {
  const lang = await getLang();

  const meta: LegalMeta[] = [
    { label: "Prodávající", value: "EIKA ZNOJMO, a.s." },
    { label: "Sídlo", value: "Evropská 6/41, Oblekovice, 671 81 Znojmo" },
    { label: "IČ / DIČ", value: "63490439 / CZ63490439" },
    { label: "Zápis v OR", value: "Krajský soud v Brně, oddíl B, vložka 1814" },
    { label: "Bankovní účet", value: "3691302 / 0800 (Česká spořitelna, a.s.)" },
    { label: "Kontakt", value: "eika@eika.cz · 515 244 662" },
    { label: "Účinnost od", value: "1. 1. 2024" },
  ];

  const sections: LegalSection[] = [
    {
      id: "uvod",
      title: "Úvodní ustanovení",
      body: (
        <>
          <Cl n="1.1">
            Tyto obchodní podmínky (dále jen „obchodní podmínky") obchodní společnosti EIKA ZNOJMO, a.s.,
            se sídlem Evropská 6/41, Oblekovice, 671 81 Znojmo, identifikační číslo: 63490439, zapsané
            v obchodním rejstříku vedeném u Krajského soudu v Brně, oddíl B, vložka 1814 (dále jen „prodávající")
            upravují v souladu s ustanovením § 1751 odst. 1 zákona č. 89/2012 Sb., občanský zákoník, ve znění
            pozdějších předpisů (dále jen „občanský zákoník") vzájemná práva a povinnosti smluvních stran vzniklé
            v souvislosti nebo na základě kupní smlouvy (dále jen „kupní smlouva") uzavírané mezi prodávajícím
            a spotřebitelem (dále jen „kupující") prostřednictvím internetového obchodu prodávajícího. Internetový
            obchod je prodávajícím provozován na webové stránce umístěné na internetové adrese www.eika.cz (dále jen
            „webová stránka"), a to prostřednictvím rozhraní webové stránky (dále jen „webové rozhraní obchodu").
          </Cl>
          <Cl n="1.2">
            Obchodní podmínky se nevztahují na případy, kdy osoba, která má v úmyslu nakoupit zboží od prodávajícího,
            je právnickou osobou či osobou, jež jedná při objednávání zboží v rámci své podnikatelské činnosti nebo
            v rámci svého samostatného výkonu povolání.
          </Cl>
          <Cl n="1.3">
            Ustanovení odchylná od obchodních podmínek je možné sjednat v kupní smlouvě. Odchylná ujednání v kupní
            smlouvě mají přednost před ustanoveními obchodních podmínek.
          </Cl>
          <Cl n="1.4">
            Ustanovení obchodních podmínek jsou nedílnou součástí kupní smlouvy. Kupní smlouva a obchodní podmínky
            jsou vyhotoveny v českém jazyce. Kupní smlouvu lze uzavřít v českém jazyce.
          </Cl>
          <Cl n="1.5">
            Znění obchodních podmínek může prodávající měnit či doplňovat. Tímto ustanovením nejsou dotčena práva
            a povinnosti vzniklá po dobu účinnosti předchozího znění obchodních podmínek.
          </Cl>
        </>
      ),
    },
    {
      id: "ucet",
      title: "Uživatelský účet",
      body: (
        <>
          <Cl n="2.1">
            Na základě registrace kupujícího provedené na webové stránce může kupující přistupovat do svého
            uživatelského rozhraní. Ze svého uživatelského rozhraní může kupující provádět objednávání zboží
            (dále jen „uživatelský účet"). V případě, že to webové rozhraní obchodu umožňuje, může kupující provádět
            objednávání zboží též bez registrace přímo z webového rozhraní obchodu.
          </Cl>
          <Cl n="2.2">
            Při registraci na webové stránce a při objednávání zboží je kupující povinen uvádět správně a pravdivě
            všechny údaje. Údaje uvedené v uživatelském účtu je kupující při jakékoliv jejich změně povinen aktualizovat.
            Údaje uvedené kupujícím v uživatelském účtu a při objednávání zboží jsou prodávajícím považovány za správné.
          </Cl>
          <Cl n="2.3">
            Přístup k uživatelskému účtu je zabezpečen uživatelským jménem a heslem. Kupující je povinen zachovávat
            mlčenlivost ohledně informací nezbytných k přístupu do jeho uživatelského účtu.
          </Cl>
          <Cl n="2.4">Kupující není oprávněn umožnit využívání uživatelského účtu třetím osobám.</Cl>
          <Cl n="2.5">
            Prodávající může zrušit uživatelský účet, a to zejména v případě, kdy kupující svůj uživatelský účet déle
            než 12 měsíců nevyužívá, či v případě, kdy kupující poruší své povinnosti z kupní smlouvy (včetně obchodních
            podmínek).
          </Cl>
          <Cl n="2.6">
            Kupující bere na vědomí, že uživatelský účet nemusí být dostupný nepřetržitě, a to zejména s ohledem na
            nutnou údržbu hardwarového a softwarového vybavení prodávajícího, popř. nutnou údržbu hardwarového
            a softwarového vybavení třetích osob.
          </Cl>
        </>
      ),
    },
    {
      id: "smlouva",
      title: "Uzavření kupní smlouvy",
      body: (
        <>
          <Cl n="3.1">
            Veškerá prezentace zboží umístěná ve webovém rozhraní obchodu je informativního charakteru a prodávající
            není povinen uzavřít kupní smlouvu ohledně tohoto zboží. Ustanovení § 1732 odst. 2 občanského zákoníku
            se nepoužije.
          </Cl>
          <Cl n="3.2">
            Webové rozhraní obchodu obsahuje informace o zboží, a to včetně uvedení cen jednotlivého zboží a nákladů
            za navrácení zboží, jestliže toto zboží ze své podstaty nemůže být navráceno obvyklou poštovní cestou.
            Ceny zboží jsou uvedeny včetně daně z přidané hodnoty a všech souvisejících poplatků. Ceny zboží zůstávají
            v platnosti po dobu, kdy jsou zobrazovány ve webovém rozhraní obchodu. Tímto ustanovením není omezena
            možnost prodávajícího uzavřít kupní smlouvu za individuálně sjednaných podmínek.
          </Cl>
          <Cl n="3.3">
            Webové rozhraní obchodu obsahuje také informace o nákladech spojených s balením a dodáním zboží. Informace
            o nákladech spojených s balením a dodáním zboží uvedené ve webovém rozhraní obchodu platí pouze v případech,
            kdy je zboží doručováno v rámci území České republiky běžnými kurýrními službami (PPL, Česká pošta).
          </Cl>
          <Cl n="3.4">
            Pro objednání zboží vyplní kupující objednávkový formulář ve webovém rozhraní obchodu. Objednávkový formulář
            obsahuje zejména informace o:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>objednávaném zboží (objednávané zboží „vloží" kupující do elektronického nákupního košíku webového rozhraní obchodu),</li>
              <li>způsobu úhrady kupní ceny zboží, údaje o požadovaném způsobu doručení objednávaného zboží a</li>
              <li>informace o nákladech spojených s dodáním zboží (dále společně jen jako „objednávka").</li>
            </ul>
          </Cl>
          <Cl n="3.5">
            Před zasláním objednávky prodávajícímu je kupujícímu umožněno zkontrolovat a měnit údaje, které do
            objednávky kupující vložil, a to i s ohledem na možnost kupujícího zjišťovat a opravovat chyby vzniklé
            při zadávání dat do objednávky. Objednávku odešle kupující prodávajícímu kliknutím na tlačítko „Odeslat
            objednávku zavazující k platbě" nebo „Závazně objednat". Údaje uvedené v objednávce jsou prodávajícím
            považovány za správné. Prodávající neprodleně po obdržení objednávky toto obdržení kupujícímu potvrdí
            elektronickou poštou, a to na adresu elektronické pošty kupujícího uvedenou v uživatelském účtu či
            v objednávce (dále jen „elektronická adresa kupujícího").
          </Cl>
          <Cl n="3.6">
            Prodávající je vždy oprávněn v závislosti na charakteru objednávky (množství zboží, výše kupní ceny,
            předpokládané náklady na dopravu) požádat kupujícího o dodatečné potvrzení objednávky (například písemně
            či telefonicky).
          </Cl>
          <Cl n="3.7">
            Smluvní vztah mezi prodávajícím a kupujícím vzniká doručením přijetí objednávky (akceptací), jež je
            prodávajícím zasláno kupujícímu elektronickou poštou, a to na adresu elektronické pošty kupujícího.
          </Cl>
          <Cl n="3.8">
            Kupující souhlasí s použitím komunikačních prostředků na dálku při uzavírání kupní smlouvy. Náklady vzniklé
            kupujícímu při použití komunikačních prostředků na dálku v souvislosti s uzavřením kupní smlouvy (náklady
            na internetové připojení, náklady na telefonní hovory) si hradí kupující sám, přičemž tyto náklady se neliší
            od základní sazby.
          </Cl>
        </>
      ),
    },
    {
      id: "cena",
      title: "Cena zboží a platební podmínky",
      body: (
        <>
          <Cl n="4.1">
            Cenu zboží a případné náklady spojené s dodáním zboží dle kupní smlouvy může kupující uhradit prodávajícímu
            podle povahy věci zejména následujícími způsoby:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>v hotovosti na dobírku v místě určeném kupujícím v objednávce;</li>
              <li>bezhotovostně převodem na účet prodávajícího č. 3691302 / 0800, vedený u společnosti Česká spořitelna a.s. (dále jen „účet prodávajícího");</li>
              <li>bezhotovostně platební kartou.</li>
            </ul>
          </Cl>
          <Cl n="4.2">
            Společně s kupní cenou je kupující povinen zaplatit prodávajícímu také náklady spojené s balením a dodáním
            zboží ve smluvené výši. Není-li uvedeno výslovně jinak, rozumí se dále kupní cenou i náklady spojené
            s dodáním zboží.
          </Cl>
          <Cl n="4.3">
            Prodávající nepožaduje od kupujícího zálohu či jinou obdobnou platbu. Tímto není dotčeno ustanovení čl. 4.6
            obchodních podmínek ohledně povinnosti uhradit kupní cenu zboží předem.
          </Cl>
          <Cl n="4.4">
            V případě platby v hotovosti či v případě platby na dobírku je kupní cena splatná při převzetí zboží.
            V případě bezhotovostní platby je kupní cena splatná do 5 dnů od uzavření kupní smlouvy.
          </Cl>
          <Cl n="4.5">
            V případě bezhotovostní platby je kupující povinen uhrazovat kupní cenu zboží společně s uvedením variabilního
            symbolu platby. V případě bezhotovostní platby je závazek kupujícího uhradit kupní cenu splněn okamžikem
            připsání příslušné částky na účet prodávajícího.
          </Cl>
          <Cl n="4.6">
            Prodávající je oprávněn, zejména v případě, že ze strany kupujícího nedojde k dodatečnému potvrzení objednávky
            (čl. 3.6), požadovat uhrazení celé kupní ceny ještě před odesláním zboží kupujícímu. Ustanovení § 2119
            odst. 1 občanského zákoníku se nepoužije.
          </Cl>
          <Cl n="4.7">
            Případné slevy z ceny zboží poskytnuté prodávajícím kupujícímu nelze vzájemně kombinovat.
          </Cl>
          <Cl n="4.8">
            Je-li to v obchodním styku obvyklé nebo je-li tak stanoveno obecně závaznými právními předpisy, vystaví
            prodávající ohledně plateb prováděných na základě kupní smlouvy kupujícímu daňový doklad – fakturu.
            Prodávající je plátcem daně z přidané hodnoty. Daňový doklad – fakturu vystaví prodávající kupujícímu
            po uhrazení ceny zboží a zašle jej v elektronické podobě na elektronickou adresu kupujícího.
          </Cl>
        </>
      ),
    },
    {
      id: "odstoupeni",
      title: "Odstoupení od kupní smlouvy",
      body: (
        <>
          <Cl n="5.1">
            Kupující bere na vědomí, že dle ustanovení § 1837 občanského zákoníku nelze mimo jiné odstoupit od kupní
            smlouvy o dodávce zboží, které bylo upraveno podle přání kupujícího nebo pro jeho osobu, od kupní smlouvy
            o dodávce zboží, které podléhá rychlé zkáze, jakož i zboží, které bylo po dodání nenávratně smíseno s jiným
            zbožím, od kupní smlouvy o dodávce zboží v uzavřeném obalu, které spotřebitel z obalu vyňal a z hygienických
            důvodů jej není možné vrátit a od kupní smlouvy o dodávce zvukové nebo obrazové nahrávky nebo počítačového
            programu, pokud porušil jejich původní obal.
          </Cl>
          <Cl n="5.2">
            Nejedná-li se o případ uvedený v čl. 5.1 obchodních podmínek či o jiný případ, kdy nelze od kupní smlouvy
            odstoupit, má kupující v souladu s ustanovením § 1829 odst. 1 občanského zákoníku v případě distančního
            prodeje nebo při uzavření smlouvy mimo obchodní prostory právo od kupní smlouvy odstoupit bez udání důvodu,
            a to do čtrnácti (14) dnů od převzetí zboží, přičemž v případě, že předmětem kupní smlouvy je několik druhů
            zboží nebo dodání několika částí, běží tato lhůta ode dne převzetí poslední dodávky zboží. Odstoupení od
            kupní smlouvy musí být prodávajícímu odesláno ve lhůtě uvedené v předchozí větě. Odstoupit od kupní smlouvy
            může kupující jakýmkoliv jednoznačným prohlášením adresovaným prodávajícímu prostřednictvím provozovatele
            poštovních služeb nebo prostřednictvím elektronické pošty. Pro odstoupení od kupní smlouvy může kupující
            využít vzorový formulář poskytovaný prodávajícím, jenž tvoří přílohu obchodních podmínek. Odstoupení od
            kupní smlouvy může kupující zasílat mimo jiné na adresu provozovny prodávajícího či na adresu elektronické
            pošty prodávajícího{" "}
            <a href="mailto:eika@eika.cz" className="font-semibold text-[var(--color-accent)]">eika@eika.cz</a>.
          </Cl>
          <Cl n="5.3">
            V případě odstoupení od kupní smlouvy dle čl. 5.2 obchodních podmínek se kupní smlouva od počátku ruší.
            Zboží musí být kupujícím prodávajícímu vráceno do čtrnácti (14) dnů od doručení odstoupení od kupní smlouvy
            prodávajícímu. Odstoupí-li kupující od kupní smlouvy, nese kupující náklady spojené s navrácením zboží
            prodávajícímu, a to i v tom případě, kdy zboží nemůže být vráceno pro svou povahu obvyklou poštovní cestou.
          </Cl>
          <Cl n="5.4">
            V případě odstoupení od kupní smlouvy dle čl. 5.2 obchodních podmínek vrátí prodávající peněžní prostředky
            přijaté od kupujícího do čtrnácti (14) dnů od odstoupení od kupní smlouvy kupujícím, a to stejným způsobem,
            jakým je prodávající od kupujícího přijal. Prodávající je taktéž oprávněn vrátit plnění poskytnuté kupujícím
            již při vrácení zboží kupujícím či jiným způsobem, pokud s tím kupující bude souhlasit a nevzniknou tím
            kupujícímu další náklady. Odstoupí-li kupující od kupní smlouvy, prodávající není povinen vrátit přijaté
            peněžní prostředky kupujícímu dříve, než mu kupující zboží vrátí nebo prokáže, že zboží prodávajícímu odeslal.
          </Cl>
          <Cl n="5.5">
            Nárok na úhradu škody vzniklé na zboží je prodávající oprávněn jednostranně započíst proti nároku kupujícího
            na vrácení kupní ceny.
          </Cl>
          <Cl n="5.6">
            V případech, kdy má kupující v souladu s ustanovením § 1829 odst. 1 občanského zákoníku právo od kupní smlouvy
            odstoupit, je prodávající také oprávněn kdykoliv od kupní smlouvy odstoupit, a to až do doby převzetí zboží
            kupujícím. V takovém případě vrátí prodávající kupujícímu kupní cenu bez zbytečného odkladu, a to bezhotovostně
            na účet určený kupujícím.
          </Cl>
          <Cl n="5.7">
            Je-li společně se zbožím poskytnut kupujícímu dárek, je darovací smlouva mezi prodávajícím a kupujícím uzavřena
            s rozvazovací podmínkou, že dojde-li k odstoupení od kupní smlouvy kupujícím, pozbývá darovací smlouva ohledně
            takového dárku účinnosti a kupující je povinen spolu se zbožím prodávajícímu vrátit i poskytnutý dárek.
          </Cl>
        </>
      ),
    },
    {
      id: "doprava",
      title: "Přeprava a dodání zboží",
      body: (
        <>
          <Cl n="6.1">
            V případě, že je způsob dopravy smluven na základě zvláštního požadavku kupujícího, nese kupující riziko
            a případné dodatečné náklady spojené s tímto způsobem dopravy.
          </Cl>
          <Cl n="6.2">
            Je-li prodávající podle kupní smlouvy povinen dodat zboží na místo určené kupujícím v objednávce, je kupující
            povinen převzít zboží při dodání.
          </Cl>
          <Cl n="6.3">
            V případě, že je z důvodů na straně kupujícího nutno zboží doručovat opakovaně nebo jiným způsobem, než bylo
            uvedeno v objednávce, je kupující povinen uhradit náklady spojené s opakovaným doručováním zboží, resp.
            náklady spojené s jiným způsobem doručení.
          </Cl>
          <Cl n="6.4">
            Při převzetí zboží od přepravce je kupující povinen zkontrolovat neporušenost obalů zboží a v případě
            jakýchkoliv závad toto neprodleně oznámit přepravci. V případě shledání porušení obalu svědčícího
            o neoprávněném vniknutí do zásilky nemusí kupující zásilku od přepravce převzít. Tímto nejsou dotčena práva
            kupujícího z odpovědnosti za vady zboží a další práva kupujícího vyplývající z obecně závazných právních předpisů.
          </Cl>
          <Cl n="6.5">
            Další práva a povinnosti stran při přepravě zboží mohou upravit zvláštní dodací podmínky prodávajícího,
            jsou-li prodávajícím vydány.
          </Cl>
        </>
      ),
    },
    {
      id: "vady",
      title: "Práva z vadného plnění – reklamace",
      body: (
        <>
          <Cl n="7.1">
            Práva a povinnosti smluvních stran ohledně práv z vadného plnění se řídí příslušnými obecně závaznými
            právními předpisy (zejména ustanoveními § 1914 až 1925, § 2099 až 2117 a § 2161 až 2174 občanského zákoníku
            a zákonem č. 634/1992 Sb., o ochraně spotřebitele, ve znění pozdějších předpisů).
          </Cl>
          <Cl n="7.2">
            Prodávající odpovídá kupujícímu, že zboží při převzetí nemá vady. Zejména prodávající odpovídá kupujícímu,
            že v době, kdy kupující zboží převzal:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>má zboží vlastnosti, které si strany ujednaly, a chybí-li ujednání, má takové vlastnosti, které prodávající nebo výrobce popsal nebo které kupující očekával s ohledem na povahu zboží a na základě reklamy jimi prováděné,</li>
              <li>se zboží hodí k účelu, který pro jeho použití prodávající uvádí nebo ke kterému se zboží tohoto druhu obvykle používá,</li>
              <li>zboží odpovídá jakostí nebo provedením smluvenému vzorku nebo předloze, byla-li jakost nebo provedení určeno podle smluveného vzorku nebo předlohy,</li>
              <li>je zboží v odpovídajícím množství, míře nebo hmotnosti a</li>
              <li>zboží vyhovuje požadavkům právních předpisů.</li>
            </ul>
          </Cl>
          <Cl n="7.3">
            Strana kupující je oprávněna uplatnit právo z vady, která se na zboží projeví v době 24 měsíců od převzetí
            zboží. Projeví-li se vada v průběhu jednoho roku od převzetí, má se za to, že zboží bylo vadné již při
            převzetí, ledaže to povaha věci nebo vady vylučuje. Jedná se o vyvratitelnou právní domněnku.
          </Cl>
          <Cl n="7.4">
            Prodávající má povinnosti z vadného plnění nejméně v takovém rozsahu, v jakém trvají povinnosti z vadného
            plnění výrobce. Kupující je jinak oprávněn uplatnit právo z vady, která se vyskytne u spotřebního zboží
            v době dvaceti čtyř měsíců od převzetí (jedná se o tzv. lhůtu k uplatnění práva z vadného plnění). Vytkl-li
            kupující prodávajícímu vadu zboží oprávněně, neběží lhůta pro uplatnění práv z vadného plnění ani záruční
            doba po dobu, po kterou kupující nemůže vadné zboží užívat.
          </Cl>
          <Cl n="7.5">
            Ustanovení uvedená v čl. 7.4 obchodních podmínek se nepoužijí u zboží prodávaného za nižší cenu na vadu,
            pro kterou byla nižší cena ujednána, na opotřebení zboží způsobené jeho obvyklým užíváním, u použitého zboží
            na vadu odpovídající míře používání nebo opotřebení, kterou zboží mělo při převzetí kupujícím, nebo vyplývá-li
            to z povahy zboží. Právo z vadného plnění kupujícímu nenáleží, pokud kupující před převzetím zboží věděl,
            že zboží má vadu, anebo pokud kupující vadu sám způsobil.
          </Cl>
          <Cl n="7.6">
            Práva z odpovědnosti za vady zboží se uplatňují u prodávajícího. Je-li však v potvrzení vydaném prodávajícím
            ohledně rozsahu práv z odpovědnosti za vady (ve smyslu ustanovení § 2166 občanského zákoníku) uvedena jiná
            osoba určená k opravě, která je v místě prodávajícího nebo v místě pro kupujícího bližším, uplatní kupující
            právo na opravu u toho, kdo je určen k provedení opravy. S výjimkou případů, kdy je k provedení opravy určena
            jiná osoba podle předchozí věty, je prodávající povinen přijmout reklamaci v kterékoli provozovně, v níž je
            přijetí reklamace možné s ohledem na sortiment prodávaných výrobků nebo poskytovaných služeb, případně
            i v sídle nebo místě podnikání prodávajícího. Prodávající je povinen kupujícímu vydat písemné potvrzení o tom,
            kdy kupující právo uplatnil, co je obsahem reklamace a jaký způsob vyřízení reklamace kupující požaduje;
            a dále potvrzení o datu a způsobu vyřízení reklamace, včetně potvrzení o provedení opravy a době jejího trvání,
            případně písemné odůvodnění zamítnutí reklamace. Tato povinnost se vztahuje i na jiné osoby určené prodávajícím
            k provedení opravy.
          </Cl>
          <Cl n="7.7">
            Práva z odpovědnosti za vady zboží může kupující konkrétně uplatnit zejména osobně na adrese EIKA ZNOJMO, a.s.,
            Evropská 6/41, 671 81 Znojmo - Oblekovice, telefonicky na čísle{" "}
            <a href="tel:+420515244662" className="font-semibold text-[var(--color-accent)]">515 244 662</a> či elektronickou
            poštou na adrese <a href="mailto:eika@eika.cz" className="font-semibold text-[var(--color-accent)]">eika@eika.cz</a>.
          </Cl>
          <Cl n="7.8">
            Kupující sdělí prodávajícímu, jaké právo si zvolil, při oznámení vady, nebo bez zbytečného odkladu po oznámení
            vady. Provedenou volbu nemůže kupující změnit bez souhlasu prodávajícího; to neplatí, žádal-li kupující opravu
            vady, která se ukáže jako neopravitelná nebo by zvolená varianta práva z odpovědnosti za vady byla nemožná.
          </Cl>
          <Cl n="7.9">
            Nemá-li zboží vlastnosti stanovené v čl. 7.2 obchodních podmínek, může kupující požadovat i dodání nového zboží
            bez vad, pokud to není vzhledem k povaze vady nepřiměřené, ale pokud se vada týká pouze součásti zboží, může
            kupující požadovat jen výměnu součásti; není-li to možné, může odstoupit od smlouvy. Je-li to však vzhledem
            k povaze vady neúměrné, zejména lze-li vadu odstranit bez zbytečného odkladu, má kupující právo na bezplatné
            odstranění vady. Právo na dodání nového zboží, nebo výměnu součásti má kupující i v případě odstranitelné vady,
            pokud nemůže zboží řádně užívat pro opakovaný výskyt vady po opravě nebo pro větší počet vad. V takovém případě
            má kupující i právo od smlouvy odstoupit. Neodstoupí-li kupující od smlouvy nebo neuplatní-li právo na dodání
            nového zboží bez vad, na výměnu jeho součásti nebo na opravu zboží, může požadovat přiměřenou slevu. Kupující
            má právo na přiměřenou slevu i v případě, že mu prodávající nemůže dodat nové zboží bez vad, vyměnit jeho
            součást nebo zboží opravit, jakož i v případě, že prodávající nezjedná nápravu v přiměřené době nebo že by
            zjednání nápravy kupujícímu působilo značné obtíže.
          </Cl>
          <Cl n="7.10">
            Kdo má právo podle § 1923 občanského zákoníku, náleží mu i náhrada nákladů účelně vynaložených při uplatnění
            tohoto práva. Neuplatní-li však právo na náhradu do jednoho měsíce po uplynutí lhůty, ve které je třeba
            vytknout vadu, soud právo nepřizná, pokud prodávající namítne, že právo na náhradu nebylo uplatněno včas.
          </Cl>
          <Cl n="7.11">
            Další práva a povinnosti stran související s odpovědností prodávajícího za vady může upravit reklamační řád
            prodávajícího.
          </Cl>
        </>
      ),
    },
    {
      id: "dalsi-prava",
      title: "Další práva a povinnosti smluvních stran",
      body: (
        <>
          <Cl n="8.1">Kupující nabývá vlastnictví ke zboží zaplacením celé kupní ceny zboží.</Cl>
          <Cl n="8.2">
            Vyřizování stížností spotřebitelů zajišťuje prodávající prostřednictvím elektronické adresy{" "}
            <a href="mailto:eika@eika.cz" className="font-semibold text-[var(--color-accent)]">eika@eika.cz</a>. Informaci
            o vyřízení stížnosti kupujícího zašle prodávající na elektronickou adresu kupujícího.
          </Cl>
          <Cl n="8.3">
            K mimosoudnímu řešení spotřebitelských sporů z kupní smlouvy je příslušná Česká obchodní inspekce, se sídlem
            Štěpánská 567/15, 120 00 Praha 2, IČ: 000 20 869, internetová adresa:{" "}
            <a href="https://adr.coi.cz/cs" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--color-accent)]">https://adr.coi.cz/cs</a>.
            Platformu pro řešení sporů on-line nacházející se na internetové adrese{" "}
            <a href="http://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--color-accent)]">http://ec.europa.eu/consumers/odr</a>{" "}
            je možné využít při řešení sporů mezi prodávajícím a kupujícím z kupní smlouvy.
          </Cl>
          <Cl n="8.4">
            Evropské spotřebitelské centrum Česká republika, se sídlem Štěpánská 567/15, 120 00 Praha 2, internetová adresa:{" "}
            <a href="http://www.evropskyspotrebitel.cz" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--color-accent)]">http://www.evropskyspotrebitel.cz</a>{" "}
            je kontaktním místem podle Nařízení Evropského parlamentu a Rady (EU) č. 524/2013 ze dne 21. května 2013
            o řešení spotřebitelských sporů on-line a o změně nařízení (ES) č. 2006/2004 a směrnice 2009/22/ES (nařízení
            o řešení spotřebitelských sporů on-line).
          </Cl>
          <Cl n="8.5">
            Prodávající je oprávněn k prodeji zboží na základě živnostenského oprávnění. Živnostenskou kontrolu provádí
            v rámci své působnosti příslušný živnostenský úřad. Dozor nad oblastí ochrany osobních údajů vykonává Úřad
            pro ochranu osobních údajů. Česká obchodní inspekce vykonává ve vymezeném rozsahu mimo jiné dozor nad
            dodržováním zákona č. 634/1992 Sb., o ochraně spotřebitele, ve znění pozdějších předpisů.
          </Cl>
          <Cl n="8.6">
            Kupující tímto přebírá na sebe nebezpečí změny okolností ve smyslu § 1765 odst. 2 občanského zákoníku.
          </Cl>
        </>
      ),
    },
    {
      id: "osobni-udaje",
      title: "Ochrana osobních údajů",
      body: (
        <Cl n="9.1">
          Svou informační povinnost vůči kupujícímu ve smyslu čl. 13 Nařízení Evropského parlamentu a Rady 2016/679
          o ochraně fyzických osob v souvislosti se zpracováním osobních údajů a o volném pohybu těchto údajů a o zrušení
          směrnice 95/46/ES (obecné nařízení o ochraně osobních údajů) (dále jen „nařízení GDPR") související se zpracováním
          osobních údajů kupujícího pro účely plnění kupní smlouvy, pro účely jednání o kupní smlouvě a pro účely plnění
          veřejnoprávních povinností prodávajícího plní prodávající prostřednictvím{" "}
          <a href="/ochrana-osobnich-udaju" className="font-semibold text-[var(--color-accent)]">zvláštního dokumentu</a>.
        </Cl>
      ),
    },
    {
      id: "obchodni-sdeleni",
      title: "Zasílání obchodních sdělení a ukládání cookies",
      body: (
        <>
          <Cl n="10.1">
            Kupující souhlasí ve smyslu ustanovení § 7 odst. 2 zákona č. 480/2004 Sb., o některých službách informační
            společnosti a o změně některých zákonů (zákon o některých službách informační společnosti), ve znění pozdějších
            předpisů, se zasíláním obchodních sdělení prodávajícím na elektronickou adresu či na telefonní číslo kupujícího.
            Svou informační povinnost vůči kupujícímu ve smyslu čl. 13 nařízení GDPR související se zpracováním osobních
            údajů kupujícího pro účely zasílání obchodních sdělení plní prodávající prostřednictvím zvláštního dokumentu.
          </Cl>
          <Cl n="10.2">
            Kupující souhlasí s ukládáním tzv. cookies na jeho počítač. V případě, že je nákup na webové stránce možné
            provést a závazky prodávajícího z kupní smlouvy plnit, aniž by docházelo k ukládání tzv. cookies na počítač
            kupujícího, může kupující souhlas podle předchozí věty kdykoliv odvolat.
          </Cl>
        </>
      ),
    },
    {
      id: "dorucovani",
      title: "Doručování",
      body: <Cl n="11.1">Kupujícímu může být doručováno na elektronickou adresu kupujícího.</Cl>,
    },
    {
      id: "zaverecna",
      title: "Závěrečná ustanovení",
      body: (
        <>
          <Cl n="12.1">
            Pokud vztah založený kupní smlouvou obsahuje mezinárodní (zahraniční) prvek, pak strany sjednávají, že vztah
            se řídí českým právem. Volbou práva podle předchozí věty není kupující, který je spotřebitelem, zbaven ochrany,
            kterou mu poskytují ustanovení právního řádu, od nichž se nelze smluvně odchýlit, a jež by se v případě
            neexistence volby práva jinak použila dle ustanovení čl. 6 odst. 1 Nařízení Evropského parlamentu a Rady (ES)
            č. 593/2008 ze dne 17. června 2008 o právu rozhodném pro smluvní závazkové vztahy (Řím I).
          </Cl>
          <Cl n="12.2">
            Je-li některé ustanovení obchodních podmínek neplatné nebo neúčinné, nebo se takovým stane, namísto neplatných
            ustanovení nastoupí ustanovení, jehož smysl se neplatnému ustanovení co nejvíce přibližuje. Neplatností nebo
            neúčinností jednoho ustanovení není dotčena platnost ostatních ustanovení.
          </Cl>
          <Cl n="12.3">
            Kupní smlouva včetně obchodních podmínek je archivována prodávajícím v elektronické podobě a není přístupná.
          </Cl>
          <Cl n="12.4">Přílohu obchodních podmínek tvoří vzorový formulář pro odstoupení od kupní smlouvy.</Cl>
          <Cl n="12.5">
            Kontaktní údaje prodávajícího: adresa pro doručování EIKA ZNOJMO, a.s., Evropská 6/41, 671 81 Znojmo - Oblekovice,
            adresa elektronické pošty eika@eika.cz, telefon 515 244 662.
          </Cl>
        </>
      ),
    },
  ];

  const appendices: LegalSection[] = [
    {
      id: "formular-odstoupeni",
      title: "Příloha: Vzorový formulář pro odstoupení od smlouvy",
      body: (
        <>
          <p>
            Vzorový formulář pro odstoupení od smlouvy podle Nařízení vlády č. 29/2023 Sb., o vzorovém poučení o právu
            na odstoupení od smluv uzavřených distančním způsobem nebo mimo obchodní prostory a vzorovém formuláři pro
            odstoupení od těchto smluv. Vyplňte tento formulář a pošlete jej zpět pouze v případě, že chcete odstoupit
            od smlouvy.
          </p>
          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 space-y-3">
            <p className="font-semibold text-[var(--color-ink)]">Oznámení o odstoupení od smlouvy</p>
            <p>Adresát (jméno a příjmení, bydliště, telefonní číslo a e-mailovou adresu):</p>
            <p className="text-[var(--color-ink)]">
              EIKA ZNOJMO, a.s.<br />
              Evropská 6/41, Oblekovice, 671 81 Znojmo<br />
              eika@eika.cz<br />
              telefon 515 244 662
            </p>
            <p>– Oznamuji, že tímto odstupuji od smlouvy č. ________ o nákupu tohoto zboží: ________________________</p>
            <p>– Datum objednání ____________ / datum obdržení ____________</p>
            <p>– Jméno a příjmení spotřebitele: ____________________________</p>
            <p>– Adresa spotřebitele: ____________________________</p>
            <p>– Telefon: ____________  – Email: ____________  – Číslo účtu: ____________</p>
            <p>– Datum: ____________</p>
            <p>– Podpis spotřebitele (pouze pokud je tento formulář zasílán v listinné podobě): ____________</p>
          </div>
        </>
      ),
    },
  ];

  return (
    <LegalLayout
      eyebrow="Podmínky"
      title={t(lang, "legal.terms")}
      home={t(lang, "crumb.home")}
      meta={meta}
      sections={sections}
      appendices={appendices}
      effectiveNote="Ve Znojmě dne 1. 1. 2024"
    />
  );
}
