import { IconFile } from "./Icons";
import type { Media } from "@/lib/store";

export function AttachmentThumb({ m }: { m: Media }) {
  if (m.kind === "image" && m.dataUrl) {
    return (
      <a href={m.dataUrl} target="_blank" rel="noreferrer" className="group block">
        <div className="overflow-hidden rounded-lg border border-stone-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.dataUrl}
            alt={m.name}
            className="h-24 w-full object-cover transition group-hover:scale-105"
          />
        </div>
      </a>
    );
  }

  return (
    <div className="flex h-24 flex-col items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 p-2 text-center text-xs text-stone-600">
      <IconFile className="h-6 w-6 text-stone-400" />
      <span className="line-clamp-2 break-all">{m.name}</span>
    </div>
  );
}
