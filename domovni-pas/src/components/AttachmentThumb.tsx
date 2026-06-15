import { IconFile } from "./Icons";
import { Badge } from "./ui/Badge";

type Att = {
  id: string;
  fileName: string;
  mimeType: string;
  caption: string | null;
};

export function AttachmentThumb({ a }: { a: Att }) {
  const src = `/api/files/${a.id}`;

  if (a.mimeType.startsWith("image/")) {
    return (
      <a href={src} target="_blank" rel="noreferrer" className="group block">
        <div className="overflow-hidden rounded-lg border border-stone-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={a.caption ?? a.fileName}
            className="h-24 w-full object-cover transition group-hover:scale-105"
          />
        </div>
      </a>
    );
  }

  if (a.mimeType.startsWith("video/")) {
    return (
      <div className="relative">
        <video
          src={src}
          controls
          className="h-24 w-full rounded-lg border border-stone-200 bg-black object-cover"
        />
        <span className="pointer-events-none absolute left-1.5 top-1.5">
          <Badge color="gray">Video</Badge>
        </span>
      </div>
    );
  }

  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className="flex h-24 flex-col items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 p-2 text-center text-xs text-stone-600 hover:bg-stone-100"
    >
      <IconFile className="h-6 w-6 text-stone-400" />
      <span className="line-clamp-2 break-all">{a.fileName}</span>
    </a>
  );
}
