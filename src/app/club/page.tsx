import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Grain } from "@/components/atmosphere/Grain";
import { LightBeams } from "@/components/atmosphere/LightBeams";
import { SponsorCard } from "@/components/club/SponsorCard";
import { CLUB_STATS, SOCIALS, SPONSORS } from "@/components/club/sample-data";

const HERO_CUT = "[clip-path:polygon(0_0,100%_0,100%_100%,64px_100%,0_calc(100%-64px))]";

export default function ClubPage() {
  return (
    <>
      <SiteHeader active="Club" />

      <main className="flex-1">
      <section
        className={`relative overflow-hidden border-b border-fg/10 bg-[radial-gradient(130%_110%_at_30%_0%,oklch(0.235_0.02_260)_0%,oklch(0.16_0.01_260)_55%,oklch(0.13_0.01_260)_100%)] ${HERO_CUT}`}
      >
        <LightBeams />
        <Grain opacity={0.45} />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:px-8 sm:py-16 lg:flex-row lg:items-start lg:gap-16 lg:py-20">
          <div className="animate-reveal-up flex flex-col gap-3">
            <span className="font-heading text-xs font-medium tracking-[0.14em] text-muted uppercase">
              Est. 2026 · Non-league
            </span>
            <h1 className="font-heading text-4xl leading-[0.95] font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl">
              The{" "}
              <span className="bg-[linear-gradient(100deg,var(--color-accent)_0%,var(--color-accent-amber)_100%)] bg-clip-text text-transparent">
                club
              </span>
            </h1>
          </div>

          <div className="animate-reveal-up flex max-w-2xl flex-col gap-5" style={{ animationDelay: "120ms" }}>
            <p className="text-pretty text-lg leading-relaxed sm:text-xl">
              Founded in 2026 on a Saturday-morning kickabout that refused to stop, OHC FC is out to become the
              loudest corner of the town. The badge is new, the shirt is new, and the committee is just getting
              started &mdash; but the noise from the terrace is already there.
            </p>
            <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
              Every player has a day job. Every steward is a volunteer. Every result matters more than it should.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-1 sm:gap-6">
              {CLUB_STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="skew-x-[-7deg] font-heading text-3xl font-bold tabular-nums tracking-tight sm:text-[46px]">
                    {stat.value}
                  </span>
                  <span className="font-heading text-[11px] tracking-[0.12em] text-muted uppercase sm:text-xs">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col gap-5 border-b border-fg/10 px-4 py-8 sm:gap-6 sm:px-8 sm:py-12">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-2xl font-semibold uppercase sm:text-3xl">Partners</h2>
          <span className="font-heading text-[11px] tracking-[0.12em] text-muted sm:text-xs">2026/27 sponsors</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {SPONSORS.map((sponsor, index) => (
            <SponsorCard key={sponsor.name} name={sponsor.name} color={sponsor.color} delayMs={index * 70} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-3 sm:gap-10 sm:px-8 sm:py-12">
        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-2xl font-semibold uppercase sm:text-3xl">Find us</h2>
          <p className="m-0 text-base leading-relaxed text-muted">
            Pearson Park
            <br />
            Open from 1:30PM on matchdays
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-2xl font-semibold uppercase sm:text-3xl">Contact</h2>
          <div className="flex flex-col gap-1.5 text-base leading-relaxed">
            <a href="mailto:hello@ohcfc.co.uk" className="no-underline">
              hello@ohcfc.co.uk
            </a>
            <a href="mailto:media@ohcfc.co.uk" className="no-underline">
              media@ohcfc.co.uk
            </a>
            <span className="text-muted">Sponsorship: committee@ohcfc.co.uk</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-2xl font-semibold uppercase sm:text-3xl">Follow</h2>
          <div className="flex flex-wrap gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social}
                href="#"
                className="inline-flex h-10 items-center rounded-full border border-fg/20 px-[18px] font-heading text-sm font-semibold tracking-wider uppercase no-underline transition-colors hover:border-accent hover:text-accent"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </section>
      </main>

      <SiteFooter />
    </>
  );
}
