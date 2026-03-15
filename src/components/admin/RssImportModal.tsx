"use client";

import { useState } from "react";

interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image: string | null;
}

interface RssImportModalProps {
  onClose: () => void;
  onImport: (item: RssItem) => void;
}

export default function RssImportModal({ onClose, onImport }: RssImportModalProps) {
  const [items, setItems] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  async function fetchRss() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stories/rss");
      if (!res.ok) throw new Error("Nepodařilo se načíst RSS");
      const data = await res.json();
      setItems(data);
      setFetched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba");
    } finally {
      setLoading(false);
    }
  }

  // Fetch on first render
  if (!fetched && !loading && !error) {
    fetchRss();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[700px] max-h-[80vh] overflow-y-auto"
        style={{ borderRadius: 20, padding: 32 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-light">Import z ArchDaily</h2>
          <button
            onClick={onClose}
            className="text-black/40 hover:text-black text-[24px] transition-colors"
          >
            &times;
          </button>
        </div>

        {loading && (
          <p className="text-center text-black/40 py-10">Načítání RSS...</p>
        )}

        {error && (
          <p className="text-center text-red-600 py-10">{error}</p>
        )}

        {!loading && items.length === 0 && fetched && (
          <p className="text-center text-black/40 py-10">Žádné články.</p>
        )}

        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 border border-black/[0.06] hover:bg-black/[0.02] transition-colors cursor-pointer"
              style={{ borderRadius: 12 }}
              onClick={() => onImport(item)}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-[16px] font-medium leading-tight line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-[13px] text-black/50 mt-1 line-clamp-2">
                  {item.description}
                </p>
                <span className="text-[11px] text-black/30 mt-1 block">
                  {new Date(item.pubDate).toLocaleDateString("cs")}
                </span>
              </div>
              <span className="text-[13px] text-black/40 flex-shrink-0">
                Importovat &rarr;
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
