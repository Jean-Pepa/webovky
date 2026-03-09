"use client";

import { useState, useEffect } from "react";
import type { ProjectHistoryEntry } from "@/types/database";

interface ProjectHistoryProps {
  projectId: string;
}

const actionLabels: Record<string, string> = {
  created: "Vytvořeno",
  updated: "Upraveno",
  duplicated: "Duplikováno",
};

export default function ProjectHistory({ projectId }: ProjectHistoryProps) {
  const [entries, setEntries] = useState<ProjectHistoryEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`/api/admin/projects/${projectId}/history`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEntries(data);
      })
      .finally(() => setLoading(false));
  }, [open, projectId]);

  return (
    <div className="border border-black/[0.06]" style={{ borderRadius: 20, backgroundColor: '#efefef', marginTop: 32 }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left text-[21px] font-light tracking-wide uppercase flex items-center justify-between"
        style={{ padding: "20px 40px" }}
      >
        Historie změn
        <span className="text-black/40">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{ padding: "0 40px 24px" }}>
          {loading ? (
            <p className="text-black/40 text-[19px]">Načítání...</p>
          ) : entries.length === 0 ? (
            <p className="text-black/40 text-[19px]">Žádné záznamy</p>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-start gap-4 text-[19px]">
                  <div className="shrink-0 w-2 h-2 rounded-full bg-black/30 mt-2.5" />
                  <div>
                    <span className="font-medium">{actionLabels[entry.action] ?? entry.action}</span>
                    {entry.changes_summary && (
                      <span className="text-black/50 ml-2">{entry.changes_summary}</span>
                    )}
                    <div className="text-black/30 text-[15px]">
                      {new Date(entry.created_at).toLocaleString("cs-CZ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
