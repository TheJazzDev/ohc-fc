import { Jersey } from "./Jersey";

type PlayerTokenProps = {
  number: number;
  name?: string;
  photoUrl?: string | null;
  /** Matches the Jersey size it replaces, so pitch layouts never shift. */
  size?: number;
  variant?: "filled" | "outline";
};

/**
 * How a player appears on a pitch or bench: their photo as a round crop with
 * the squad number badged on it, or the numbered shirt when there is no photo.
 *
 * Both branches occupy exactly `size` square, so a half-photographed squad
 * still lines up.
 */
export function PlayerToken({ number, name, photoUrl, size = 52, variant = "filled" }: PlayerTokenProps) {
  if (!photoUrl) {
    return <Jersey number={number} variant={variant} size={size} />;
  }

  const badge = Math.max(16, Math.round(size * 0.42));

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt={name ?? `Player ${number}`}
        className="h-full w-full rounded-full border border-fg/20 object-cover shadow-resting"
      />
      <span
        className="absolute right-0 bottom-0 flex items-center justify-center rounded-full border border-surface bg-fg font-heading font-bold tabular-nums text-surface"
        style={{ width: badge, height: badge, fontSize: Math.round(badge * 0.58), transform: "translate(12%, 12%)" }}
      >
        {number}
      </span>
    </div>
  );
}
