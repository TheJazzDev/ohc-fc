import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Grain } from "@/components/atmosphere/Grain";
import { LightBeams } from "@/components/atmosphere/LightBeams";
import { BenchList } from "@/components/matchday/BenchList";
import { MatchHeader } from "@/components/matchday/MatchHeader";
import { PitchStage } from "@/components/matchday/PitchStage";
import { getNextFixture } from "@/actions/fixtures";

export default async function MatchdayPage() {
  const next = await getNextFixture();

  return (
    <>
      <SiteHeader active="Matchday" />
      <div className="relative flex-1 overflow-hidden bg-[radial-gradient(120%_90%_at_25%_0%,oklch(0.215_0.018_260)_0%,oklch(0.16_0.01_260)_58%,oklch(0.13_0.01_260)_100%)]">
        <LightBeams />
        <Grain opacity={0.4} />
        <main className="relative mx-auto flex max-w-app flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-8 sm:py-12 lg:py-16">
          {!next ? (
            <div className="flex flex-col items-center gap-3 rounded-md border border-fg/10 bg-surface-2/70 px-6 py-14 text-center shadow-raised">
              <div className="font-heading text-2xl leading-tight font-semibold uppercase">No match scheduled</div>
              <p className="m-0 max-w-sm text-pretty text-sm leading-relaxed text-muted">
                There&apos;s nothing on the calendar right now. Check back once the next fixture is confirmed.
              </p>
              <Link
                href="/fixtures"
                className="mt-1 inline-flex h-11 items-center justify-center rounded-md border border-accent px-5 font-heading text-sm font-semibold tracking-wider text-accent uppercase no-underline transition-colors hover:bg-accent/12"
              >
                All fixtures
              </Link>
            </div>
          ) : (
            <>
              <MatchHeader match={next.match} />

              <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-10">
                <div className="flex flex-col gap-8">
                  <PitchStage match={next.match} starters={next.starters} />
                  {next.match.announced && next.bench.length > 0 && (
                    <div className="lg:hidden">
                      <BenchList bench={next.bench} />
                    </div>
                  )}
                </div>

                <aside className="hidden flex-col gap-6 lg:flex">
                  {next.match.announced && next.bench.length > 0 && <BenchList bench={next.bench} />}
                  <Link
                    href="/fixtures"
                    className="inline-flex h-11 items-center justify-center rounded-md border border-accent px-5 font-heading text-sm font-semibold tracking-wider text-accent uppercase no-underline transition-colors hover:bg-accent/12"
                  >
                    All fixtures
                  </Link>
                </aside>
              </div>

              <div className="lg:hidden">
                <Link
                  href="/fixtures"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-accent px-5 font-heading text-sm font-semibold tracking-wider text-accent uppercase no-underline transition-colors hover:bg-accent/12"
                >
                  All fixtures
                </Link>
              </div>
            </>
          )}
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
