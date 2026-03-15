"use client";

import { useState } from "react";

interface GenerateResult {
  title: string;
  slides: number;
  images: number;
}

export default function StoryGenerator({
  onGenerated,
}: {
  onGenerated?: () => void;
}) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/admin/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate");
        return;
      }

      setResult({
        title: data.title,
        slides: data.slides,
        images: data.images,
      });
      setUrl("");

      // Refresh page to show new story
      if (onGenerated) {
        onGenerated();
      } else {
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-[280px]">
      <span className="text-[11px] uppercase tracking-[2px] text-black/40">
        New Story
      </span>

      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        placeholder="ArchDaily / Dezeen URL..."
        className="w-full px-3 py-2 text-[13px] border border-black/10 rounded-lg outline-none focus:border-black/30 transition-colors"
        disabled={loading}
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !url.trim()}
        className="w-full px-4 py-2 text-[12px] rounded-lg transition-all flex items-center justify-center gap-2"
        style={{
          background: loading ? "#666" : "#111",
          color: "#fff",
          opacity: !url.trim() ? 0.4 : 1,
        }}
      >
        {loading ? (
          <>
            <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2v12m-6-6h12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Generate Story
          </>
        )}
      </button>

      {result && (
        <div className="text-[11px] text-green-600 bg-green-50 rounded-lg p-2">
          {result.title} — {result.slides} slides, {result.images} photos
        </div>
      )}

      {error && (
        <div className="text-[11px] text-red-600 bg-red-50 rounded-lg p-2">
          {error}
        </div>
      )}
    </div>
  );
}
