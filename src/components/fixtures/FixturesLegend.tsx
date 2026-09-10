export function FixturesLegend() {
  return (
    <div className="hidden flex-col gap-2 text-sm text-muted lg:flex">
      <div className="flex items-center gap-2">
        <span className="flex h-[22px] w-[22px] items-center justify-center rounded border border-fg/20 font-heading text-xs font-semibold text-fg">
          H
        </span>
        <span>Home · Pearson Park</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex h-[22px] w-[22px] items-center justify-center rounded border border-fg/20 font-heading text-xs font-semibold text-muted">
          A
        </span>
        <span>Away</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span>Win</span>
        <span className="ml-2 h-2 w-2 rounded-full border-[1.5px] border-muted" />
        <span>Draw / loss</span>
      </div>
    </div>
  );
}
