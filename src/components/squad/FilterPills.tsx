import type { Position } from "./types";

const FILTERS: ("All" | Position)[] = [
  "All",
  "GK",
  "CB",
  "FB",
  "DM",
  "CM",
  "AM",
  "W",
  "ST",
];

export function FilterPills({
  active,
  onChange,
}: {
  active: "All" | Position;
  onChange: (value: "All" | Position) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      {FILTERS.map((label) => {
        const isActive = label === active;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(label)}
            className={`h-10 flex-none rounded-full border px-[18px] font-heading text-sm font-semibold tracking-wider uppercase outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.97] ${
              isActive ? "border-fg bg-fg text-surface" : "border-fg/20 bg-transparent text-muted"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
