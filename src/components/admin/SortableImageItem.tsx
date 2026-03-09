"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

interface SortableImageItemProps {
  id: string;
  url: string;
  index: number;
  onRemove: (index: number) => void;
}

export default function SortableImageItem({ id, url, index, onRemove }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group" {...attributes} {...listeners}>
      <Image
        src={url}
        alt={`Image ${index + 1}`}
        width={100}
        height={70}
        className="object-cover border border-border cursor-grab active:cursor-grabbing"
        style={{ width: 100, height: 70 }}
        unoptimized={url.startsWith("/")}
        draggable={false}
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(index); }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-5 h-5 bg-red-500 text-white rounded text-xs flex items-center justify-center"
        >
          x
        </button>
      </div>
    </div>
  );
}
