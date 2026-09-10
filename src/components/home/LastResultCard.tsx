import Link from "next/link";
import type { LastResult } from "./types";

export function LastResultCard({ result }: { result: LastResult }) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-fg/10 bg-surface-2 p-6">
      <div className="flex justify-between font-heading text-[11px] font-medium tracking-[0.12em] text-muted">
        <span>
          {result.competition} · {result.venue === "HOME" ? "HOME" : "AWAY"}
        </span>
        <span>{result.date.toUpperCase()}</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <span className="font-heading text-lg leading-tight font-semibold sm:text-xl">OHC FC</span>
        <div className="flex items-baseline gap-2.5 font-heading text-4xl leading-none font-bold tabular-nums sm:gap-3 sm:text-[46px]">
          <span className="skew-x-[-7deg] tracking-tight text-accent">{result.us}</span>
          <span className="skew-x-[-7deg] text-lg font-medium text-muted sm:text-2xl">–</span>
          <span className="skew-x-[-7deg] tracking-tight">{result.them}</span>
        </div>
        <span className="text-right font-heading text-lg leading-tight font-semibold sm:text-xl">
          {result.opponent}
        </span>
      </div>
      <span className="text-sm leading-relaxed text-muted">{result.scorers}</span>
      <Link
        href="/fixtures"
        className="font-heading text-xs font-medium tracking-[0.1em] text-muted no-underline uppercase hover:text-accent"
      >
        All results
      </Link>
    </div>
  );
}
