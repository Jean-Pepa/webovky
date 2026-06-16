export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span
      className={`text-3xl font-bold tracking-[0.22em] ${
        light ? "text-white" : "text-stone-900"
      } ${className}`}
    >
      BULO
    </span>
  );
}
