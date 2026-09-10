"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavItem } from "./nav-items";

export function MobileNav({ items, activeLabel }: { items: NavItem[]; activeLabel: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="-mr-2.5 flex h-11 w-11 items-center justify-center rounded text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          {open ? (
            <>
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </>
          ) : (
            <>
              <line x1="3" y1="8" x2="21" y2="8" />
              <line x1="3" y1="16" x2="21" y2="16" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-fg/10 bg-surface px-5 py-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`rounded px-3 py-2.5 font-heading text-sm font-medium tracking-wider uppercase ${
                item.label === activeLabel ? "text-accent" : "text-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
