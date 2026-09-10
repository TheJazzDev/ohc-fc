export function HomeAwayBadge({ home }: { home: boolean }) {
  return (
    <span
      className={`flex h-7 w-7 items-center justify-center justify-self-end rounded border font-heading text-xs font-semibold ${
        home ? "border-fg/20 text-fg" : "border-fg/20 text-muted"
      }`}
    >
      {home ? "H" : "A"}
    </span>
  );
}
