"use client";

import type { ComponentType } from "react";
import { Domy, Dum, KodDomu, NovaNemovitost } from "./owner";
import { Hlidace, Parovani, Spotreba, Unik } from "./sensors";
import { Dokumenty, DokumentyNahrat, Kategorie, Soubor, Vykres, Vykresy } from "./docs";
import { Nabidky, Obnova, Terminy, Zarizeni, ZarizeniDetail } from "./devices";
import { Historie, Prochazka, Zaznam } from "./history";
import { Vymena, VymenaHotovo, VymenaZmeny } from "./vymena";
import { Kamera, Zeptat } from "./ask";
import { ArScreen, Skener, Ulozeno, VeZdi, Zakazka, Zakazky, Zamek, Zapis, ZarizeniDum } from "./tech";
import { Agent } from "./soon";
import { Model } from "./model";
import { Body, Nav, Screen, Title } from "../ui";
import { useNav } from "../nav";

type ScreenComp = ComponentType<{ params: Record<string, unknown> }>;

function Chybi({ params }: { params: Record<string, unknown> }) {
  const nav = useNav();
  void params;
  return (
    <Screen>
      <Body>
        <Nav back="Zpět" onBack={nav.back} />
        <Title title="Tady nic není" sub="Tahle obrazovka v ukázce chybí." />
      </Body>
    </Screen>
  );
}

export const SCREENS: Record<string, ScreenComp> = {
  domy: Domy,
  dum: Dum,
  "kod-domu": KodDomu,
  "nova-nemovitost": NovaNemovitost,
  hlidace: Hlidace,
  parovani: Parovani,
  spotreba: Spotreba,
  unik: Unik,
  dokumenty: Dokumenty,
  "dokumenty-nahrat": DokumentyNahrat,
  kategorie: Kategorie,
  soubor: Soubor,
  vykresy: Vykresy,
  vykres: Vykres,
  zarizeni: Zarizeni,
  "zarizeni-detail": ZarizeniDetail,
  terminy: Terminy,
  nabidky: Nabidky,
  obnova: Obnova,
  historie: Historie,
  prochazka: Prochazka,
  zaznam: Zaznam,
  vymena: Vymena,
  "vymena-zmeny": VymenaZmeny,
  "vymena-hotovo": VymenaHotovo,
  kamera: Kamera,
  zeptat: Zeptat,
  zakazky: Zakazky,
  zakazka: Zakazka,
  skener: Skener,
  "zarizeni-dum": ZarizeniDum,
  ar: ArScreen,
  vezdi: VeZdi,
  zapis: Zapis,
  ulozeno: Ulozeno,
  zamek: Zamek,
  agent: Agent,
  model: Model,
  chybi: Chybi,
};
