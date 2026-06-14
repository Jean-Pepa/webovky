export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-extrabold tracking-tight text-xl">
      <span
        className="grid place-items-center w-9 h-9 rounded-md text-white shadow-sm"
        style={{ background: "var(--color-accent)" }}
      >
        E
      </span>
      <span className={light ? "text-white" : "text-[var(--color-accent)]"}>
        EIKA
      </span>
    </span>
  );
}
