import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Grain } from "@/components/atmosphere/Grain";
import { LightBeams } from "@/components/atmosphere/LightBeams";
import { FixturesSection } from "@/components/fixtures/FixturesSection";
import { PLACEHOLDER_TABLE } from "@/components/fixtures/sample-data";
import { listResults, listUpcomingFixtures } from "@/actions/fixtures";

// Fetches live fixture data — don't statically prerender at build time
// (the database isn't reachable from the build step on Vercel).
export const dynamic = "force-dynamic";

export default async function FixturesPage() {
  const [upcoming, results] = await Promise.all([listUpcomingFixtures(), listResults()]);

  return (
    <>
      <SiteHeader active="Fixtures" />
      <div className="relative flex-1 overflow-hidden bg-[radial-gradient(120%_90%_at_25%_0%,oklch(0.215_0.018_260)_0%,oklch(0.16_0.01_260)_58%,oklch(0.13_0.01_260)_100%)]">
        <LightBeams />
        <Grain opacity={0.4} />
        <main className="relative mx-auto flex max-w-app flex-col gap-5 px-4 py-8 sm:gap-6 sm:px-8 sm:py-12 lg:grid lg:grid-cols-[340px_1fr] lg:items-start lg:gap-x-12 lg:gap-y-6 lg:py-16">
          <FixturesSection upcoming={upcoming} results={results} table={PLACEHOLDER_TABLE} />
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
