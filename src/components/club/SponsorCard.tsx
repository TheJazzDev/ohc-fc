export function SponsorCard({ name, color, delayMs = 0 }: { name: string; color: string; delayMs?: number }) {
  return (
    <a
      href="#"
      style={{ animationDelay: `${delayMs}ms` }}
      className="animate-reveal-up flex h-28 items-center justify-center rounded-2xl border border-fg/8 bg-surface-2 no-underline shadow-resting grayscale opacity-60 transition-[filter,opacity,background-color,box-shadow] duration-200 hover:bg-[oklch(0.24_0.015_260)] hover:opacity-100 hover:shadow-raised hover:grayscale-0 [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,0_100%)]"
    >
      <div className="flex flex-col items-center gap-1.5 px-4 text-center">
        <span className="font-heading text-xl font-bold tracking-wide uppercase" style={{ color }}>
          {name}
        </span>
        <span className="font-mono text-[9px] font-medium tracking-[0.1em] text-muted uppercase">sponsor logo</span>
      </div>
    </a>
  );
}
