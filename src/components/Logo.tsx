// Logo EIKA – červený nápis "Eika" v zaobleném rámečku (dle značky).
// light=true → bílá varianta pro tmavé sekce (patička, admin).
export default function Logo({
  light = false,
  className = "h-9",
}: {
  light?: boolean;
  className?: string;
}) {
  const color = light ? "#ffffff" : "var(--color-accent)";
  return (
    <svg
      viewBox="0 0 132 48"
      className={className}
      role="img"
      aria-label="Eika"
      fill="none"
    >
      {/* Rámeček (cedulka) */}
      <rect
        x="2.5"
        y="6"
        width="127"
        height="36"
        rx="12"
        stroke={color}
        strokeWidth="3.5"
      />
      {/* Vnitřní jemný rámeček pro „plaketový" vzhled */}
      <rect
        x="7"
        y="10.5"
        width="118"
        height="27"
        rx="8"
        stroke={color}
        strokeWidth="1"
        opacity="0.45"
      />
      {/* Nápis Eika */}
      <text
        x="66"
        y="33.5"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="26"
        letterSpacing="-0.5"
        fill={color}
      >
        Eika
      </text>
    </svg>
  );
}
