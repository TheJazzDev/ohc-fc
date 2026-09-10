import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Grain } from "@/components/atmosphere/Grain";
import { LightBeams } from "@/components/atmosphere/LightBeams";
import { NewsSection } from "@/components/news/NewsSection";
import { listPublishedNews } from "@/actions/news";
import { mapDbArticleBody, mapDbNewsItem } from "@/components/news/map-db-article";

// Fetches live news data — don't statically prerender at build time
// (the database isn't reachable from the build step on Vercel).
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const articles = await listPublishedNews();
  const [latest, ...rest] = articles;

  return (
    <>
      <SiteHeader active="News" />
      <div className="relative flex-1 overflow-hidden bg-[radial-gradient(120%_90%_at_25%_0%,oklch(0.215_0.018_260)_0%,oklch(0.16_0.01_260)_58%,oklch(0.13_0.01_260)_100%)]">
        <LightBeams />
        <Grain opacity={0.4} />
        <main className="relative mx-auto max-w-app px-4 py-8 sm:px-8 sm:py-12 lg:py-16">
          {latest ? (
            <NewsSection feed={rest.map(mapDbNewsItem)} featured={mapDbArticleBody(latest)} />
          ) : (
            <p className="text-sm text-muted">No news yet — check back soon.</p>
          )}
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
