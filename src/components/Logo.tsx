/* eslint-disable @next/next/no-img-element */
// Logo Eika se načítá ze souboru /public/logo.svg.
// Chceš přesně své logo? Stačí nahradit soubor public/logo.svg (nebo nahrát
// public/logo.png a změnit zde příponu) – web ho hned použije, bez další úpravy.
// light=true → bílá varianta (na tmavém pozadí) pomocí filtru.
export default function Logo({
  light = false,
  className = "h-10",
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <img
      src="/logo.png"
      alt="Eika"
      className={`${className} w-auto`}
      style={light ? { filter: "brightness(0) invert(1)" } : undefined}
    />
  );
}
