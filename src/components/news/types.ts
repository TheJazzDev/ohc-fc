export type NewsKind = "CLUB_NEWS" | "MATCH_REPORT";

export type NewsItem = {
  slug: string;
  day: string;
  date: string;
  kind: NewsKind;
  title: string;
  excerpt: string;
};

export type ArticleBody = {
  slug: string;
  title: string;
  kind: NewsKind;
  byline: string;
  date: string;
  readTime: string;
  excerpt: string;
  paragraphs: string[];
  competition: string | null;
  us: number | null;
  them: number | null;
  startingXi: string | null;
  subs: string | null;
};

export const KIND_LABEL: Record<NewsKind, string> = {
  CLUB_NEWS: "CLUB NEWS",
  MATCH_REPORT: "MATCH REPORT",
};
