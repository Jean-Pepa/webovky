"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import { activeYearId } from "@/lib/years";
import { Modal } from "@/components/Modal";
import { DeleteButton } from "@/components/DeleteButton";
import type { Year } from "@/lib/types";

// Přepínač ročníků — každý rok Mařeny je samostatný. Nový ročník může převzít
// kontakty a program z aktuálního (hladké předání mezi týmy).
export function YearSwitcher() {
  const { db, currentYear, me, setCurrentYearId, dispatch } = useStore();
  const [adding, setAdding] = useState(false);
  const [settings, setSettings] = useState(false);
  const [newYear, setNewYear] = useState(String(new Date().getFullYear() + 1));
  const [carry, setCarry] = useState(true);

  if (!db) return null;
  const admin = isAdmin(me);
  const activeId = activeYearId(db);

  async function add() {
    const id = newYear.trim();
    if (!id) return;
    await dispatch({ type: "createYear", id, label: `Mařena ${id}`, copyFromYearId: carry ? currentYear?.id : undefined });
    setCurrentYearId(id);
    setAdding(false);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentYear?.id ?? ""}
        onChange={(e) => setCurrentYearId(e.target.value)}
        className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm font-semibold text-ink outline-none focus:border-marigold-500"
        aria-label="Vybrat ročník"
      >
        {db.years.map((y) => (
          <option key={y.id} value={y.id}>
            {y.label}
            {y.id !== activeId ? " 🔒" : ""}
          </option>
        ))}
      </select>

      {admin && currentYear && (
        <button
          className="btn-ghost px-2 py-1.5 text-sm"
          onClick={() => setSettings(true)}
          title="Nastavení ročníku (přejmenovat, téma, datum, smazat)"
          aria-label="Nastavení ročníku"
        >
          ⚙
        </button>
      )}

      {!admin ? null : adding ? (
        <span className="flex max-w-[calc(100vw-2rem)] flex-wrap items-center gap-2 rounded-2xl border border-ink/15 bg-white px-2.5 py-1.5">
          <input
            value={newYear}
            onChange={(e) => setNewYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
            className="w-16 rounded-full border border-ink/15 px-2.5 py-1 text-sm"
            placeholder="2027"
            inputMode="numeric"
            autoFocus
          />
          <span className="text-xs text-ink-soft">
            heslo bude <strong className="text-marigold-700">marena{newYear || "…"}</strong>
          </span>
          <label className="flex items-center gap-1 text-xs text-ink-soft" title="Přenese kontakty a seznam programu (stav domlouvání se vynuluje)">
            <input type="checkbox" checked={carry} onChange={(e) => setCarry(e.target.checked)} className="accent-marigold-600" />
            převzít kontakty a program
          </label>
          <button className="btn-primary px-3 py-1 text-xs" onClick={add}>
            Založit
          </button>
          <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setAdding(false)}>
            ✕
          </button>
        </span>
      ) : (
        <button className="btn-ghost px-2.5 py-1.5 text-sm" onClick={() => setAdding(true)} title="Založit nový ročník">
          + ročník
        </button>
      )}

      {settings && currentYear && <YearSettingsModal year={currentYear} onClose={() => setSettings(false)} />}
    </div>
  );
}

// Nastavení ročníku — jen pro správce (Pan_Vyskočil): přejmenovat, téma, datum
// Flédy a smazání celého ročníku (nevratné).
function YearSettingsModal({ year, onClose }: { year: Year; onClose: () => void }) {
  const { db, dispatch, setCurrentYearId } = useStore();
  const [label, setLabel] = useState(year.label);
  const [theme, setTheme] = useState(year.theme ?? "");
  const [fledaDate, setFledaDate] = useState(year.fledaDate ?? "");
  const canDelete = (db?.years.length ?? 0) > 1;

  async function save() {
    await dispatch({
      type: "updateYear",
      yearId: year.id,
      patch: { label: label.trim() || year.label, theme: theme.trim() || undefined, fledaDate: fledaDate || undefined },
    });
    onClose();
  }

  async function del() {
    const remaining = (db?.years ?? []).filter((y) => y.id !== year.id);
    await dispatch({ type: "deleteYear", yearId: year.id });
    if (remaining[0]) setCurrentYearId(remaining[0].id);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={`Nastavení ročníku — ${year.label}`}>
      <div className="space-y-3">
        <div>
          <label className="label">Název ročníku</label>
          <input className="input" value={label} onChange={(e) => setLabel(e.target.value)} autoFocus />
        </div>
        <div>
          <label className="label">Téma (nepovinné)</label>
          <input className="input" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="např. Vesmír" />
        </div>
        <div>
          <label className="label">Datum Flédy / průvodu (nepovinné)</label>
          <input type="date" className="input" value={fledaDate} onChange={(e) => setFledaDate(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button className="btn-primary flex-1" onClick={save}>
            Uložit
          </button>
          <button className="btn-ghost" onClick={onClose}>
            Zrušit
          </button>
        </div>

        <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-xs font-semibold text-red-700">Nebezpečná zóna</p>
          <p className="mt-0.5 text-xs text-red-700/80">Smazání ročníku je nevratné — zmizí celý jeho obsah (tým, nástěnka, finance…).</p>
          <div className="mt-2">
            {canDelete ? (
              <DeleteButton label="Smazat tento ročník" onConfirm={del} />
            ) : (
              <p className="text-xs text-ink-soft">Poslední ročník nelze smazat.</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
