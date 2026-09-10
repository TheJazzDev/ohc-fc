import { Jersey } from "@/components/shared/Jersey";
import type { BenchPlayer } from "./types";

export function BenchList({ bench }: { bench: BenchPlayer[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h2 className="font-heading text-2xl leading-none font-semibold uppercase sm:text-[26px]">Bench</h2>
        <span className="font-heading text-[11px] tracking-[0.12em] text-muted">{bench.length} SUBS</span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1 lg:hidden" style={{ scrollbarWidth: "none" }}>
        {bench.map((player, index) => (
          <div
            key={player.number}
            className="animate-reveal-up flex w-[120px] flex-none flex-col items-center gap-2 rounded-md border border-fg/8 bg-surface-2 px-2.5 py-4 shadow-resting [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,0_100%)]"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <Jersey number={player.number} variant="outline" size={52} />
            <div className="font-heading text-sm leading-tight font-semibold whitespace-nowrap">{player.name}</div>
            <div className="font-heading text-[11px] font-medium tracking-[0.1em] text-muted">{player.pos}</div>
          </div>
        ))}
      </div>

      <div className="hidden flex-col lg:flex">
        {bench.map((player, index) => (
          <div
            key={player.number}
            className="animate-reveal-up flex h-[72px] items-center gap-4 border-b border-fg/6"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <Jersey number={player.number} variant="outline" size={48} />
            <div className="flex-1 font-heading text-base leading-tight font-semibold">{player.name}</div>
            <span className="inline-flex h-6 items-center rounded-md border border-accent/35 px-2.5 font-heading text-[11px] font-semibold tracking-wider text-muted">
              {player.pos}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
