import Link from "next/link";
import { LogoMark } from "./LogoMark";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS } from "./nav-items";

export function SiteHeader({ active }: { active: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-fg/10 bg-surface">
      <div className="mx-auto flex h-14 max-w-app items-center justify-between gap-4 px-4 sm:h-16 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2 text-fg no-underline">
          <LogoMark />
          <span className="font-heading text-base font-bold tracking-wide">OHC FC</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = item.label === active;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex h-11 items-center rounded px-3 font-heading text-sm font-medium tracking-wider uppercase outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive ? "text-accent" : "text-muted hover:text-fg"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-3 bottom-1.5 h-0.5 rounded-full ${isActive ? "bg-accent" : "bg-transparent"}`}
                />
              </Link>
            );
          })}
        </nav>

        <MobileNav items={NAV_ITEMS} activeLabel={active} />
      </div>
    </header>
  );
}
