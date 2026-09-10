"use client";

import { useState } from "react";

export type PlayerFlipCardProps = {
  name: string;
  number: number;
  pos: string;
  initials: string;
  bio: string;
  photoUrl?: string | null;
  titleSize?: number;
};

export function PlayerFlipCard({ name, number, pos, initials, bio, photoUrl = null, titleSize = 18 }: PlayerFlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  function toggle() {
    setFlipped((value) => !value);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      className="cursor-pointer rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent"
      style={{ perspective: "1200px" }}
    >
      <div
        className="grid h-[232px] transition-transform duration-500"
        style={{
          transitionTimingFunction: "cubic-bezier(.2,.7,.2,1)",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="col-start-1 row-start-1 flex h-full flex-col items-center justify-center gap-3 rounded-md border border-fg/10 bg-surface-2 px-4 py-5 text-center shadow-resting transition-[background-color,box-shadow] duration-150 hover:bg-[oklch(0.24_0.015_260)] hover:shadow-raised active:scale-[0.98]"
          style={{ backfaceVisibility: "hidden", opacity: flipped ? 0 : 1, transition: "opacity 0ms 250ms" }}
        >
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt={name} className="h-[72px] w-[72px] rounded-full border border-fg/14 object-cover" />
          ) : (
            <div
              className="flex h-[72px] w-[72px] items-center justify-center rounded-full font-heading text-2xl font-bold tracking-wide text-surface"
              style={{ background: "linear-gradient(150deg, oklch(0.87 0.22 125) 0%, oklch(0.36 0.1 150) 100%)" }}
            >
              {initials}
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <div className="font-heading leading-tight font-semibold tracking-wide" style={{ fontSize: titleSize }}>
              {name}
            </div>
            <div className="font-heading text-xs font-medium tracking-[0.1em] whitespace-nowrap text-muted uppercase">
              #{number} · {pos}
            </div>
          </div>
        </div>

        <div
          className="col-start-1 row-start-1 flex h-full flex-col justify-between gap-2.5 overflow-hidden rounded-md border border-accent/35 bg-[oklch(0.24_0.015_260)] px-4 py-[18px]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", opacity: flipped ? 1 : 0, transition: "opacity 0ms 250ms" }}
        >
          <div className="flex items-baseline justify-between gap-2">
            <div className="font-heading text-base leading-tight font-semibold">{name}</div>
            <div className="skew-x-[-7deg] font-heading text-lg font-bold tabular-nums tracking-tight text-accent">
              #{number}
            </div>
          </div>
          <p className="m-0 line-clamp-4 flex-1 text-pretty text-[13px] leading-relaxed text-fg/85">{bio}</p>
          <div className="font-heading text-[11px] font-medium tracking-[0.12em] text-muted uppercase">
            Tap to flip back
          </div>
        </div>
      </div>
    </div>
  );
}
