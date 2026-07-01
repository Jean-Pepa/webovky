"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import { activeYearId } from "@/lib/years";
import { Modal } from "@/components/Modal";
import { DeleteButton } from "@/components/DeleteButton";
import type { Year } from "@/lib/types";

// Přepínač ročníků — vlastní rozbalovací menu. Správce (Mařena) má u každého
// ročníku Upravit a Smazat a vespod založení nového ročníku.
export function YearSwitcher() {
  const { db, currentYear, me, setCurrentYearId, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editYear, setEditYear] = useState<Year | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Zavřít menu při kliknutí mimo.
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (!db) return null;
  const admin = isAdmin(me);
  const activeId = activeYearId(db);

  async function deleteYear(y: Year) {
    const remaining = db!.years.filter((x) => x.id !== y.id);
    await dispatch({ type: "deleteYear", yearId: y.id });
    if (currentYear?.id === y.id && remaining[0]) setCurrentYearId(remaining[0].id);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm font-semibold text-ink transition hover:bg-paper2"
        aria-label="Vybrat ročník"
        aria-expanded={open}
      >
        {currentYear?.label ?? "Ročník"}
        <span className="text-xs text-ink-soft">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 right-auto z-40 mt-1 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-ink/10 bg-white p-1.5 shadow-xl md:left-auto md:right-0">
          <ul className="max-h-72 space-y-0.5 overflow-y-auto">
            {db.years.map((y) => {
              const isCurrent = y.id === currentYear?.id;
              const locked = y.id !== activeId;
              return (
                <li key={y.id} className="flex flex-wrap items-center gap-1">
                  <button
                    onClick={() => {
                      setCurrentYearId(y.id);
                      setOpen(false);
                    }}
                    className={`min-w-0 flex-1 truncate rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                      isCurrent ? "bg-marigold-50 text-marigold-700" : "text-ink hover:bg-paper2"
                    }`}
                  >
                    {y.label} {locked && <span title="uzamčený ročník">🔒</span>}
                  </button>
                  {admin && (
                    <>
                      <button
                        onClick={() => {
                          setEditYear(y);
                          setOpen(false);
                        }}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-ink-soft transition hover:bg-paper2 hover:text-ink"
                      >
                        Upravit
                      </button>
                      {db.years.length > 1 && <DeleteButton onConfirm={() => deleteYear(y)} />}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          {admin && (
            <button
              onClick={() => {
                setAdding(true);
                setOpen(false);
              }}
              className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-marigold-700 transition hover:bg-marigold-50"
            >
              + Nový ročník
            </button>
          )}
        </div>
      )}

      {adding && <NewYearModal onClose={() => setAdding(false)} />}
      {editYear && <YearSettingsModal year={editYear} onClose={() => setEditYear(null)} />}
    </div>
  );
}

// Založení nového ročníku — vyskakovací okno, ať se nic nepřekrývá v hlavičce.
function NewYearModal({ onClose }: { onClose: () => void }) {
  const { currentYear, dispatch, setCurrentYearId } = useStore();
  const [newYear, setNewYear] = useState(String(new Date().getFullYear() + 1));
  const [carry, setCarry] = useState(true);

  async function add() {
    const id = newYear.trim();
    if (id.length < 4) return;
    await dispatch({ type: "createYear", id, label: `Mařena ${id}`, copyFromYearId: carry ? currentYear?.id : undefined });
    setCurrentYearId(id);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Nový ročník">
      <div className="space-y-3">
        <div>
          <label className="label">Rok</label>
          <input
            className="input"
            value={newYear}
            onChange={(e) => setNewYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric"
            placeholder="2027"
            autoFocus
          />
        </div>
        <p className="rounded-xl bg-paper2 px-3 py-2 text-sm text-ink-soft">
          Heslo pro tento ročník bude <strong className="text-marigold-700">marena{newYear || "…"}</strong>. To rozešleš nové partě.
        </p>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" checked={carry} onChange={(e) => setCarry(e.target.checked)} className="accent-marigold-600" />
          Převzít kontakty a program z aktuálního ročníku
        </label>
        <div className="flex items-center gap-2 pt-1">
          <button className="btn-primary flex-1" onClick={add}>
            Založit ročník
          </button>
          <button className="btn-ghost" onClick={onClose}>
            Zrušit
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Úprava ročníku — jen pro správce: přejmenovat, téma, datum Flédy.
function YearSettingsModal({ year, onClose }: { year: Year; onClose: () => void }) {
  const { dispatch } = useStore();
  const [label, setLabel] = useState(year.label);
  const [theme, setTheme] = useState(year.theme ?? "");
  const [fledaDate, setFledaDate] = useState(year.fledaDate ?? "");

  async function save() {
    await dispatch({
      type: "updateYear",
      yearId: year.id,
      patch: { label: label.trim() || year.label, theme: theme.trim() || undefined, fledaDate: fledaDate || undefined },
    });
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={`Upravit ročník — ${year.label}`}>
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
      </div>
    </Modal>
  );
}
