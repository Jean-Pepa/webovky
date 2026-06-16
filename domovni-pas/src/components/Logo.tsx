import { IconHome } from "./Icons";

export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`grid h-9 w-9 place-items-center rounded-xl ${
          light ? "bg-white/15 text-white ring-1 ring-white/25" : "bg-teal-700 text-white"
        }`}
      >
        <IconHome className="h-5 w-5" />
      </span>
      <span
        className={`text-lg font-semibold tracking-tight ${light ? "text-white" : "text-stone-900"}`}
      >
        BULO
      </span>
    </span>
  );
}
