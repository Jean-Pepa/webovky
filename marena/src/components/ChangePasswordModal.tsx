"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { useStore } from "@/lib/store";

// Změna hesla do zázemí (jen pro správce). Ověří stávající heslo a uloží nové.
// Funguje jen se sdíleným úložištěm (Redis) — v demo režimu se heslo nemění.
export function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { configured } = useStore();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function close() {
    setCurrent("");
    setNext("");
    setConfirm("");
    setErr(null);
    setDone(false);
    setBusy(false);
    onClose();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (next.trim().length < 4) return setErr("Nové heslo musí mít aspoň 4 znaky.");
    if (next !== confirm) return setErr("Nová hesla se neshodují.");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ current, next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setErr(data.error || "Změna se nepovedla.");
        setBusy(false);
        return;
      }
      setDone(true);
      setBusy(false);
    } catch {
      setErr("Něco se pokazilo při ukládání.");
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={close} title="🔑 Změnit heslo do zázemí">
      {!configured ? (
        <p className="text-sm text-ink-soft">
          Změna hesla jde jen s nasazeným sdíleným úložištěm (Redis). V demo režimu (jen v prohlížeči) se heslo měnit nedá.
        </p>
      ) : done ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-leaf-700">✅ Heslo změněno.</p>
          <p className="text-sm text-ink-soft">Od teď se přihlašuje jen novým heslem. Dej ho vědět celému týmu.</p>
          <button className="btn-primary" onClick={close}>Zavřít</button>
        </div>
      ) : (
        <form className="space-y-3" onSubmit={submit}>
          <div>
            <label className="label">Stávající heslo</label>
            <input className="input" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="label">Nové heslo</label>
            <input className="input" type="password" value={next} onChange={(e) => setNext(e.target.value)} />
          </div>
          <div>
            <label className="label">Nové heslo znovu</label>
            <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <div className="flex gap-2">
            <button className="btn-primary" type="submit" disabled={busy || !current || !next}>
              {busy ? "Ukládám…" : "Změnit heslo"}
            </button>
            <button className="btn-ghost" type="button" onClick={close}>Zrušit</button>
          </div>
          <p className="text-xs text-ink-soft">Po změně přestane platit původní ročníkové heslo. Nové heslo budou potřebovat všichni z týmu.</p>
        </form>
      )}
    </Modal>
  );
}
