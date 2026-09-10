import { formatDay, formatLongDate, formatShortDate } from "@/lib/format-kickoff";
import type { ArticleBody, NewsItem } from "./types";

type DbArticle = {
  slug: string;
  title: string;
  kind: string;
  excerpt: string;
  body: string;
  byline: string | null;
  competition: string | null;
  ourScore: number | null;
  theirScore: number | null;
  startingXi: string | null;
  subs: string | null;
  publishedAt: Date;
};

const WORDS_PER_MINUTE = 200;

function estimateReadTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

export function mapDbNewsItem(article: DbArticle): NewsItem {
  return {
    slug: article.slug,
    day: formatDay(article.publishedAt),
    date: formatShortDate(article.publishedAt),
    kind: article.kind as NewsItem["kind"],
    title: article.title,
    excerpt: article.excerpt,
  };
}

export function mapDbArticleBody(article: DbArticle): ArticleBody {
  return {
    slug: article.slug,
    title: article.title,
    kind: article.kind as ArticleBody["kind"],
    byline: article.byline ?? "OHC FC",
    date: formatLongDate(article.publishedAt),
    readTime: estimateReadTime(article.body),
    excerpt: article.excerpt,
    paragraphs: article.body
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
    competition: article.competition,
    us: article.ourScore,
    them: article.theirScore,
    startingXi: article.startingXi,
    subs: article.subs,
  };
}
