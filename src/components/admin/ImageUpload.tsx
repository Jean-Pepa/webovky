"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Obrázek",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        const data = await res.json();
        onChange(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload selhal");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      uploadFile(file);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  async function handleRemove() {
    if (value && value.includes("/storage/v1/object/public/media/")) {
      const path = value.split("/storage/v1/object/public/media/")[1];
      await fetch("/api/admin/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
    }
    onChange("");
  }

  return (
    <div>
      <label className="block text-sm text-secondary mb-1">{label}</label>

      {value ? (
        <div className="relative inline-block">
          <Image
            src={value}
            alt="Preview"
            width={200}
            height={140}
            className="object-cover border border-border"
            unoptimized={value.startsWith("/")}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
          >
            x
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent/50"
          }`}
        >
          {uploading ? (
            <span className="text-sm text-secondary">Nahrávání...</span>
          ) : (
            <span className="text-sm text-secondary">
              Přetáhněte obrázek nebo klikněte
            </span>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Manual URL input fallback */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="nebo zadejte URL ručně"
        className="w-full border border-border px-4 py-2 text-xs mt-2"
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
