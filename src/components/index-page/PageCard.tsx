import Link from "next/link";
import type { IndexPageEntry } from "./pages-data";

const CARD_CUT = "[clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,0_100%)]";

export function PageCard({ num, label, href, description, widths, delayMs = 0 }: IndexPageEntry & { delayMs?: number }) {
  return (
    <Link
      href={href}
      style={{ animationDelay: `${delayMs}ms` }}
      className={`animate-reveal-up group flex flex-col gap-3 rounded-md border border-fg/10 bg-surface-2 p-5 text-fg no-underline shadow-resting transition-[background-color,box-shadow,transform] duration-150 hover:bg-[oklch(0.24_0.015_260)] hover:shadow-floating-lit active:scale-[0.99] sm:p-6 ${CARD_CUT}`}
    >
      <div className="flex items-baseline justify-between">
        <span className="skew-x-[-7deg] font-heading text-base font-bold tracking-tight text-muted tabular-nums">
          {num}
        </span>
        <span className="font-heading text-[11px] font-medium tracking-[0.12em] text-muted">{widths}</span>
      </div>
      <div className="font-heading text-xl leading-tight font-semibold tracking-wide uppercase sm:text-2xl">
        {label}
      </div>
      <p className="m-0 text-sm leading-relaxed text-muted">{description}</p>
      <div className="mt-1 flex items-center gap-1.5 font-heading text-xs font-medium tracking-[0.1em] text-fg uppercase">
        Open
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </div>
    </Link>
  );
}
