import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Grain } from "@/components/atmosphere/Grain";
import { LightBeams } from "@/components/atmosphere/LightBeams";
import { HeroBallStage } from "@/components/hero/HeroBallStage";
import { LastResultCard } from "@/components/home/LastResultCard";
import { HomeNewsCard } from "@/components/home/HomeNewsCard";
import { NextMatchCard } from "@/components/home/NextMatchCard";
import { PositionTeaser } from "@/components/home/PositionTeaser";
import { SquadPitchPreview } from "@/components/home/SquadPitchPreview";
import { PLACEHOLDER_STANDINGS } from "@/components/home/sample-data";
import { listPlayers } from "@/actions/players";
import { getLastResult, getUpcomingForHome } from "@/actions/fixtures";
import { listPublishedNews } from "@/actions/news";
import { mapDbNewsItem } from "@/components/news/map-db-article";

// Fetches live squad/fixture/news data — don't statically prerender at
// build time (the database isn't reachable from the build step on Vercel).
export const dynamic = "force-dynamic";

const HERO_CUT = "[clip-path:polygon(0_0,100%_0,100%_100%,64px_100%,0_calc(100%-64px))]";

export default async function HomePage() {
  const [players, nextMatch, lastResult, news] = await Promise.all([
    listPlayers(),
    getUpcomingForHome(),
    getLastResult(),
    listPublishedNews(),
  ]);
  const latestNews = news.slice(0, 3).map(mapDbNewsItem);

  return (
    <>
      <SiteHeader active="Home" />

      <main className="flex-1">
        <section
          className={`relative overflow-hidden border-b border-fg/10 bg-[radial-gradient(130%_110%_at_30%_0%,oklch(0.235_0.02_260)_0%,oklch(0.16_0.01_260)_55%,oklch(0.13_0.01_260)_100%)] ${HERO_CUT}`}
        >
          <LightBeams />
          <Grain opacity={0.45} />
          <div className="relative mx-auto flex max-w-app flex-col-reverse items-center gap-8 px-4 py-14 sm:px-8 sm:py-16 lg:flex-row lg:justify-between lg:gap-12 lg:py-20">
            <div className="animate-reveal-up flex max-w-xl flex-col gap-4 text-center lg:text-left">
              <div className="flex items-center justify-center gap-2 font-heading text-xs font-medium tracking-[0.14em] text-muted uppercase lg:justify-start">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Est. 2026 · Non-league
              </div>
              <h1 className="font-heading text-4xl leading-[0.95] font-bold text-balance uppercase tracking-tight sm:text-5xl lg:text-6xl">
                Blessed{" "}
                <span className="bg-[linear-gradient(100deg,var(--color-accent)_0%,var(--color-accent-amber)_100%)] bg-clip-text text-transparent">
                  Ground
                </span>
              </h1>
              <p className="text-pretty text-lg leading-relaxed text-fg sm:text-xl">
                Built on grit, grown on the terraces, carried by everyone who shows up. Follow OHC FC through every
                matchday, every lineup, every result.
              </p>
            </div>

            <div className="animate-reveal-up" style={{ animationDelay: "120ms" }}>
              <HeroBallStage />
            </div>
          </div>
        </section>

        <SquadPitchPreview players={players} />

        <section className="mx-auto flex max-w-app flex-col gap-4 px-4 py-8 sm:flex-row sm:px-8 sm:py-10">
          <div className="sm:flex-1">
            {nextMatch ? (
              <NextMatchCard match={nextMatch} />
            ) : (
              <div className="flex h-full flex-col justify-center gap-1.5 rounded-md border border-fg/10 bg-surface-2 p-6 shadow-resting [clip-path:polygon(0_0,calc(100%-32px)_0,100%_32px,100%_100%,0_100%)]">
                <span className="font-heading text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                  Next match
                </span>
                <span className="text-sm leading-relaxed text-muted">Nothing scheduled yet — check back soon.</span>
              </div>
            )}
          </div>
          <div className="sm:w-72 sm:flex-none">
            <PositionTeaser standings={PLACEHOLDER_STANDINGS} />
          </div>
        </section>

        <section className="mx-auto flex max-w-app flex-col gap-10 border-t border-fg/10 px-4 py-8 sm:px-8 sm:py-12 lg:flex-row lg:gap-12 lg:py-16">
          <div className="flex flex-col gap-5 lg:w-[380px] lg:flex-none">
            <h2 className="font-heading text-2xl leading-none font-semibold uppercase sm:text-3xl">Last result</h2>
            {lastResult ? (
              <LastResultCard result={lastResult} />
            ) : (
              <p className="text-sm text-muted">No results yet.</p>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-heading text-2xl leading-none font-semibold uppercase sm:text-3xl">Latest</h2>
              <Link
                href="/news"
                className="font-heading text-xs font-medium tracking-[0.1em] text-muted no-underline uppercase hover:text-accent"
              >
                All news
              </Link>
            </div>
            {latestNews.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {latestNews.map((item, index) => (
                  <HomeNewsCard key={item.slug} item={item} delayMs={index * 70} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No news yet.</p>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
