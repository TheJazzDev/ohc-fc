"use client";

import { useMemo, useState } from "react";
import { FeaturedArticleCard } from "./FeaturedArticleCard";
import { NewsFeedCard } from "./NewsFeedCard";
import { NewsSearch } from "./NewsSearch";
import type { ArticleBody, NewsItem } from "./types";

export function NewsSection({ feed, featured }: { feed: NewsItem[]; featured: ArticleBody }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return feed;
    return feed.filter((item) => item.title.toLowerCase().includes(q));
  }, [feed, query]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="font-heading text-xs font-medium tracking-[0.14em] text-muted uppercase">
            Match reports · Club news
          </span>
          <h1 className="font-heading text-4xl leading-[0.95] font-bold uppercase sm:text-5xl lg:text-6xl">
            <span className="bg-[linear-gradient(100deg,var(--color-accent)_0%,var(--color-accent-amber)_100%)] bg-clip-text text-transparent">
              News
            </span>
          </h1>
        </div>
        <NewsSearch value={query} onChange={setQuery} />
      </div>

      <FeaturedArticleCard article={featured} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, index) => (
          <NewsFeedCard key={`${item.slug}-${item.date}`} item={item} delayMs={index * 70} />
        ))}
        {visible.length === 0 && <p className="text-sm text-muted">No reports match &quot;{query}&quot;.</p>}
      </div>
    </div>
  );
}
