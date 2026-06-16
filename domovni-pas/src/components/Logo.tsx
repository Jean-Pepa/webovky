export function Logo({ className = "" }: { className?: string; light?: boolean }) {
  return (
    <span className={`text-3xl font-bold tracking-[0.22em] text-[#b5543a] ${className}`}>BULO</span>
  );
}
