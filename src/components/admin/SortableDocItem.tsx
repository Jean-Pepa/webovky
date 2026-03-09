"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

interface DocImage {
  src: string;
  alt: string;
}

interface SortableDocItemProps {
  id: string;
  image: DocImage;
  index: number;
  onRemove: (index: number) => void;
  onUpdateAlt: (index: number, alt: string) => void;
}

export default function SortableDocItem({ id, image, index, onRemove, onUpdateAlt }: SortableDocItemProps) {
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
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 bg-white p-2 border border-border" {...attributes}>
      <div className="cursor-grab active:cursor-grabbing shrink-0 text-black/30 px-1" {...listeners}>
        ⠿
      </div>
      <Image
        src={image.src}
        alt={image.alt}
        width={80}
        height={56}
        className="object-cover shrink-0"
        unoptimized={image.src.startsWith("/")}
        draggable={false}
      />
      <input
        type="text"
        value={image.alt}
        onChange={(e) => onUpdateAlt(index, e.target.value)}
        placeholder="Popis obrázku"
        className="flex-1 border border-border px-2 py-1 text-xs"
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="w-6 h-6 bg-red-500 text-white text-xs flex items-center justify-center shrink-0"
      >
        x
      </button>
    </div>
  );
}
