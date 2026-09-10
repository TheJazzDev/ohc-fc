import type { ArticleBody, NewsItem } from "./types";

// Placeholder editorial content standing in for a real CMS/data source.
export const FEATURED_ARTICLE_SLUG = "adeyemi-brace-sinks-marlow";

export const SAMPLE_NEWS_FEED: NewsItem[] = [
  {
    slug: FEATURED_ARTICLE_SLUG,
    day: "05",
    date: "Fri 5 Sep",
    kind: "CLUB NEWS",
    title: "Thornbridge tie set for Saturday: ticket details",
    excerpt: "Gates open at 1:30PM. Terrace tickets on the day, cash or card. Under-16s free with a paying adult.",
  },
  {
    slug: FEATURED_ARTICLE_SLUG,
    day: "24",
    date: "Sat 24 Aug",
    kind: "MATCH REPORT",
    title: "Point on the road at Kingsbury",
    excerpt: "A late Balogun equaliser earns a hard-fought draw on a heavy pitch. Not pretty, but it counts.",
  },
  {
    slug: FEATURED_ARTICLE_SLUG,
    day: "20",
    date: "Tue 20 Aug",
    kind: "MATCH REPORT",
    title: "Cup exit at the first hurdle",
    excerpt: "Eastfield United take the County Cup tie 2–0 on a night when nothing quite dropped for us.",
  },
];

export const SAMPLE_ARTICLE: ArticleBody = {
  slug: FEATURED_ARTICLE_SLUG,
  title: "Adeyemi brace sinks Marlow under the lights",
  byline: "By Ade Okafor, club media",
  date: "Saturday 31 August",
  readTime: "6 min read",
  competition: "FULL TIME · LEAGUE",
  us: 2,
  them: 1,
  paragraphs: [
    "OHC FC 2, Marlow Town 1. The floodlights had barely warmed up when Adeyemi opened his account for the night, sliding in at the back post to finish a low cross from Nwosu after 23 minutes. Pearson Park, already loud, got louder.",
    "Marlow came back into it after the break and levelled through a scrambled corner on 58 minutes. For a spell the visitors had the ball and the momentum. Mensah kept it at one with a strong hand at his near post, and Osei headed clear more times than anyone counted.",
    "Then, on 71, the moment. Chukwu found a pocket between the lines, turned, and slipped Adeyemi through. One touch to steady, one to finish. Two–one, and the terrace behind the goal did the rest.",
  ],
  startingXi: "Mensah; Coker, Osei, Bello, Nwosu; Yusuf, Balogun, Chukwu; Diallo, Adeyemi, Bassey.",
  subs: "Subs: Farrell, Musa, Eze, Achara, Ibe.",
};
