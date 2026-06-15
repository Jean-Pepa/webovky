import type { Metadata } from "next";
import LegalLayout, { type LegalSection, type LegalMeta } from "@/components/LegalLayout";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { altLinks } from "@/i18n/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t(lang, "legal.privacy"),
    description:
      "Zásady ochrany osobních údajů společnosti EIKA ZNOJMO, a.s. – jak zpracováváme a chráníme vaše osobní údaje podle GDPR.",
    alternates: altLinks(lang, "/ochrana-osobnich-udaju"),
  };
}

export default async function PrivacyPage() {
  const lang = await getLang();

  const meta: LegalMeta[] = [
    { label: "Provozovatel", value: "EIKA ZNOJMO, a.s." },
    { label: "Sídlo", value: "Evropská 6/41, Oblekovice, 671 81 Znojmo" },
    { label: "IČ / DIČ", value: "63490439 / CZ63490439" },
    { label: "Zápis v OR", value: "Krajský soud v Brně, oddíl B, vložka 1814" },
    { label: "Kontakt", value: "eika@eika.cz · 515 244 662" },
    { label: "Poslední aktualizace", value: "15. 6. 2026" },
  ];

  const sections: LegalSection[] = [
    {
      id: "spravce",
      title: "Kdo je správcem údajů",
      body: (
        <>
          <p>
            Správcem osobních údajů je společnost <strong>EIKA ZNOJMO, a.s.</strong>, se sídlem Evropská 6/41,
            Oblekovice, 671 81 Znojmo, IČ: [doplňte], zapsaná v obchodním rejstříku (dále jen „Společnost"
            nebo „my"). Tyto zásady popisují, jak zpracováváme a chráníme vaše osobní údaje.
          </p>
          <p>
            Pokud máte k ochraně osobních údajů jakýkoli dotaz, kontaktujte nás na e-mailu{" "}
            <a href="mailto:eika@eika.cz" className="font-semibold text-[var(--color-accent)]">eika@eika.cz</a>.
          </p>
        </>
      ),
    },
    {
      id: "jake-udaje",
      title: "Jaké údaje zpracováváme",
      body: (
        <>
          <p>V závislosti na vašem vztahu k nám zpracováváme zejména:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>identifikační a kontaktní údaje (jméno, název firmy, IČ/DIČ, adresa, telefon, e-mail);</li>
            <li>údaje o objednávkách, poptávkách a fakturaci;</li>
            <li>komunikaci s námi (e-maily, formuláře, telefonáty);</li>
            <li>technické údaje a cookies při návštěvě webu (viz část o cookies).</li>
          </ul>
        </>
      ),
    },
    {
      id: "ucel",
      title: "Účel a právní základ zpracování",
      body: (
        <>
          <p>Vaše údaje zpracováváme na těchto právních základech:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Plnění smlouvy</strong> – zpracování objednávek, poptávek a dodání zboží.</li>
            <li><strong>Plnění právní povinnosti</strong> – zejména účetní a daňové předpisy.</li>
            <li><strong>Oprávněný zájem</strong> – ochrana našich práv, zlepšování služeb, přímý marketing našim zákazníkům.</li>
            <li><strong>Souhlas</strong> – statistické a marketingové cookies, zasílání novinek.</li>
          </ul>
        </>
      ),
    },
    {
      id: "predani",
      title: "Komu údaje předáváme",
      body: (
        <p>
          Údaje předáváme pouze v nezbytném rozsahu – přepravním společnostem (doručení zboží), poskytovatelům
          účetních a IT služeb, a orgánům veřejné moci, pokud to vyžaduje zákon. S každým zpracovatelem máme
          uzavřenou smlouvu o zpracování osobních údajů.
        </p>
      ),
    },
    {
      id: "doba",
      title: "Doba uchování",
      body: (
        <p>
          Osobní údaje uchováváme jen po dobu nezbytně nutnou – po dobu trvání smluvního vztahu a následně po
          dobu stanovenou právními předpisy (zejména účetní a daňové doklady po dobu 10 let). Údaje zpracovávané
          na základě souhlasu uchováváme do jeho odvolání.
        </p>
      ),
    },
    {
      id: "prava",
      title: "Vaše práva",
      body: (
        <>
          <p>Ve vztahu ke svým osobním údajům máte právo:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>na přístup ke svým údajům a jejich kopii;</li>
            <li>na opravu nepřesných údajů;</li>
            <li>na výmaz („právo být zapomenut") a omezení zpracování;</li>
            <li>vznést námitku proti zpracování a odvolat souhlas;</li>
            <li>na přenositelnost údajů;</li>
            <li>podat stížnost u Úřadu pro ochranu osobních údajů (uoou.cz).</li>
          </ul>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookies",
      body: (
        <>
          <p>
            Web používá soubory cookies. <strong>Nezbytné</strong> cookies zajišťují základní provoz a bezpečnost
            a běží vždy. <strong>Statistické</strong> a <strong>marketingové</strong> cookies používáme pouze
            s vaším souhlasem.
          </p>
          <p>
            Svou volbu můžete kdykoli změnit přes tlačítko „Cookies" v levém dolním rohu webu.
          </p>
        </>
      ),
    },
    {
      id: "zabezpeceni",
      title: "Zabezpečení údajů",
      body: (
        <p>
          Přijímáme přiměřená technická a organizační opatření, abychom vaše údaje chránili před neoprávněným
          přístupem, ztrátou či zneužitím – zejména zabezpečené připojení (HTTPS), řízení přístupů a pravidelné
          zálohování.
        </p>
      ),
    },
    {
      id: "kontakt",
      title: "Kontaktujte nás",
      body: (
        <p>
          S jakýmkoli dotazem k ochraně osobních údajů nebo uplatněním svých práv se obraťte na{" "}
          <a href="mailto:eika@eika.cz" className="font-semibold text-[var(--color-accent)]">eika@eika.cz</a>{" "}
          nebo telefonicky na pobočku Znojmo{" "}
          <a href="tel:+420515244662" className="font-semibold text-[var(--color-accent)]">515 244 662</a>.
        </p>
      ),
    },
  ];

  return (
    <LegalLayout
      eyebrow="GDPR"
      title={t(lang, "legal.privacy")}
      home={t(lang, "crumb.home")}
      meta={meta}
      sections={sections}
    />
  );
}
