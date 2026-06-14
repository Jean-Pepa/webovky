// Logo EIKA – červený nápis "Eika" v ozdobném rámečku (vektorová rekreace).
// light=true → bílá varianta pro barevné/tmavé plochy.
export default function Logo({
  light = false,
  className = "h-10",
}: {
  light?: boolean;
  className?: string;
}) {
  const color = light ? "#ffffff" : "var(--color-accent)";
  return (
    <svg
      viewBox="0 0 168 64"
      className={className}
      role="img"
      aria-label="Eika"
      fill="none"
    >
      {/* Vnější ozdobný rámeček */}
      <rect
        x="3"
        y="6"
        width="162"
        height="52"
        rx="18"
        stroke={color}
        strokeWidth="4.5"
      />
      {/* Vnitřní linka (plaketový vzhled) */}
      <rect
        x="9"
        y="11.5"
        width="150"
        height="41"
        rx="13"
        stroke={color}
        strokeWidth="1.6"
      />
      {/* Rohové ozdoby (náznak svorek) */}
      {[
        [20, 18],
        [148, 18],
        [20, 46],
        [148, 46],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.7" fill={color} />
      ))}
      {/* Nápis Eika */}
      <text
        x="84"
        y="44"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="900"
        fontSize="34"
        letterSpacing="-1"
        fill={color}
      >
        Eika
      </text>
    </svg>
  );
}
