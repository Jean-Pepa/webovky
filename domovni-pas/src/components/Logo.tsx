import { IconHome } from "./Icons";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-700 text-white">
        <IconHome className="h-5 w-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-stone-900">
        BULO
      </span>
    </span>
  );
}
