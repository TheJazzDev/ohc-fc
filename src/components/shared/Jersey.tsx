type JerseyProps = {
  number: number;
  variant?: "filled" | "outline";
  size?: number;
};

export function Jersey({ number, variant = "filled", size = 56 }: JerseyProps) {
  const filled = variant === "filled";
  const fontPx = Math.round(size * (number > 9 ? 0.42 : 0.48));

  return (
    <div
      className="relative inline-flex leading-none"
      style={{
        width: size,
        height: size,
        filter: filled ? "drop-shadow(0 3px 4px rgba(0,0,0,0.38))" : "none",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 64 64" className="block overflow-visible">
        <path
          d="M22 5 L27 5 C29 10 35 10 37 5 L42 5 L58 13 L54 25 L46 22 L46 58 L18 58 L18 22 L10 25 L6 13 Z"
          fill={filled ? "oklch(0.20 0.015 260)" : "none"}
          stroke={filled ? "oklch(0.96 0.01 260)" : "oklch(0.65 0.02 260)"}
          strokeWidth={filled ? 2 : 1.75}
          strokeLinejoin="round"
        />
      </svg>
      <div
        className="absolute inset-x-0 flex items-center justify-center font-heading font-bold tabular-nums"
        style={{
          top: "36%",
          height: "50%",
          fontSize: fontPx,
          letterSpacing: "-0.03em",
          transform: "skewX(-7deg)",
          color: filled ? "var(--color-accent)" : "var(--color-muted)",
        }}
      >
        {number}
      </div>
    </div>
  );
}
