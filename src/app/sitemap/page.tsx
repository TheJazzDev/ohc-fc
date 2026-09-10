import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Grain } from "@/components/atmosphere/Grain";
import { LightBeams } from "@/components/atmosphere/LightBeams";
import { HeroBallStage } from "@/components/hero/HeroBallStage";
import { PageCard } from "@/components/index-page/PageCard";
import { INDEX_PAGES } from "@/components/index-page/pages-data";

const HERO_CUT = "[clip-path:polygon(0_0,100%_0,100%_100%,64px_100%,0_calc(100%-64px))]";

export default function SitemapPage() {
  return (
    <>
      <SiteHeader active="Sitemap" />

      <main className="flex-1">
      <section
        className={`relative overflow-hidden border-b border-fg/10 bg-[radial-gradient(130%_110%_at_30%_0%,oklch(0.235_0.02_260)_0%,oklch(0.16_0.01_260)_55%,oklch(0.13_0.01_260)_100%)] ${HERO_CUT}`}
      >
        <LightBeams />
        <Grain opacity={0.45} />
        <div className="relative mx-auto flex max-w-6xl flex-col-reverse items-center gap-8 px-4 py-14 sm:px-8 sm:py-16 lg:flex-row lg:justify-between lg:gap-12 lg:py-20">
          <div className="animate-reveal-up flex max-w-xl flex-col gap-4 text-center lg:text-left">
            <div className="flex items-center justify-center gap-2 font-heading text-xs font-medium tracking-[0.14em] text-muted uppercase lg:justify-start">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              OHC FC · Est. 2026 · Floodlight
            </div>
            <h1 className="font-heading text-4xl leading-[0.95] font-bold text-balance uppercase tracking-tight sm:text-5xl lg:text-6xl">
              The{" "}
              <span className="bg-[linear-gradient(100deg,var(--color-accent)_0%,var(--color-accent-amber)_100%)] bg-clip-text text-transparent">
                index
              </span>
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
              Every screen in the OHC FC site, plus the system it&apos;s built from. Each card below is a real route
              as it gets implemented.
            </p>
          </div>

          <div className="animate-reveal-up" style={{ animationDelay: "120ms" }}>
            <HeroBallStage />
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:gap-6 sm:px-8 sm:py-12 lg:py-16">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-2xl font-semibold uppercase sm:text-3xl lg:text-4xl">Pages</h2>
          <span className="font-heading text-[11px] tracking-[0.12em] text-muted sm:text-xs">390 · 834 · 1440</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {INDEX_PAGES.map((page, index) => (
            <PageCard key={page.href} {...page} delayMs={index * 70} />
          ))}
        </div>
      </section>
      </main>

      <SiteFooter />
    </>
  );
}
