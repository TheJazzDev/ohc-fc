export type IndexPageEntry = {
  num: string;
  label: string;
  href: string;
  description: string;
  widths: string;
};

export const INDEX_PAGES: IndexPageEntry[] = [
  {
    num: "01",
    label: "Home",
    href: "/",
    description: "Hero with the interactive floodlit ball, fixture teaser, latest strip.",
    widths: "390 · 834 · 1440",
  },
  {
    num: "02",
    label: "Squad",
    href: "/squad",
    description: "Position filters and flip cards for the full 2026/27 roster.",
    widths: "390 · 834 · 1440",
  },
  {
    num: "03",
    label: "Matchday",
    href: "/matchday",
    description: "Broadcast lineup graphic, bench sheet, and the empty state.",
    widths: "390 · 834 · 1440",
  },
  {
    num: "04",
    label: "Fixtures",
    href: "/fixtures",
    description: "Upcoming and results behind a live toggle.",
    widths: "390 · 1440",
  },
  {
    num: "05",
    label: "News",
    href: "/news",
    description: "Report feed plus the article page.",
    widths: "390 · 1440",
  },
  {
    num: "06",
    label: "Club",
    href: "/club",
    description: "About, sponsors, contact on one page.",
    widths: "1440",
  },
];
