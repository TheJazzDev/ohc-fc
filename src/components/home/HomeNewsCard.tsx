import Link from "next/link";
import type { NewsItem } from "@/components/news/types";

export function HomeNewsCard({ item, delayMs = 0 }: { item: NewsItem; delayMs?: number }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      style={{ animationDelay: `${delayMs}ms` }}
      className="animate-reveal-up flex flex-col overflow-hidden rounded-md border border-fg/10 bg-surface-2 text-fg no-underline shadow-resting transition-[background-color,box-shadow] hover:bg-[oklch(0.24_0.015_260)] hover:shadow-raised [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,0_100%)]"
    >
      <div
        className="flex aspect-video items-end p-3.5"
        style={{ background: "linear-gradient(180deg, oklch(0.36 0.1 150), oklch(0.26 0.08 150))" }}
      >
        <span className="skew-x-[-7deg] font-heading text-2xl leading-[0.9] font-bold tabular-nums tracking-tight text-fg/85 sm:text-3xl">
          {item.day}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <div className="text-pretty font-heading text-base leading-tight font-semibold sm:text-lg">{item.title}</div>
        <span className="font-heading text-[11px] tracking-[0.1em] text-muted uppercase">{item.date}</span>
      </div>
    </Link>
  );
}
