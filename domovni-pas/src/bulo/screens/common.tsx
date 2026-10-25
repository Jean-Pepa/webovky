"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import { useActive, useNav } from "../nav";
import { ActionList, useOverlay } from "../overlay";
import { useStore, type AppState } from "../store";
import { HOUSES, OTHER } from "../data";
import type { HouseInfo } from "../types";
import { clearBlobs } from "../media";
import { Icon } from "../icons";

/** Tik pro živé hodnoty (běží jen na aktivní obrazovce). */
export function useTick(ms = 1000) {
  const active = useActive();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    const id = setInterval(() => setT((performance.now() - t0) / 1000), ms);
    return () => clearInterval(id);
  }, [active, ms]);
  return t;
}

export function useHouse(id?: unknown): HouseInfo {
  const { s } = useStore();
  const hid = typeof id === "string" ? id : "loucky";
  return s.houses.find((h) => h.id === hid) ?? HOUSES[0];
}

export function otherData(id: string) {
  return OTHER[id] ?? { status: "nový pas", devices: [], docs: [], history: [], deadlines: [] };
}

/** **tučně** v textu od AI. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? <b key={i}>{p.slice(2, -2)}</b> : <Fragment key={i}>{p}</Fragment>,
      )}
    </>
  );
}

export function Spark({ values, color, w = 54, h = 22 }: { values: number[]; color: string; w?: number; h?: number }) {
  const mx = Math.max(...values);
  const mn = Math.min(...values);
  const r = mx - mn || 1;
  const pts = values.map((v, i) => `${((i * w) / (values.length - 1)).toFixed(1)},${(h - 3 - ((v - mn) / r) * (h - 6)).toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ flex: "none" }} aria-hidden="true">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

// ---------- Menu „Zapsat“ (prostřední tlačítko lišty) ----------
export function useZapsat(houseId: string) {
  const nav = useNav();
  const ov = useOverlay();
  const { s } = useStore();
  return () => {
    const demo = houseId === "loucky";
    ov.sheet((close) => (
      <>
        <h3>Zapsat do pasu domu</h3>
        <p className="sh-sub">Fotka, dokument nebo otázka. Zbytek připraví AI.</p>
        <ActionList
          close={close}
          items={[
            ...(demo
              ? [
                  {
                    icon: "sparkle" as const,
                    label: "Zeptat se domu",
                    sub: "Vyfoťte, co vidíte, a zeptejte se",
                    onClick: () => nav.modal({ name: "kamera", params: { mode: "ask", house: houseId } }),
                  },
                ]
              : []),
            {
              icon: "camera" as const,
              label: "Zápis opravy nebo údržby",
              sub: "Fotky a jedna věta",
              onClick: () => nav.modal({ name: "kamera", params: { mode: "obecny", house: houseId } }),
            },
            {
              icon: "doc" as const,
              label: "Nahrát dokument",
              sub: "Revize, faktura, návod — AI ho zařadí",
              onClick: () => nav.push({ name: "dokumenty-nahrat", params: { id: houseId } }),
            },
            ...(demo
              ? [
                  {
                    icon: "flame" as const,
                    label: s.oldBoilers.length ? "Další výměna kotle" : "Nový kotel",
                    sub: "Stačí krátký dokument od instalatéra",
                    onClick: () => nav.push({ name: "vymena", params: { id: houseId } }),
                  },
                ]
              : []),
          ]}
        />
      </>
    ));
  };
}

// ---------- Účet: role, ukázka, obnovení dat ----------
export function useAccount() {
  const nav = useNav();
  const ov = useOverlay();
  const { s, dispatch } = useStore();
  return () => {
    const owner = s.role === "vlastnik";
    ov.sheet((close) => (
      <>
        <h3>{owner ? "Vlastník · Chata Loučky" : "Technik · Instalatérství Novák"}</h3>
        <p className="sh-sub">Ukázková verze BULO. Data se ukládají v tomto prohlížeči.</p>
        <ActionList
          close={close}
          items={[
            owner
              ? {
                  icon: "wrench",
                  label: "Přepnout na technika",
                  sub: "Zakázky, kód domu, AR a zápisy",
                  onClick: () => switchRole(s, dispatch, nav, "technik"),
                }
              : {
                  icon: "house",
                  label: "Přepnout na vlastníka",
                  sub: "Pas domu, hlídače a termíny",
                  onClick: () => switchRole(s, dispatch, nav, "vlastnik"),
                },
            ...(owner
              ? [
                  { icon: "qr" as const, label: "Kód domu na zeď", sub: "QR pro techniky · LOU-0127", onClick: () => nav.push({ name: "kod-domu", params: { id: "loucky" } }) },
                  {
                    icon: "drop" as const,
                    label: "Ukázka: noční únik vody",
                    sub: "Hlídač vody nahlásí průtok",
                    onClick: () => {
                      dispatch({ t: "startLeak", now: Date.now() });
                    },
                  },
                ]
              : []),
            {
              icon: "refresh",
              label: "Obnovit ukázková data",
              sub: "Vrátí appku do výchozího stavu",
              onClick: () => {
                dispatch({ t: "reset", now: Date.now() });
                clearBlobs();
                nav.reset([{ name: "domy" }], "fade");
                ov.toast("Ukázka je jako nová");
              },
            },
          ]}
        />
      </>
    ));
  };
}

export function switchRole(s: AppState, dispatch: ReturnType<typeof useStore>["dispatch"], nav: ReturnType<typeof useNav>, role: "vlastnik" | "technik") {
  dispatch({ t: "role", role });
  if (role === "technik") nav.reset([{ name: "zakazky" }], "fade");
  else if (s.lockQueue.length) nav.reset([{ name: "domy" }, { name: "zamek" }], "fade");
  else nav.reset([{ name: "domy" }], "fade");
}

export function Empty({ icon, title, sub, children }: { icon: Parameters<typeof Icon>[0]["name"]; title: string; sub: string; children?: ReactNode }) {
  return (
    <div className="card" style={{ padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8 }}>
      <span className="ic" style={{ background: "#EEEBE7", width: 52, height: 52, borderRadius: 26 }}>
        <Icon name={icon} size={24} color="#6F6A65" />
      </span>
      <b style={{ fontSize: 17 }}>{title}</b>
      <span style={{ fontSize: 14, color: "#6F6A65", lineHeight: 1.4 }}>{sub}</span>
      {children}
    </div>
  );
}
