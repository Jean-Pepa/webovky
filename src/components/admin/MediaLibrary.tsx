"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface MediaItem {
  name: string;
  isFolder: boolean;
  size: number;
  mimeType: string;
  createdAt: string;
  url: string | null;
  path: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [folder, setFolder] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadItems = useCallback(async (path: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media?folder=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems(folder);
  }, [folder, loadItems]);

  function navigateToFolder(name: string) {
    setFolder(folder ? `${folder}/${name}` : name);
  }

  function navigateUp() {
    const parts = folder.split("/");
    parts.pop();
    setFolder(parts.join("/"));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder || "uploads");
      await fetch("/api/admin/upload", { method: "POST", body: formData });
    }
    e.target.value = "";
    setUploading(false);
    loadItems(folder);
  }

  async function handleDelete(path: string) {
    if (!confirm(`Smazat soubor?`)) return;
    await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    loadItems(folder);
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  const folders = items.filter((i) => i.isFolder);
  const files = items.filter((i) => !i.isFolder && i.name !== ".emptyFolderPlaceholder");

  const breadcrumbs = folder ? folder.split("/") : [];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[19px] mb-6">
        <button
          onClick={() => setFolder("")}
          className={`hover:text-black transition-colors ${folder ? "text-black/50" : "text-black font-medium"}`}
        >
          media
        </button>
        {breadcrumbs.map((part, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="text-black/30">/</span>
            <button
              onClick={() => setFolder(breadcrumbs.slice(0, i + 1).join("/"))}
              className={`hover:text-black transition-colors ${
                i === breadcrumbs.length - 1 ? "text-black font-medium" : "text-black/50"
              }`}
            >
              {part}
            </button>
          </span>
        ))}
      </div>

      {/* Upload zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border hover:border-accent/50 px-4 py-6 text-center cursor-pointer transition-colors mb-6"
        style={{ borderRadius: 20 }}
      >
        <span className="text-[19px] text-black/40">
          {uploading ? "Nahrávání..." : `+ Nahrát soubory${folder ? ` do /${folder}` : ""}`}
        </span>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleUpload}
        className="hidden"
      />

      {loading ? (
        <p className="text-black/40 text-[19px]">Načítání...</p>
      ) : (
        <>
          {/* Folders */}
          {(folder || folders.length > 0) && (
            <div className="flex flex-wrap gap-3 mb-6">
              {folder && (
                <button
                  onClick={navigateUp}
                  className="border border-black/[0.06] text-[19px] hover:bg-[#e8e8e8] transition-colors flex items-center gap-2"
                  style={{ borderRadius: 16, padding: "12px 20px", backgroundColor: '#efefef' }}
                >
                  ← ..
                </button>
              )}
              {folders.map((f) => (
                <button
                  key={f.name}
                  onClick={() => navigateToFolder(f.name)}
                  className="border border-black/[0.06] text-[19px] hover:bg-[#e8e8e8] transition-colors flex items-center gap-2"
                  style={{ borderRadius: 16, padding: "12px 20px", backgroundColor: '#efefef' }}
                >
                  📁 {f.name}
                </button>
              ))}
            </div>
          )}

          {/* Files grid */}
          {files.length === 0 && folders.length === 0 && (
            <p className="text-black/40 text-[19px]">Prázdná složka</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.path}
                className="border border-black/[0.06] overflow-hidden group"
                style={{ borderRadius: 16, backgroundColor: '#efefef' }}
              >
                {file.mimeType?.startsWith("image/") && file.url ? (
                  <div className="relative w-full aspect-square bg-[#e8e8e8]">
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square bg-[#e8e8e8] flex items-center justify-center text-[32px] text-black/20">
                    📄
                  </div>
                )}
                <div style={{ padding: "10px 14px" }}>
                  <p className="text-[15px] truncate" title={file.name}>{file.name}</p>
                  <p className="text-[13px] text-black/40">{formatSize(file.size)}</p>
                  <div className="flex gap-2 mt-2">
                    {file.url && (
                      <button
                        onClick={() => copyUrl(file.url!)}
                        className="text-[13px] text-black/50 hover:text-black transition-colors"
                      >
                        {copied === file.url ? "Zkopírováno!" : "Kopírovat URL"}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(file.path)}
                      className="text-[13px] text-red-400 hover:text-red-600 transition-colors"
                    >
                      Smazat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
