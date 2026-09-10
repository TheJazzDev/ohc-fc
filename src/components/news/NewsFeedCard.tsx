import Link from "next/link";
import type { NewsItem } from "./types";

export function NewsFeedCard({ item, delayMs = 0 }: { item: NewsItem; delayMs?: number }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      style={{ animationDelay: `${delayMs}ms` }}
      className="animate-reveal-up flex flex-col overflow-hidden rounded-md border border-fg/10 bg-surface-2 text-fg no-underline shadow-resting transition-[background-color,box-shadow] hover:bg-[oklch(0.24_0.015_260)] hover:shadow-raised [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,0_100%)]"
    >
      <div
        className="flex aspect-video items-end justify-between p-4"
        style={{ background: "linear-gradient(180deg, oklch(0.36 0.1 150), oklch(0.26 0.08 150))" }}
      >
        <span className="skew-x-[-7deg] font-heading text-3xl leading-[0.9] font-bold tabular-nums tracking-tight text-fg/85 sm:text-4xl">
          {item.day}
        </span>
        <span className="font-heading text-[11px] font-medium tracking-[0.12em] text-fg/70">{item.kind}</span>
      </div>
      <div className="flex flex-col gap-2 p-5">
        <div className="text-pretty font-heading text-lg leading-tight font-semibold sm:text-xl">{item.title}</div>
        <p className="m-0 text-sm leading-relaxed text-muted">{item.excerpt}</p>
        <span className="font-heading text-[11px] tracking-[0.1em] text-muted uppercase">{item.date}</span>
      </div>
    </Link>
  );
}
