import Link from "next/link";
import type { ArticleBody } from "./types";

export function FeaturedArticleCard({ article }: { article: ArticleBody }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="animate-reveal-up grid grid-cols-1 overflow-hidden rounded-md border border-fg/10 bg-surface-2 text-fg no-underline shadow-resting transition-[background-color,box-shadow] hover:bg-[oklch(0.24_0.015_260)] hover:shadow-floating-lit sm:grid-cols-2 [clip-path:polygon(0_0,calc(100%-32px)_0,100%_32px,100%_100%,0_100%)]"
    >
      <div
        className="flex aspect-video flex-col justify-end gap-1.5 p-6 sm:p-8"
        style={{ background: "linear-gradient(180deg, oklch(0.36 0.1 150), oklch(0.26 0.08 150))" }}
      >
        <span className="font-heading text-[11px] font-medium tracking-[0.14em] text-fg/70 sm:text-xs">
          {article.competition}
        </span>
        <div className="flex items-baseline gap-3 font-heading text-5xl leading-[0.9] font-bold tabular-nums sm:gap-4 sm:text-[64px] lg:text-[96px]">
          <span className="skew-x-[-7deg] tracking-tight">{article.us}</span>
          <span className="skew-x-[-7deg] text-2xl font-medium text-fg/60 sm:text-3xl lg:text-5xl">–</span>
          <span className="skew-x-[-7deg] tracking-tight">{article.them}</span>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-3 p-6 sm:gap-4 sm:p-8 lg:p-10">
        <span className="font-heading text-xs font-medium tracking-[0.12em] text-accent uppercase">Match report</span>
        <h2 className="m-0 text-balance font-heading text-2xl leading-[1.05] font-semibold sm:text-3xl lg:text-4xl">
          {article.title}
        </h2>
        <p className="m-0 text-pretty text-sm leading-relaxed text-muted sm:text-base">
          Two goals from the number nine, one nervy final ten minutes, and three points that keep the unbeaten start
          alive at Pearson Park.
        </p>
        <span className="font-heading text-xs tracking-[0.1em] text-muted uppercase">
          {article.date} · {article.readTime}
        </span>
      </div>
    </Link>
  );
}
