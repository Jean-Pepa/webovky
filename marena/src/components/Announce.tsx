"use client";

import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Modal } from "@/components/Modal";
import { flash } from "@/components/Flash";
import { ROLES, roleById } from "@/lib/roles";
import { sameName } from "@/lib/names";
import type { Announcement, Year } from "@/lib/types";

// Komu oznámení „svítí": všem, nebo podle role, nebo konkrétním lidem.
export function announcementTargets(an: Announcement, me: string, year: Year): boolean {
  const a = an.audience || {};
  if (a.all) return true;
  if (a.people?.some((p) => sameName(p, me))) return true;
  if (a.roles?.length) {
    const mine = year.members.find((m) => sameName(m.name, me));
    if (mine && mine.roleIds.some((r) => a.roles!.includes(r))) return true;
  }
  return false;
}

// Krátký popis publika pro výpis odeslaných.
function audienceLabel(a: { all?: boolean; roles?: string[]; people?: string[] }): string {
  if (a.all) return "Všichni";
  const parts = [...(a.roles ?? []).map((r) => roleById(r)?.name ?? r), ...(a.people ?? [])];
  return parts.length ? parts.join(", ") : "—";
}

// Composer (jen správce) — napíše zprávu, vybere komu, odešle. Vybraným pak
// vyskočí okno přes obrazovku (AnnouncementAlert).
export function AnnounceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { currentYear, me, dispatch } = useStore();
  const [text, setText] = useState("");
  const [all, setAll] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [people, setPeople] = useState<string[]>([]);

  const year = currentYear;
  const members = useMemo(() => (year?.members ?? []).filter((m) => m.approved !== false), [year]);
  const hasAudience = all || roles.length > 0 || people.length > 0;
  const canSend = text.trim().length > 0 && hasAudience;
  const sent = year?.announcements ?? [];

  const toggleRole = (rid: string) => {
    setAll(false);
    setRoles((a) => (a.includes(rid) ? a.filter((r) => r !== rid) : [...a, rid]));
  };
  const addPerson = (name: string) => {
    if (name && !people.some((p) => sameName(p, name))) {
      setAll(false);
      setPeople((a) => [...a, name]);
    }
  };
  const removePerson = (name: string) => setPeople((a) => a.filter((p) => p !== name));

  function send() {
    if (!year || !canSend) return;
    dispatch({ type: "addAnnouncement", yearId: year.id, text: text.trim(), createdBy: me, audience: { all, roles, people } });
    flash("Oznámení odesláno — vybraným vyskočí přes obrazovku", "📣");
    setText("");
    setAll(false);
    setRoles([]);
    setPeople([]);
    onClose();
  }

  if (!year) return null;
  return (
    <Modal open={open} onClose={onClose} title="📣 Poslat oznámení">
      <div className="space-y-4">
        <p className="text-sm text-ink-soft">Vybraným lidem hned vyskočí zpráva přes celou obrazovku, kterou musí odkliknout.</p>
        <textarea className="input min-h-24" value={text} onChange={(e) => setText(e.target.value)} placeholder="Napiš zprávu / informaci…" autoFocus />

        {/* Komu se zobrazí */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              setAll((v) => !v);
              setRoles([]);
              setPeople([]);
            }}
            className={`flex w-full items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition ${
              all ? "border-marigold-500 bg-marigold-50 text-marigold-700" : "border-ink/15 text-ink hover:bg-ink/5"
            }`}
          >
            <span className={`grid h-5 w-5 place-items-center rounded-full border-2 text-[11px] ${all ? "border-marigold-500 bg-marigold-500 text-white" : "border-ink/30"}`}>
              {all ? "✓" : ""}
            </span>
            👥 Všichni
          </button>

          <div>
            <p className="mb-1.5 eyebrow">Týmy / role</p>
            <div className="flex flex-wrap gap-1.5">
              {ROLES.map((r) => {
                const on = roles.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggleRole(r.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition ${
                      on ? "bg-marigold-500 text-white ring-marigold-500" : "text-ink-soft ring-ink/15 hover:bg-ink/5"
                    }`}
                  >
                    {r.emoji} {r.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-1.5 eyebrow">Konkrétní lidé</p>
            {people.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {people.map((p) => (
                  <span key={p} className="chip inline-flex items-center gap-1">
                    {p}
                    <button type="button" onClick={() => removePerson(p)} className="opacity-70 hover:opacity-100" aria-label={`Odebrat ${p}`}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <select
              className="input"
              value=""
              onChange={(e) => {
                addPerson(e.target.value);
                e.currentTarget.value = "";
              }}
            >
              <option value="">+ Přidat člověka…</option>
              {members
                .filter((m) => !people.some((p) => sameName(p, m.name)))
                .map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                    {m.roleIds.length ? ` — ${m.roleIds.map((r) => roleById(r)?.name ?? r).join(", ")}` : ""}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <button className="btn-primary w-full py-2.5" onClick={send} disabled={!canSend}>
          Odeslat oznámení
        </button>

        {/* Odeslaná oznámení — dají se smazat */}
        {sent.length > 0 && (
          <div className="border-t border-ink/10 pt-3">
            <p className="mb-1.5 eyebrow">Odeslaná</p>
            <ul className="space-y-1.5">
              {sent.map((an) => (
                <li key={an.id} className="flex items-start gap-2 rounded-lg bg-paper2/50 px-3 py-2 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-ink">{an.text}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">→ {audienceLabel(an.audience)}</p>
                  </div>
                  <button
                    className="btn-ghost shrink-0 px-2 py-1 text-xs text-red-600"
                    onClick={() => dispatch({ type: "removeAnnouncement", yearId: year.id, announcementId: an.id })}
                  >
                    Smazat
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}

// Okno přes celou obrazovku — vyskočí každému, koho se oznámení týká, dokud
// ho neodklikne. Potvrzení se pamatuje v prohlížeči (u každého zvlášť).
export function AnnouncementAlert() {
  const { currentYear, me } = useStore();
  const yid = currentYear?.id;
  const [acked, setAcked] = useState<string[]>([]);

  useEffect(() => {
    if (!yid) return;
    let ids: string[] = [];
    try {
      const raw = localStorage.getItem(`marena_ann_ack_${yid}`);
      ids = raw ? JSON.parse(raw) : [];
    } catch {
      ids = [];
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAcked(Array.isArray(ids) ? ids : []);
  }, [yid]);

  if (!currentYear || !me) return null;
  const pending = (currentYear.announcements ?? [])
    .filter((an) => !acked.includes(an.id) && !sameName(an.createdBy, me) && announcementTargets(an, me, currentYear))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const current = pending[0];
  if (!current) return null;

  const ack = () => {
    const next = [...acked, current.id];
    try {
      localStorage.setItem(`marena_ann_ack_${yid}`, JSON.stringify(next));
    } catch {
      /* demo bez úložiště */
    }
    setAcked(next);
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/60 px-4 backdrop-blur-sm">
      <div className="marena-pop w-full max-w-md rounded-2xl bg-surface px-6 py-6 text-center shadow-2xl ring-2 ring-gold-500/60">
        <div className="text-4xl">📣</div>
        <h2 className="mt-2 font-display text-xl font-bold">Zpráva od organizátora</h2>
        <p className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-paper2 px-4 py-3 text-left text-[15px] leading-relaxed text-ink">{current.text}</p>
        <p className="mt-2 text-xs text-ink-soft">
          od {current.createdBy}
          {pending.length > 1 ? ` · ještě ${pending.length - 1} další` : ""}
        </p>
        <button className="btn-primary mt-4 w-full py-2.5" onClick={ack}>
          Rozumím
        </button>
      </div>
    </div>
  );
}
