export type NewsItem = {
  slug: string;
  day: string;
  date: string;
  kind: "CLUB NEWS" | "MATCH REPORT";
  title: string;
  excerpt: string;
};

export type ArticleBody = {
  slug: string;
  title: string;
  byline: string;
  date: string;
  readTime: string;
  competition: string;
  us: number;
  them: number;
  paragraphs: string[];
  startingXi: string;
  subs: string;
};
