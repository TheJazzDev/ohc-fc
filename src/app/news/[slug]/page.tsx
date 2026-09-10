import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SAMPLE_ARTICLE } from "@/components/news/sample-data";

const ARTICLES_BY_SLUG = { [SAMPLE_ARTICLE.slug]: SAMPLE_ARTICLE };

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES_BY_SLUG[slug as keyof typeof ARTICLES_BY_SLUG];
  if (!article) notFound();

  return (
    <>
      <SiteHeader active="News" />
      <main className="flex-1">
        <div
          className="flex aspect-video max-h-[420px] flex-col justify-end gap-1.5 px-4 py-8 sm:px-8 sm:py-12"
          style={{ background: "linear-gradient(180deg, oklch(0.36 0.1 150), oklch(0.26 0.08 150))" }}
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-1.5">
            <span className="font-heading text-[11px] font-medium tracking-[0.14em] text-fg/70 sm:text-xs">
              {article.competition}
            </span>
            <div className="flex items-baseline gap-3 font-heading text-6xl leading-[0.9] font-bold tabular-nums sm:text-8xl">
              <span className="skew-x-[-7deg] tracking-tight">{article.us}</span>
              <span className="skew-x-[-7deg] text-3xl font-medium text-fg/60 sm:text-5xl">–</span>
              <span className="skew-x-[-7deg] tracking-tight">{article.them}</span>
            </div>
          </div>
        </div>

        <article className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-8 sm:gap-6 sm:px-8 sm:py-12">
          <span className="font-heading text-xs font-medium tracking-[0.12em] text-accent uppercase">Match report</span>
          <h1 className="m-0 text-balance font-heading text-3xl leading-[1.05] font-bold sm:text-5xl">{article.title}</h1>
          <div className="flex flex-col gap-0.5 border-b border-fg/10 pb-5 text-sm text-muted">
            <span className="font-medium text-fg">{article.byline}</span>
            <span>
              {article.date} · {article.readTime}
            </span>
          </div>

          {article.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="m-0 text-[15px] leading-relaxed sm:text-base">
              {paragraph}
            </p>
          ))}

          <div className="flex flex-col gap-2 rounded-md border border-fg/10 bg-surface-2 p-5 shadow-resting [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,0_100%)]">
            <span className="font-heading text-[11px] font-medium tracking-[0.12em] text-muted uppercase">
              OHC FC · Starting XI
            </span>
            <p className="m-0 text-sm leading-relaxed text-fg/85">{article.startingXi}</p>
            <p className="m-0 text-sm leading-relaxed text-muted">{article.subs}</p>
          </div>

          <Link
            href="/fixtures"
            className="inline-flex h-11 w-fit items-center justify-center rounded-md border border-accent px-5 font-heading text-sm font-semibold tracking-wider text-accent uppercase no-underline transition-colors hover:bg-accent/12"
          >
            All results
          </Link>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
