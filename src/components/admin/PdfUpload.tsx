"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PdfFile } from "@/types/database";

interface PdfUploadProps {
  value: PdfFile[];
  onChange: (files: PdfFile[]) => void;
  folder?: string;
  label?: string;
}

export default function PdfUpload({
  value,
  onChange,
  folder = "projects/pdfs",
  label = "PDF soubory ke stažení",
}: PdfUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 30 * 1024 * 1024) {
      setError("Soubor je příliš velký (max 30 MB)");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setError("");

    try {
      // 1. Get signed upload URL from our API
      const signedRes = await fetch("/api/admin/upload/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          folder,
          contentType: file.type,
        }),
      });

      if (!signedRes.ok) {
        const data = await signedRes.json();
        throw new Error(data.error || "Failed to get upload URL");
      }

      const { path, publicUrl, token: uploadToken } = await signedRes.json();

      // 2. Upload directly to Supabase Storage (bypasses Vercel 4.5MB limit)
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("media")
        .uploadToSignedUrl(path, uploadToken, file, {
          contentType: file.type,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const defaultLabel = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      onChange([...value, { url: publicUrl, label_cs: defaultLabel, label_en: defaultLabel }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload selhal");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleRemove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function updateLabel(index: number, field: "label_cs" | "label_en", val: string) {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  }

  return (
    <div>
      <label className="block text-[20px] font-medium text-black/70 mb-1.5">
        {label} ({value.length})
      </label>

      {value.length > 0 && (
        <div className="space-y-3 mb-3">
          {value.map((pdf, i) => (
            <div
              key={`${pdf.url}-${i}`}
              className="flex items-start gap-3 border border-black/10 rounded-lg p-3"
              style={{ backgroundColor: "#e8e8e8" }}
            >
              <div className="shrink-0 text-[28px] text-red-600" style={{ lineHeight: 1 }}>
                PDF
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  value={pdf.label_cs}
                  onChange={(e) => updateLabel(i, "label_cs", e.target.value)}
                  placeholder="Popis (CZ)"
                  className="w-full border border-black/15 rounded px-3 py-1.5 text-[18px]"
                />
                <input
                  type="text"
                  value={pdf.label_en}
                  onChange={(e) => updateLabel(i, "label_en", e.target.value)}
                  placeholder="Label (EN)"
                  className="w-full border border-black/15 rounded px-3 py-1.5 text-[18px]"
                />
                <div className="text-[14px] text-black/40 truncate">{pdf.url.split("/").pop()}</div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="text-red-500 hover:text-red-700 text-[20px] shrink-0 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors border-black/15 hover:border-black/30"
        style={{ borderRadius: 8 }}
      >
        {uploading ? (
          <span className="text-[18px] text-black/50">Nahrávání...</span>
        ) : (
          <span className="text-[18px] text-black/50">+ Přidat PDF soubor</span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && <p className="text-red-500 text-[15px] mt-1">{error}</p>}
    </div>
  );
}
