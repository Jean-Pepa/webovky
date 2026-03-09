"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import Image from "next/image";
import SortableImageItem from "./SortableImageItem";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
}

export default function MultiImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Galerie",
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const itemIds = useMemo(() => value.map((url, i) => `img-${i}-${url}`), [value]);

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
        onChange([...value, data.url]);
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
    const url = value[index];
    if (url && url.includes("/storage/v1/object/public/media/")) {
      const path = url.split("/storage/v1/object/public/media/")[1];
      await fetch("/api/admin/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
    }
    onChange(value.filter((_, i) => i !== index));
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = itemIds.indexOf(active.id as string);
    const newIndex = itemIds.indexOf(over.id as string);
    onChange(arrayMove(value, oldIndex, newIndex));
  }

  const activeIndex = activeId ? itemIds.indexOf(activeId) : -1;

  return (
    <div>
      <label className="block text-sm text-secondary mb-1">
        {label} ({value.length})
      </label>

      {value.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={itemIds} strategy={rectSortingStrategy}>
            <div className="flex flex-wrap gap-2 mb-3">
              {value.map((url, i) => (
                <SortableImageItem
                  key={itemIds[i]}
                  id={itemIds[i]}
                  url={url}
                  index={i}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeIndex >= 0 ? (
              <Image
                src={value[activeIndex]}
                alt="Dragging"
                width={100}
                height={70}
                className="object-cover border-2 border-accent shadow-lg"
                style={{ width: 100, height: 70 }}
                unoptimized={value[activeIndex].startsWith("/")}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Drop zone */}
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
            + Přidat obrázky
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
