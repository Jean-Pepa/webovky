"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableDocItem from "./SortableDocItem";

interface DocImage {
  src: string;
  alt: string;
}

interface DocImageUploadProps {
  value: DocImage[];
  onChange: (images: DocImage[]) => void;
  folder?: string;
  label?: string;
}

export default function DocImageUpload({
  value,
  onChange,
  folder = "doc",
  label = "Dokumentace",
}: DocImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const itemIds = useMemo(() => value.map((img, i) => `doc-${i}-${img.src}`), [value]);

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
        const altText = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
        onChange([...value, { src: data.url, alt: altText }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload selhal");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange, value]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    files.reduce(async (prev, file) => {
      await prev;
      await uploadFile(file);
    }, Promise.resolve());
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.reduce(async (prev, file) => {
      await prev;
      await uploadFile(file);
    }, Promise.resolve());
    e.target.value = "";
  }

  async function handleRemove(index: number) {
    const img = value[index];
    if (img.src.includes("/storage/v1/object/public/media/")) {
      const path = img.src.split("/storage/v1/object/public/media/")[1];
      await fetch("/api/admin/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
    }
    onChange(value.filter((_, i) => i !== index));
  }

  function updateAlt(index: number, alt: string) {
    const updated = [...value];
    updated[index] = { ...updated[index], alt };
    onChange(updated);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = itemIds.indexOf(active.id as string);
    const newIndex = itemIds.indexOf(over.id as string);
    onChange(arrayMove(value, oldIndex, newIndex));
  }

  return (
    <div>
      <label className="block text-sm text-secondary mb-1">
        {label} ({value.length})
      </label>

      {value.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 mb-3">
              {value.map((img, i) => (
                <SortableDocItem
                  key={itemIds[i]}
                  id={itemIds[i]}
                  image={img}
                  index={i}
                  onRemove={handleRemove}
                  onUpdateAlt={updateAlt}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-accent bg-accent/5"
            : "border-border hover:border-accent/50"
        }`}
      >
        {uploading ? (
          <span className="text-sm text-secondary">Nahrávání...</span>
        ) : (
          <span className="text-sm text-secondary">
            + Přidat dokumentační obrázky
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
