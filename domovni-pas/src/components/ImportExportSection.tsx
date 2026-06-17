"use client";

import { useState } from "react";
import { useStore, type Property, type ContactKind } from "@/lib/store";
import { IconDownload, IconKey, IconPhone, IconFile } from "@/components/Icons";

// ── CSV pomocníci ────────────────────────────────────────────────────────────
function download(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function csvCell(v: string): string {
  return /[";\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}
function toCsv(rows: string[][]): string {
  // Excel v ČR čeká středník; BOM kvůli diakritice
  return "﻿" + rows.map((r) => r.map(csvCell).join(";")).join("\r\n");
}

function detectDelim(line: string): string {
  if (line.includes(";")) return ";";
  if (line.includes("\t")) return "\t";
  return ",";
}
function parseLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === delim) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}
function parseCsv(text: string): string[][] {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim() !== "");
  if (!lines.length) return [];
  const delim = detectDelim(lines[0]);
  return lines.map((l) => parseLine(l, delim));
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

function headerIndex(header: string[], keys: string[]): number {
  const H = header.map(norm);
  for (const k of keys) {
    const i = H.findIndex((h) => h === k || h.startsWith(k));
    if (i >= 0) return i;
  }
  return -1;
}

function kindFromText(s: string): ContactKind {
  const n = norm(s);
  if (n.startsWith("sprav")) return "SPRAVCE";
  if (n.startsWith("dodav")) return "DODAVATEL";
  return "VYBOR";
}

const KIND_CS: Record<ContactKind, string> = {
  VYBOR: "Výbor",
  SPRAVCE: "Správce",
  DODAVATEL: "Dodavatel",
};

export function ImportExportSection({ property }: { property: Property }) {
  const { addUnit, addContact } = useStore();
  const id = property.id;
  const [unitsText, setUnitsText] = useState("");
  const [contactsText, setContactsText] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  // ── Export ──
  function exportUnits() {
    const rows = [
      ["Jednotka", "Vlastník", "Patro", "Plocha (m2)", "Podíl", "Kontakt"],
      ...(property.units ?? []).map((u) => [
        u.label,
        u.ownerName,
        u.floor ?? "",
        u.area != null ? String(u.area) : "",
        u.share ?? "",
        u.contact ?? "",
      ]),
    ];
    download(`jednotky-${id}.csv`, toCsv(rows), "text/csv;charset=utf-8");
  }
  function exportContacts() {
    const rows = [
      ["Jméno", "Typ", "Funkce", "Telefon", "E-mail"],
      ...(property.contacts ?? []).map((c) => [
        c.name,
        KIND_CS[c.kind],
        c.position ?? "",
        c.phone ?? "",
        c.email ?? "",
      ]),
    ];
    download(`kontakty-${id}.csv`, toCsv(rows), "text/csv;charset=utf-8");
  }
  function exportJson() {
    download(`pas-${id}.json`, JSON.stringify(property, null, 2), "application/json");
  }

  // ── Import ──
  function importUnits(text: string) {
    const t = text.trim();
    if (!t) return;
    let n = 0;
    try {
      if (t[0] === "[" || t[0] === "{") {
        const arr = JSON.parse(t) as Record<string, unknown>[];
        for (const r of Array.isArray(arr) ? arr : [arr]) {
          const label = String(r.label ?? r.jednotka ?? "").trim();
          const ownerName = String(r.ownerName ?? r.vlastnik ?? r.owner ?? "").trim();
          if (!label && !ownerName) continue;
          addUnit(id, {
            label: label || "—",
            ownerName: ownerName || "—",
            floor: r.floor ? String(r.floor) : undefined,
            area: r.area != null ? Number(r.area) || undefined : undefined,
            share: r.share ? String(r.share) : undefined,
            contact: r.contact ? String(r.contact) : undefined,
          });
          n++;
        }
      } else {
        const rows = parseCsv(t);
        if (!rows.length) return;
        const head = rows[0];
        const iLabel = headerIndex(head, ["jednotka", "cislo", "byt", "unit"]);
        const map =
          iLabel >= 0
            ? {
                label: iLabel,
                owner: headerIndex(head, ["vlastnik", "majitel", "owner", "jmeno"]),
                floor: headerIndex(head, ["patro", "podlazi", "floor"]),
                area: headerIndex(head, ["plocha", "vymera", "m2", "area"]),
                share: headerIndex(head, ["podil", "share"]),
                contact: headerIndex(head, ["kontakt", "email", "telefon", "contact"]),
              }
            : { label: 0, owner: 1, floor: 2, area: 3, share: 4, contact: 5 };
        const data = iLabel >= 0 ? rows.slice(1) : rows;
        for (const row of data) {
          const label = (row[map.label] ?? "").trim();
          const ownerName = (map.owner >= 0 ? row[map.owner] : "")?.trim() ?? "";
          if (!label && !ownerName) continue;
          const areaRaw = map.area >= 0 ? (row[map.area] ?? "").replace(",", ".") : "";
          const area = areaRaw ? Number(areaRaw) : NaN;
          addUnit(id, {
            label: label || "—",
            ownerName: ownerName || "—",
            floor: map.floor >= 0 ? row[map.floor]?.trim() || undefined : undefined,
            area: Number.isFinite(area) ? area : undefined,
            share: map.share >= 0 ? row[map.share]?.trim() || undefined : undefined,
            contact: map.contact >= 0 ? row[map.contact]?.trim() || undefined : undefined,
          });
          n++;
        }
      }
      setMsg(`Naimportováno ${n} jednotek.`);
      setUnitsText("");
    } catch {
      setMsg("Nepodařilo se načíst jednotky — zkontrolujte formát (CSV nebo JSON).");
    }
  }

  function importContacts(text: string) {
    const t = text.trim();
    if (!t) return;
    let n = 0;
    try {
      if (t[0] === "[" || t[0] === "{") {
        const arr = JSON.parse(t) as Record<string, unknown>[];
        for (const r of Array.isArray(arr) ? arr : [arr]) {
          const name = String(r.name ?? r.jmeno ?? r.nazev ?? "").trim();
          if (!name) continue;
          addContact(id, {
            name,
            kind: r.kind ? kindFromText(String(r.kind)) : kindFromText(String(r.typ ?? "")),
            position: r.position ? String(r.position) : r.funkce ? String(r.funkce) : undefined,
            phone: r.phone ? String(r.phone) : r.telefon ? String(r.telefon) : undefined,
            email: r.email ? String(r.email) : undefined,
          });
          n++;
        }
      } else {
        const rows = parseCsv(t);
        if (!rows.length) return;
        const head = rows[0];
        const iName = headerIndex(head, ["jmeno", "nazev", "name", "firma"]);
        const map =
          iName >= 0
            ? {
                name: iName,
                kind: headerIndex(head, ["typ", "role", "kategorie", "kind"]),
                position: headerIndex(head, ["funkce", "pozice", "position", "obor"]),
                phone: headerIndex(head, ["telefon", "tel", "phone"]),
                email: headerIndex(head, ["email", "mail"]),
              }
            : { name: 0, kind: 1, position: 2, phone: 3, email: 4 };
        const data = iName >= 0 ? rows.slice(1) : rows;
        for (const row of data) {
          const name = (row[map.name] ?? "").trim();
          if (!name) continue;
          addContact(id, {
            name,
            kind: map.kind >= 0 ? kindFromText(row[map.kind] ?? "") : "VYBOR",
            position: map.position >= 0 ? row[map.position]?.trim() || undefined : undefined,
            phone: map.phone >= 0 ? row[map.phone]?.trim() || undefined : undefined,
            email: map.email >= 0 ? row[map.email]?.trim() || undefined : undefined,
          });
          n++;
        }
      }
      setMsg(`Naimportováno ${n} kontaktů.`);
      setContactsText("");
    } catch {
      setMsg("Nepodařilo se načíst kontakty — zkontrolujte formát (CSV nebo JSON).");
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>, set: (s: string) => void) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => set(String(reader.result ?? ""));
    reader.readAsText(f);
    e.target.value = "";
  }

  return (
    <div className="space-y-4">
      {msg && (
        <div className="rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-800">{msg}</div>
      )}

      {/* Záloha celého domu */}
      <section className="card flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-2">
          <IconFile className="h-4 w-4 text-teal-700" />
          <div>
            <h2 className="text-sm font-semibold text-stone-900">Záloha celého domu</h2>
            <p className="text-xs text-stone-400">Kompletní pas budovy jako soubor JSON.</p>
          </div>
        </div>
        <button onClick={exportJson} className="btn-secondary btn-sm">
          <IconDownload className="h-4 w-4" />
          Stáhnout JSON
        </button>
      </section>

      {/* Jednotky a vlastníci */}
      <ImportCard
        icon={<IconKey className="h-4 w-4 text-teal-700" />}
        title="Jednotky a vlastníci"
        count={(property.units ?? []).length}
        onExport={exportUnits}
        text={unitsText}
        setText={setUnitsText}
        onFile={(e) => onFile(e, setUnitsText)}
        onImport={() => importUnits(unitsText)}
        placeholder={"Vložte CSV nebo JSON…\nJednotka;Vlastník;Patro;Plocha;Podíl;Kontakt\n2/3;Marie Veselá;2. NP;78;780/12480;vesela@email.cz"}
      />

      {/* Kontakty */}
      <ImportCard
        icon={<IconPhone className="h-4 w-4 text-teal-700" />}
        title="Kontakty"
        count={(property.contacts ?? []).length}
        onExport={exportContacts}
        text={contactsText}
        setText={setContactsText}
        onFile={(e) => onFile(e, setContactsText)}
        onImport={() => importContacts(contactsText)}
        placeholder={"Vložte CSV nebo JSON…\nJméno;Typ;Funkce;Telefon;E-mail\nJan Dvořák;Výbor;Předseda;777100200;predseda@dum.cz"}
      />

      <p className="text-xs text-stone-400">
        Import přidává nové záznamy (stávající nemaže). Podporováno CSV (oddělovač „;" i „,")
        i JSON. Hlavičku rozpozná automaticky; bez hlavičky čte sloupce v uvedeném pořadí.
      </p>
    </div>
  );
}

function ImportCard({
  icon,
  title,
  count,
  onExport,
  text,
  setText,
  onFile,
  onImport,
  placeholder,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  onExport: () => void;
  text: string;
  setText: (s: string) => void;
  onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
  placeholder: string;
}) {
  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-semibold text-stone-900">{title}</h2>
          <span className="text-xs text-stone-400">· {count}</span>
        </div>
        <button onClick={onExport} className="btn-secondary btn-sm">
          <IconDownload className="h-4 w-4" />
          Export CSV
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input mt-3 min-h-28 font-mono text-xs"
        placeholder={placeholder}
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <label className="btn-ghost btn-sm cursor-pointer text-stone-500">
          Načíst soubor…
          <input type="file" accept=".csv,.json,.txt" className="hidden" onChange={onFile} />
        </label>
        <button onClick={onImport} disabled={!text.trim()} className="btn-primary btn-sm disabled:opacity-40">
          Naimportovat
        </button>
      </div>
    </section>
  );
}
