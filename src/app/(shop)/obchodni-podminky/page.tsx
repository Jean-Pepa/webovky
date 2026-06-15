import type { Metadata } from "next";
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

export default async function TermsPage() {
  const lang = await getLang();

  const meta: LegalMeta[] = [
    { label: "Prodávající", value: "EIKA ZNOJMO, a.s." },
    { label: "Sídlo", value: "Evropská 6/41, Oblekovice, 671 81 Znojmo" },
    { label: "IČ / DIČ", value: "63490439 / CZ63490439" },
    { label: "Zápis v OR", value: "Krajský soud v Brně, oddíl B, vložka 1814" },
    { label: "Bankovní účet", value: "3691302 / 0800 (Česká spořitelna, a.s.)" },
    { label: "Kontakt", value: "eika@eika.cz · 515 244 662" },
    { label: "Účinnost od", value: "15. 6. 2026" },
  ];

  const sections: LegalSection[] = [
    {
      id: "uvod",
      title: "Úvodní ustanovení",
      body: (
        <p>
          Tyto obchodní podmínky upravují vzájemná práva a povinnosti mezi společností EIKA ZNOJMO, a.s.
          (dále jen „prodávající") a kupujícím při prodeji zboží. Podmínky se vztahují na firmy, živnostníky
          i spotřebitele; odlišnosti pro spotřebitele jsou v textu výslovně uvedeny.
        </p>
      ),
    },
    {
      id: "objednavka",
      title: "Objednávka a uzavření smlouvy",
      body: (
        <p>
          Objednávku lze podat přes web (košík), poptávkový formulář, e-mailem nebo osobně na pobočce.
          Kupní smlouva vzniká potvrzením objednávky ze strany prodávajícího. Ceny v online katalogu jsou
          orientační; závazná cena je potvrzena v nabídce nebo potvrzení objednávky.
        </p>
      ),
    },
    {
      id: "ceny",
      title: "Ceny a platební podmínky",
      body: (
        <p>
          Ceny jsou uváděny bez DPH i s DPH. Pro firmy a živnostníky platí individuální velkoobchodní ceny.
          Platbu lze provést převodem na základě faktury, hotově nebo kartou na pobočce. U nových zákazníků
          může být vyžadována platba předem.
        </p>
      ),
    },
    {
      id: "dodani",
      title: "Dodání zboží",
      body: (
        <p>
          Zboží je možné odebrat osobně na pobočkách Brno a Znojmo, nebo zajistíme dopravu na dohodnuté místo.
          Dodací lhůta závisí na dostupnosti a je upřesněna při potvrzení objednávky. Nebezpečí škody na zboží
          přechází na kupujícího převzetím zboží.
        </p>
      ),
    },
    {
      id: "odstoupeni",
      title: "Odstoupení od smlouvy (spotřebitel)",
      body: (
        <p>
          Spotřebitel má právo odstoupit od smlouvy uzavřené distančním způsobem do 14 dnů od převzetí zboží
          bez udání důvodu. Toto právo se nevztahuje na zboží upravené na míru (např. dělení a řezání materiálu
          dle požadavku zákazníka). Pro odstoupení nás kontaktujte na eika@eika.cz.
        </p>
      ),
    },
    {
      id: "reklamace",
      title: "Reklamace a záruka",
      body: (
        <p>
          Práva z vadného plnění a záruka se řídí občanským zákoníkem. Reklamaci uplatněte bez zbytečného
          odkladu na pobočce nebo e-mailem; přiložte doklad o koupi a popis vady. Reklamaci vyřídíme v zákonné
          lhůtě.
        </p>
      ),
    },
    {
      id: "zaverecna",
      title: "Závěrečná ustanovení",
      body: (
        <p>
          Vztahy neupravené těmito podmínkami se řídí právním řádem České republiky. Případné spory se snažíme
          řešit smírně; spotřebitel se může obrátit na Českou obchodní inspekci (coi.cz) jako subjekt mimosoudního
          řešení spotřebitelských sporů. Tyto podmínky můžeme aktualizovat, rozhodující je znění platné v den
          objednávky.
        </p>
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
    />
  );
}
